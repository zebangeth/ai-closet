import React, { createContext, useState, useEffect, ReactNode, useMemo, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import { ClothingItem, createNewClothingItem } from "../types/ClothingItem";
import { categories } from "../data/categories";
import { removeBackground } from "../services/BackgroundRemoval";
import { categorizeClothing } from "../services/ClothingCategorization";

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

type ProcessingError = {
  message: string;
  code?: string;
};

type ProcessingCallbacks = {
  onBackgroundRemovalComplete?: () => void;
  onCategorizationComplete?: () => void;
  onError?: (error: ProcessingError) => void;
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
  addClothingItemFromImage: (imageUri: string, callbacks?: ProcessingCallbacks) => Promise<string>; // Returns new item ID
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

  // Memoized filtered items
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

  const addClothingItemFromImage = useCallback(
    async (imageUri: string, callbacks?: ProcessingCallbacks): Promise<string> => {
      // Create a new clothing item with initial state
      const newItem = {
        ...createNewClothingItem(imageUri),
        id: uuidv4(),
      };

      // Add the item to state immediately
      setClothingItems((prev) => [...prev, newItem]);

      // Start background removal process
      const processBackgroundRemoval = async () => {
        try {
          // Update status to processing
          setClothingItems((prev) =>
            prev.map((item) =>
              item.id === newItem.id
                ? {
                    ...item,
                    processingStatus: {
                      ...item.processingStatus,
                      backgroundRemoval: "processing",
                    },
                  }
                : item
            )
          );

          // Process the image
          const backgroundRemovedImageUri = await removeBackground(imageUri);

          // Update the item with the processed image
          setClothingItems((prev) =>
            prev.map((item) =>
              item.id === newItem.id
                ? {
                    ...item,
                    backgroundRemovedImageUri,
                    processingStatus: {
                      ...item.processingStatus,
                      backgroundRemoval: "completed",
                    },
                  }
                : item
            )
          );

          callbacks?.onBackgroundRemovalComplete?.();
        } catch (error) {
          const processedError: ProcessingError = {
            message: error instanceof Error ? error.message : "An unknown error occurred during background removal",
            code: "BACKGROUND_REMOVAL_ERROR",
          };

          console.error("Background removal error:", processedError);

          setClothingItems((prev) =>
            prev.map((item) =>
              item.id === newItem.id
                ? {
                    ...item,
                    processingStatus: {
                      ...item.processingStatus,
                      backgroundRemoval: "error",
                    },
                    processingError: {
                      ...item.processingError,
                      backgroundRemoval: processedError.message,
                    },
                  }
                : item
            )
          );

          callbacks?.onError?.(processedError);
        }
      };

      // Start categorization process
      const processCategorization = async () => {
        try {
          // Update status to processing
          setClothingItems((prev) =>
            prev.map((item) =>
              item.id === newItem.id
                ? {
                    ...item,
                    processingStatus: {
                      ...item.processingStatus,
                      categorization: "processing",
                    },
                  }
                : item
            )
          );

          // Get AI categorization
          const categoryData = await categorizeClothing(imageUri);

          // Update the item with the categorization data
          setClothingItems((prev) =>
            prev.map((item) =>
              item.id === newItem.id
                ? {
                    ...item,
                    ...categoryData,
                    processingStatus: {
                      ...item.processingStatus,
                      categorization: "completed",
                    },
                  }
                : item
            )
          );

          callbacks?.onCategorizationComplete?.();
        } catch (error) {
          const processedError: ProcessingError = {
            message: error instanceof Error ? error.message : "An unknown error occurred during categorization",
            code: "CATEGORIZATION_ERROR",
          };

          console.error("Categorization error:", processedError);

          setClothingItems((prev) =>
            prev.map((item) =>
              item.id === newItem.id
                ? {
                    ...item,
                    processingStatus: {
                      ...item.processingStatus,
                      categorization: "error",
                    },
                    processingError: {
                      ...item.processingError,
                      categorization: processedError.message,
                    },
                  }
                : item
            )
          );

          callbacks?.onError?.(processedError);
        }
      };

      // Start both processes in parallel
      Promise.all([processBackgroundRemoval(), processCategorization()]).catch((error) => {
        const processedError: ProcessingError = {
          message: error instanceof Error ? error.message : "An unknown error occurred",
          code: "GENERAL_PROCESSING_ERROR",
        };
        console.error("Processing error:", processedError);
        callbacks?.onError?.(processedError);
      });

      return newItem.id;
    },
    []
  );

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
    addClothingItemFromImage,
    updateClothingItem,
    deleteClothingItem,
  };

  return <ClothingContext.Provider value={contextValue}>{children}</ClothingContext.Provider>;
};
