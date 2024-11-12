export interface OutfitItem {
  id: string; // id of the clothing item
  transform: {
    x: number;
    y: number;
    scale: number;
    rotation: number;
  };
  zIndex: number;
}

export interface Outfit {
  id: string;
  imageUri: string;
  createdAt: string;
  updatedAt: string;
  clothingItems: OutfitItem[]; // Array of clothing item references with their canvas positions and zIndex
  tags: string[]; // custom tags, e.g., 'summer looks', 'date night'
  season: string[]; // Spring, Summer, Fall, Winter
  occasion: string[]; // Casual, Work, Formal, Party
}
