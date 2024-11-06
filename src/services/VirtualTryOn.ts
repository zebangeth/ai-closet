import * as FileSystem from "expo-file-system";
import jwt from "expo-jwt";

const API_BASE_URL = "https://api.klingai.com";
const ACCESS_KEY = process.env.EXPO_PUBLIC_KWAI_ACCESS_KEY;
const SECRET_KEY = process.env.EXPO_PUBLIC_KWAI_SECRET_KEY;

const POLL_INTERVAL = 1000; // 1 seconds
const MAX_RETRIES = 60; // Maximum number of polling attempts (40 seconds total)

export type TryOnRequest = {
  outfitImageUri: string;
  userPhotoUri: string;
};

export type TryOnResponse = {
  resultImageUri: string;
};

type TaskStatus = "submitted" | "processing" | "succeed" | "failed";

type CreateTaskResponse = {
  code: number;
  message: string;
  request_id: string;
  data: {
    task_id: string;
    task_status: TaskStatus;
    created_at: number;
    updated_at: number;
  };
};

type QueryTaskResponse = {
  code: number;
  message: string;
  request_id: string;
  data: {
    task_id: string;
    task_status: TaskStatus;
    task_status_msg: string;
    created_at: number;
    updated_at: number;
    task_result?: {
      images: Array<{
        index: number;
        url: string;
      }>;
    };
  };
};

// Generate JWT token for API authorization
const generateToken = (): string => {
  if (!SECRET_KEY) throw new Error("SECRET_KEY is not defined");

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: ACCESS_KEY,
    exp: now + 1800, // 30 minutes expiry
    nbf: now - 5, // Valid from 5 seconds ago
  };

  return jwt.encode(payload, SECRET_KEY);
};

const imageToBase64 = async (uri: string): Promise<string> => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    throw new Error("Failed to process image");
  }
};

const createTask = async (humanImageBase64: string, clothImageBase64: string): Promise<string> => {
  const token = generateToken();

  try {
    const response = await fetch(`${API_BASE_URL}/v1/images/kolors-virtual-try-on`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        model_name: "kolors-virtual-try-on-v1",
        human_image: humanImageBase64,
        cloth_image: clothImageBase64,
      }),
    });

    const data: CreateTaskResponse = await response.json();

    if (data.code !== 0) {
      throw new Error(data.message || "Failed to create task");
    }

    return data.data.task_id;
  } catch (error) {
    console.error("Error creating virtual try-on task:", error);
    throw new Error("Failed to initiate virtual try-on");
  }
};

const queryTask = async (taskId: string): Promise<QueryTaskResponse> => {
  const token = generateToken();

  try {
    const response = await fetch(`${API_BASE_URL}/v1/images/kolors-virtual-try-on/${taskId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data: QueryTaskResponse = await response.json();

    if (data.code !== 0) {
      throw new Error(data.message || "Failed to query task");
    }

    return data;
  } catch (error) {
    console.error("Error querying task status:", error);
    throw new Error("Failed to check try-on status");
  }
};

const pollTaskCompletion = async (taskId: string): Promise<string> => {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    const taskData = await queryTask(taskId);
    const status = taskData.data.task_status;

    switch (status) {
      case "succeed":
        if (taskData.data.task_result?.images[0]?.url) {
          return taskData.data.task_result.images[0].url;
        }
        throw new Error("No result image found");

      case "failed":
        throw new Error(taskData.data.task_status_msg || "Virtual try-on failed");

      case "submitted":
      case "processing":
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
        retries++;
        break;

      default:
        throw new Error("Unknown task status");
    }
  }

  throw new Error("Timeout waiting for virtual try-on result");
};

export const virtualTryOn = async (request: TryOnRequest): Promise<TryOnResponse> => {
  try {
    console.debug("[VTON Service] Request Initiated Time:", new Date().toISOString());

    // Convert images to base64
    const [humanImageBase64, clothImageBase64] = await Promise.all([
      imageToBase64(request.userPhotoUri),
      imageToBase64(request.outfitImageUri),
    ]);

    // Create task
    console.debug("[VTON Service] Task Creation Time:", new Date().toISOString());
    const taskId = await createTask(humanImageBase64, clothImageBase64);
    console.debug("[VTON Service] Task Created Time:", new Date().toISOString());

    // Poll for result
    console.debug("[VTON Service] Polling Task Time:", new Date().toISOString());
    const resultUrl = await pollTaskCompletion(taskId);
    console.debug("[VTON Service] Result Received Time:", new Date().toISOString());

    // Download result image and save locally
    const localUri = `${FileSystem.cacheDirectory}try-on-${taskId}.jpg`;
    await FileSystem.downloadAsync(resultUrl, localUri);
    console.debug("[VTON Service] Image Downloaded Time:", new Date().toISOString());

    return {
      resultImageUri: localUri,
    };
  } catch (error) {
    console.error("Virtual try-on error:", error);
    throw error;
  }
};
