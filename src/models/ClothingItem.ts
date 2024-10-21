export interface ClothingItem {
  id: string;
  name: string;
  category: string;
  tags: string[];
  attributes: {
    color: string;
    season: string;
    occasion: string;
    brand: string;
    purchaseDate: Date | null;
    price: number | null;
  };
  imageUri: string;
  backgroundRemovedImageUri: string;
  createdAt: Date;
  updatedAt: Date;
}
