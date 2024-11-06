export interface VirtualTryOnItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  tryOnType: "single" | "discover" | "outfit";
  clothingItemId?: string;
  outfitId?: string;
  newClothingImageUri?: string;
  userPhotoUri: string;
  resultImageUri: string;
}
