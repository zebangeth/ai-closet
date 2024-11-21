export interface ClothingItem {
  id: string;
  imageUri: string;
  backgroundRemovedImageUri: string;
  createdAt: string;
  updatedAt: string;
  category: string;
  subcategory: string;
  tags: string[]; // custom tags, e.g. 'summer favorite', 'work outfit'
  color: string[];
  season: string[];
  occasion: string[];
  brand: string;
  purchaseDate: string;
  price: number;

  // processing status fields
  processingStatus: {
    backgroundRemoval: "pending" | "processing" | "completed" | "error";
    categorization: "pending" | "processing" | "completed" | "error";
  };
  processingError?: {
    backgroundRemoval?: string;
    categorization?: string;
  };
}

// Helper function to create a new clothing item
export const createNewClothingItem = (imageUri: string): ClothingItem => ({
  id: "", // Should be set by the caller
  imageUri,
  backgroundRemovedImageUri: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  category: "",
  subcategory: "",
  tags: [],
  color: [],
  season: [],
  occasion: [],
  brand: "",
  purchaseDate: "",
  price: 0,
  processingStatus: {
    backgroundRemoval: "pending",
    categorization: "pending",
  },
});
