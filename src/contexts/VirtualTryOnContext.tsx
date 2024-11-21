import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VirtualTryOnItem } from "../types/VirtualTryOn";
import { v4 as uuidv4 } from "uuid";

type VirtualTryOnContextType = {
  recentTryOns: VirtualTryOnItem[];
  addTryOn: (tryOn: Omit<VirtualTryOnItem, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  clearHistory: () => Promise<void>;
  deleteHistoryItems: (ids: Set<string>) => Promise<void>; // New method
};

export const VirtualTryOnContext = createContext<VirtualTryOnContextType | null>(null);

export const VirtualTryOnProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [recentTryOns, setRecentTryOns] = useState<VirtualTryOnItem[]>([]);

  // Load try-on history from AsyncStorage on mount
  useEffect(() => {
    const loadTryOns = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("@try_on_history");
        if (jsonValue != null) {
          setRecentTryOns(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.error("Error loading try-on history:", e);
      }
    };
    loadTryOns();
  }, []);

  // Save try-ons to AsyncStorage whenever they change
  useEffect(() => {
    const saveTryOns = async () => {
      try {
        await AsyncStorage.setItem("@try_on_history", JSON.stringify(recentTryOns));
      } catch (e) {
        console.error("Error saving try-on history:", e);
      }
    };
    saveTryOns();
  }, [recentTryOns]);

  const addTryOn = async (tryOn: Omit<VirtualTryOnItem, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newTryOn: VirtualTryOnItem = {
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
      ...tryOn,
    };

    setRecentTryOns((prev) => [newTryOn, ...prev].slice(0, 100)); // Keep only the 100 most recent
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem("@try_on_history");
      setRecentTryOns([]);
    } catch (e) {
      console.error("Error clearing try-on history:", e);
    }
  };

  // New method to delete specific items
  const deleteHistoryItems = async (ids: Set<string>) => {
    try {
      const updatedTryOns = recentTryOns.filter((item) => !ids.has(item.id));
      setRecentTryOns(updatedTryOns);
    } catch (e) {
      console.error("Error deleting try-on history items:", e);
      throw e; // Re-throw to handle in the UI
    }
  };

  return (
    <VirtualTryOnContext.Provider value={{ recentTryOns, addTryOn, clearHistory, deleteHistoryItems }}>
      {children}
    </VirtualTryOnContext.Provider>
  );
};
