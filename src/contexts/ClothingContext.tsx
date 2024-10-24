import React, { createContext, useState, useEffect, ReactNode, useMemo, useCallback } from "react";
import { ClothingItem } from "../types/ClothingItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { categories } from "../data/categories";

type CategoryCounts = {
  All: number;
  [key: string]: number;
};

type TagData = {
  tag: string;
  count: number;
}[];

type ClothingFilters = {
  category?: string;
  tags?: string[];
};

type ClothingContextType = {
  // Data
  clothingItems: ClothingItem[];
  categoryData: CategoryCounts;
  tagData: TagData;

  // Filtering
  activeFilters: ClothingFilters;
  filteredItems: ClothingItem[];
  setFilter: (type: keyof ClothingFilters, value: any) => void;
  clearFilters: () => void;

  // CRUD operations
  getClothingItem: (id: string) => ClothingItem | undefined;
  addClothingItem: (item: ClothingItem) => void;
  updateClothingItem: (item: ClothingItem) => void;
  deleteClothingItem: (id: string) => void;
};

export const ClothingContext = createContext<ClothingContextType | null>(null);

export const ClothingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [activeFilters, setActiveFilters] = useState<ClothingFilters>({
    category: "All",
    tags: [],
  });

  // Load clothing items from AsyncStorage on mount
  useEffect(() => {
    const loadClothingItems = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("@clothing_items");
        if (jsonValue != null) {
          setClothingItems(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.error("Error loading clothing items:", e);
      }
    };
    loadClothingItems();
  }, []);

  // Save clothing items to AsyncStorage whenever they change
  useEffect(() => {
    const saveClothingItems = async () => {
      try {
        await AsyncStorage.setItem("@clothing_items", JSON.stringify(clothingItems));
      } catch (e) {
        console.error("Error saving clothing items:", e);
      }
    };
    saveClothingItems();
  }, [clothingItems]);

  // Memoized category counts
  const categoryData = useMemo(() => {
    let counts: CategoryCounts = { All: clothingItems.length };

    // Use reduce for better performance than forEach
    counts = Object.keys(categories).reduce((acc, category) => {
      acc[category] = clothingItems.reduce((count, item) => (item.category === category ? count + 1 : count), 0);
      return acc;
    }, counts);

    return counts;
  }, [clothingItems]);

  // Memoized tag frequency data
  const tagData = useMemo(() => {
    // Use reduce to build tag counts in a single pass
    const tagCounts = clothingItems.reduce((acc, item) => {
      item.tags.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    // Convert to array and sort by frequency
    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }, [clothingItems]);

  // Memoized filtered items with optimized filtering
  const filteredItems = useMemo(() => {
    // Early return if no filters are active
    if (activeFilters.category === "All" && (!activeFilters.tags || activeFilters.tags.length === 0)) {
      return clothingItems;
    }

    // Create a Set of tag filters for O(1) lookup
    const tagFilters = new Set(activeFilters.tags);

    return clothingItems.filter((item) => {
      // Category filter
      if (activeFilters.category !== "All" && item.category !== activeFilters.category) {
        return false;
      }

      // Tag filter - only check if we have active tag filters
      if (tagFilters.size > 0) {
        return Array.from(tagFilters).every((tag) => item.tags.includes(tag));
      }

      return true;
    });
  }, [clothingItems, activeFilters]);

  // Filter management
  const setFilter = useCallback((type: keyof ClothingFilters, value: any) => {
    setActiveFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setActiveFilters({
      category: "All",
      tags: [],
    });
  }, []);

  // CRUD operations
  const getClothingItem = useCallback(
    (id: string) => {
      return clothingItems.find((item) => item.id === id);
    },
    [clothingItems]
  );

  const addClothingItem = useCallback((item: ClothingItem) => {
    setClothingItems((prev) => [...prev, item]);
  }, []);

  const updateClothingItem = useCallback((updatedItem: ClothingItem) => {
    setClothingItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? { ...updatedItem, updatedAt: new Date().toISOString() } : item))
    );
  }, []);

  const deleteClothingItem = useCallback((id: string) => {
    setClothingItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const contextValue = {
    // Data
    clothingItems,
    categoryData,
    tagData,

    // Filtering
    activeFilters,
    filteredItems,
    setFilter,
    clearFilters,

    // CRUD operations
    getClothingItem,
    addClothingItem,
    updateClothingItem,
    deleteClothingItem,
  };

  return <ClothingContext.Provider value={contextValue}>{children}</ClothingContext.Provider>;
};
