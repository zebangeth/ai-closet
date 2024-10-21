export interface ClothingItem {
  id: string;
  imageUri: string;
  backgroundRemovedImageUri: string;
  createdAt: string;
  updatedAt: string;
  category: string;
  subcategory: string;
  tags: string[]; // custom tags, e.g. 'summer favorite', 'work outfit'
  color: string;
  season: string[];
  occasion: string[];
  brand: string;
  purchaseDate: string;
  price: number;
}
