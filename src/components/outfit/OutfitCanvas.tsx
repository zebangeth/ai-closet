import React, { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { View, StyleSheet, LayoutChangeEvent, Pressable } from "react-native";
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

export type CanvasRef = {
  deselectAll: () => void;
};

const OutfitCanvas = forwardRef<CanvasRef, Props>(
  ({ items, clothingItems, onUpdateItem, onDeleteItem, onUpdateZIndex }, ref) => {
    const [canvasLayout, setCanvasLayout] = useState({ width: 0, height: 0 });
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const maxZIndexRef = useRef(Math.max(0, ...items.map((item) => item.zIndex || 0)));

    useImperativeHandle(ref, () => ({
      deselectAll: () => {
        setSelectedIndex(null);
      },
    }));

    const handleLayout = (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;
      setCanvasLayout({ width, height });
    };

    const handleSelectItem = (index: number) => {
      setSelectedIndex(index);
      maxZIndexRef.current += 1;
      onUpdateZIndex(index, maxZIndexRef.current);
    };

    const handleBackgroundPress = () => {
      setSelectedIndex(null);
    };

    const sortedItems = React.useMemo(() => {
      return [...items].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
    }, [items]);

    return (
      <View style={styles.container}>
        <Pressable
          onPress={handleBackgroundPress}
          style={[
            styles.canvas,
            // Remove the background color here to ensure transparency
            { backgroundColor: "transparent" },
          ]}
          onLayout={handleLayout}
        >
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
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvas: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
});

export default OutfitCanvas;
