import React, { createContext, useState, useEffect, ReactNode } from "react";
import { ClothingItem } from "../types/ClothingItem";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ClothingContextType = {
  clothingItems: ClothingItem[];
  getClothingItem: (id: string) => ClothingItem | undefined;
  addClothingItem: (item: ClothingItem) => void;
  updateClothingItem: (item: ClothingItem) => void;
  deleteClothingItem: (id: string) => void;
};

export const ClothingContext = createContext<ClothingContextType | null>(null);

export const ClothingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);

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

  const getClothingItem = (id: string) => {
    return clothingItems.find((item) => item.id === id);
  };

  const addClothingItem = (item: ClothingItem) => {
    setClothingItems((prevItems) => [...prevItems, item]);
  };

  const updateClothingItem = (updatedItem: ClothingItem) => {
    setClothingItems((prevItems) =>
      prevItems.map((item) =>
        item.id === updatedItem.id ? { ...updatedItem, updatedAt: new Date().toISOString() } : item
      )
    );
  };

  const deleteClothingItem = (id: string) => {
    setClothingItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <ClothingContext.Provider
      value={{
        clothingItems,
        getClothingItem,
        addClothingItem,
        updateClothingItem,
        deleteClothingItem,
      }}
    >
      {children}
    </ClothingContext.Provider>
  );
};
