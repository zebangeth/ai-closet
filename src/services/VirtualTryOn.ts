export type TryOnRequest = {
  outfitImageUri: string;
  userPhotoUri: string;
};

export type TryOnResponse = {
  resultImageUri: string;
};

// Mock service that simulates API call with delay
export const virtualTryOn = async (request: TryOnRequest): Promise<TryOnResponse> => {
  // Simulate response delay
  await new Promise((resolve) => setTimeout(resolve, 31000));

  // For mock response, create a data URI with a placeholder image
  // In real implementation, this would be the processed image from the API
  return {
    resultImageUri: request.userPhotoUri,
  };
};
