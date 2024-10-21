import React, { createContext, useState, useEffect } from 'react';
import { ClothingItem } from '../models/ClothingItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

interface ClothingContextProps {
  clothingItems: ClothingItem[];
  addClothingItem: (item: Omit<ClothingItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateClothingItem: (item: ClothingItem) => Promise<void>;
  deleteClothingItem: (id: string) => Promise<void>;
}

export const ClothingContext = createContext<ClothingContextProps>({
  clothingItems: [],
  addClothingItem: async () => {},
  updateClothingItem: async () => {},
  deleteClothingItem: async () => {},
});

export const ClothingProvider: React.FC = ({ children }) => {
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);

  useEffect(() => {
    loadClothingItems();
  }, []);

  const loadClothingItems = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@clothing_items');
      if (jsonValue != null) {
        setClothingItems(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('Failed to load clothing items.', e);
    }
  };

  const saveClothingItems = async (items: ClothingItem[]) => {
    try {
      const jsonValue = JSON.stringify(items);
      await AsyncStorage.setItem('@clothing_items', jsonValue);
    } catch (e) {
      console.error('Failed to save clothing items.', e);
    }
  };

  const addClothingItem = async (
    item: Omit<ClothingItem, 'id' | 'createdAt' | 'updatedAt'>,
  ) => {
    const newItem: ClothingItem = {
      ...item,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updatedItems = [...clothingItems, newItem];
    setClothingItems(updatedItems);
    await saveClothingItems(updatedItems);
  };

  const updateClothingItem = async (item: ClothingItem) => {
    const index = clothingItems.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      const updatedItems = [...clothingItems];
      updatedItems[index] = { ...item, updatedAt: new Date() };
      setClothingItems(updatedItems);
      await saveClothingItems(updatedItems);
    }
  };

  const deleteClothingItem = async (id: string) => {
    const updatedItems = clothingItems.filter((item) => item.id !== id);
    setClothingItems(updatedItems);
    await saveClothingItems(updatedItems);
  };

  return (
    <ClothingContext.Provider
      value={{ clothingItems, addClothingItem, updateClothingItem, deleteClothingItem }}
    >
      {children}
    </ClothingContext.Provider>
  );
};
