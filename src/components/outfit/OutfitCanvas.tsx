import React, { useState } from "react";
import { View, StyleSheet, LayoutChangeEvent } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { colors } from "../../styles/colors";
import { ClothingItem } from "../../types/ClothingItem";
import { OutfitItem } from "../../types/Outfit";
import DraggableClothingItem from "./DraggableClothingItem";

type CanvasItem = {
  clothingItem: ClothingItem;
  transform: OutfitItem["transform"];
};

type Props = {
  items: CanvasItem[];
  onUpdateItem: (index: number, transform: OutfitItem["transform"]) => void;
  onDeleteItem: (index: number) => void;
};

const OutfitCanvas = ({ items, onUpdateItem, onDeleteItem }: Props) => {
  const [canvasLayout, setCanvasLayout] = useState({ width: 0, height: 0 });
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setCanvasLayout({ width, height });
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.canvas} onLayout={handleLayout}>
        {items.map((item, index) => (
          <DraggableClothingItem
            key={`${item.clothingItem.id}-${index}`}
            item={item.clothingItem}
            transform={item.transform}
            canvasLayout={canvasLayout}
            onUpdate={(transform) => onUpdateItem(index, transform)}
            onDelete={() => onDeleteItem(index)}
            isSelected={selectedIndex === index}
            onSelect={() => setSelectedIndex(index)}
          />
        ))}
      </View>
    </GestureHandlerRootView>
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
  },
});

export default OutfitCanvas;
