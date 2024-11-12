import React, { useState, useRef } from "react";
import { View, StyleSheet, LayoutChangeEvent, Pressable } from "react-native";
import { colors } from "../../styles/colors";
import { ClothingItem } from "../../types/ClothingItem";
import { OutfitItem } from "../../types/Outfit";
import DraggableClothingItem from "./DraggableClothingItem";

type Props = {
  items: OutfitItem[];
  clothingItems: Record<string, ClothingItem>;
  onUpdateItem: (index: number, transform: OutfitItem["transform"]) => void;
  onDeleteItem: (index: number) => void;
  onUpdateZIndex: (index: number, zIndex: number) => void;
};

const OutfitCanvas = ({ items, clothingItems, onUpdateItem, onDeleteItem, onUpdateZIndex }: Props) => {
  const [canvasLayout, setCanvasLayout] = useState({ width: 0, height: 0 });
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const maxZIndexRef = useRef(Math.max(0, ...items.map((item) => item.zIndex || 0)));

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setCanvasLayout({ width, height });
  };

  // Handle item selection and z-index update
  const handleSelectItem = (index: number) => {
    setSelectedIndex(index);
    maxZIndexRef.current += 1;
    onUpdateZIndex(index, maxZIndexRef.current);
  };

  // Create a stable sorted array of items
  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
  }, [items]);

  const handleBackgroundPress = () => {
    setSelectedIndex(null);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={handleBackgroundPress} style={styles.canvas} onLayout={handleLayout}>
        {sortedItems.map((item) => {
          const originalIndex = items.findIndex((i) => i.id === item.id);
          const clothingItem = clothingItems[item.id];

          if (!clothingItem) {
            return null;
          }

          return (
            <DraggableClothingItem
              key={item.id}
              item={clothingItem}
              transform={item.transform}
              canvasLayout={canvasLayout}
              onUpdate={(transform) => onUpdateItem(originalIndex, transform)}
              onDelete={() => onDeleteItem(originalIndex)}
              isSelected={selectedIndex === originalIndex}
              onSelect={() => handleSelectItem(originalIndex)}
              style={{ zIndex: item.zIndex || 0 }}
            />
          );
        })}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvas: {
    flex: 1,
    backgroundColor: colors.thumbnail_background,
    borderRadius: 12,
    overflow: "hidden",
  },
});

export default OutfitCanvas;
