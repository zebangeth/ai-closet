import * as FileSystem from "expo-file-system";

const FAL_API_KEY = process.env.EXPO_PUBLIC_FAL_KEY;
const API_ENDPOINT = "https://queue.fal.run/fal-ai/birefnet/v2";

export const removeBackground = async (imageUri: string): Promise<string> => {
  console.debug("[BG Removal Service] Request Initiated Time:", new Date().toISOString());
  try {
    // Read the image file and convert it to Base64
    const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: FileSystem.EncodingType.Base64 });
    const base64Uri = `data:image/jpeg;base64,${base64}`;
    console.debug("[BG Removal Service] Image Read Time:", new Date().toISOString());

    // Prepare the payload
    const payload = {
      image_url: base64Uri,
      model: "General Use (Light)",
      operating_resolution: "1024x1024",
      output_format: "png",
      refine_foreground: true,
    };

    // Submit the request
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Key ${FAL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.debug("[BG Removal Service] Request Submitted Time:", new Date().toISOString());

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error submitting background removal request:", errorText);
      throw new Error("Failed to submit background removal request");
    }

    const responseData = await response.json();
    const { status_url, response_url } = responseData;

    if (!status_url || !response_url) {
      throw new Error("Invalid response from background removal API");
    }

    // Poll for status
    let status = "";
    while (status !== "COMPLETED") {
      await new Promise((resolve) => setTimeout(resolve, 200));

      const statusResponse = await fetch(status_url, {
        method: "GET",
        headers: {
          Authorization: `Key ${FAL_API_KEY}`,
          "Content-Type": "application/json",
        },
      });

      if (!statusResponse.ok) {
        const errorText = await statusResponse.text();
        console.error("Error checking status:", errorText);
        throw new Error("Failed to check status");
      }

      const statusData = await statusResponse.json();
      status = statusData.status;

      if (status === "FAILED" || status === "CANCELLED") {
        throw new Error(`Background removal request ${status}`);
      }
    }

    // Get the result
    const resultResponse = await fetch(response_url, {
      method: "GET",
      headers: {
        Authorization: `Key ${FAL_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!resultResponse.ok) {
      const errorText = await resultResponse.text();
      console.error("Error getting result:", errorText);
      throw new Error("Failed to get result");
    }

    const resultData = await resultResponse.json();
    console.debug("[BG Removal Service] Process Complete Time:", new Date().toISOString());
    const imageUrl = resultData.image.url;

    if (!imageUrl) {
      throw new Error("No image URL in the result");
    }

    // Download the processed image
    const fileUri = FileSystem.documentDirectory + `background-removed-${Date.now()}.png`;
    const downloadResumable = FileSystem.createDownloadResumable(imageUrl, fileUri);

    const downloadResult = await downloadResumable.downloadAsync();
    console.debug("[BG Removal Service] Download Complete Time:", new Date().toISOString());

    if (downloadResult && downloadResult.status === 200) {
      return downloadResult.uri;
    } else {
      throw new Error("Failed to download processed image");
    }
  } catch (error) {
    console.error("Error in removeBackground:", error);
    throw error;
  }
};
