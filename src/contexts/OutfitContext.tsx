import React, { createContext, useState, useEffect, ReactNode, useMemo, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Outfit, OutfitItem } from "../types/Outfit";

type TagData = {
  tag: string;
  count: number;
}[];

type OutfitFilters = {
  tags?: string[];
};

type OutfitContextType = {
  // Data
  outfits: Outfit[];
  tagData: TagData;

  // Filtering
  activeFilters: OutfitFilters;
  filteredOutfits: Outfit[];
  setFilter: (type: keyof OutfitFilters, value: any) => void;
  clearFilters: () => void;

  // CRUD operations
  getOutfit: (id: string) => Outfit | undefined;
  addOutfit: (outfit: Outfit) => void;
  updateOutfit: (outfit: Outfit) => void;
  deleteOutfit: (id: string) => void;

  // Helper functions
  getMaxZIndex: (outfitId: string) => number; // Added helper function
};

export const OutfitContext = createContext<OutfitContextType | null>(null);

export const OutfitProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [activeFilters, setActiveFilters] = useState<OutfitFilters>({
    tags: [],
  });

  // Load outfits from AsyncStorage on mount
  useEffect(() => {
    const loadOutfits = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("@outfits");
        if (jsonValue != null) {
          setOutfits(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.error("Error loading outfits:", e);
      }
    };
    loadOutfits();
  }, []);

  // Save outfits to AsyncStorage whenever they change
  useEffect(() => {
    const saveOutfits = async () => {
      try {
        await AsyncStorage.setItem("@outfits", JSON.stringify(outfits));
      } catch (e) {
        console.error("Error saving outfits:", e);
      }
    };
    saveOutfits();
  }, [outfits]);

  // Memoized tag frequency data
  const tagData = useMemo(() => {
    const tagCounts = outfits.reduce((acc, outfit) => {
      outfit.tags.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }, [outfits]);

  // Memoized filtered outfits
  const filteredOutfits = useMemo(() => {
    if (!activeFilters.tags || activeFilters.tags.length === 0) {
      return outfits;
    }

    const tagFilters = new Set(activeFilters.tags);

    return outfits.filter((outfit) => {
      return Array.from(tagFilters).every((tag) => outfit.tags.includes(tag));
    });
  }, [outfits, activeFilters]);

  // Filter management
  const setFilter = useCallback((type: keyof OutfitFilters, value: any) => {
    setActiveFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setActiveFilters({
      tags: [],
    });
  }, []);

  // CRUD operations
  const getOutfit = useCallback(
    (id: string) => {
      return outfits.find((outfit) => outfit.id === id);
    },
    [outfits]
  );

  const addOutfit = useCallback((outfit: Outfit) => {
    setOutfits((prev) => [...prev, outfit]);
  }, []);

  const updateOutfit = useCallback((updatedOutfit: Outfit) => {
    setOutfits((prev) =>
      prev.map((outfit) =>
        outfit.id === updatedOutfit.id ? { ...updatedOutfit, updatedAt: new Date().toISOString() } : outfit
      )
    );
  }, []);

  const deleteOutfit = useCallback((id: string) => {
    setOutfits((prev) => prev.filter((outfit) => outfit.id !== id));
  }, []);

  // Helper function to get max zIndex for an outfit
  const getMaxZIndex = useCallback(
    (outfitId: string) => {
      const outfit = outfits.find((o) => o.id === outfitId);
      if (!outfit) return 0;

      return Math.max(0, ...outfit.clothingItems.map((item) => item.zIndex));
    },
    [outfits]
  );

  const contextValue = {
    outfits,
    tagData,
    activeFilters,
    filteredOutfits,
    setFilter,
    clearFilters,
    getOutfit,
    addOutfit,
    updateOutfit,
    deleteOutfit,
    getMaxZIndex,
  };

  return <OutfitContext.Provider value={contextValue}>{children}</OutfitContext.Provider>;
};
