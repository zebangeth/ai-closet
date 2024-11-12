import React, { useState, useContext, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView, Edge } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import ViewShot, { CaptureOptions } from "react-native-view-shot";
import { OutfitStackScreenProps } from "../types/navigation";
import { colors } from "../styles/colors";
import { typography } from "../styles/globalStyles";
import AddClothingItemOverlay from "../components/outfit/AddClothingItemOverlay";
import OutfitCanvas from "../components/outfit/OutfitCanvas";
import { ClothingContext } from "../contexts/ClothingContext";
import { OutfitContext } from "../contexts/OutfitContext";
import { ClothingItem } from "../types/ClothingItem";
import { Outfit, OutfitItem } from "../types/Outfit";
import { v4 as uuidv4 } from "uuid";

const ITEM_SIZE = 150;

type Props = OutfitStackScreenProps<"OutfitCanvas">;

type ViewShotRef = {
  capture: (options?: CaptureOptions) => Promise<string>;
} & ViewShot;

type CanvasRef = {
  deselectAll: () => void;
};

const OutfitCanvasScreen = ({ navigation, route }: Props) => {
  const isEditing = !!route.params?.id;
  const [isAddItemsVisible, setIsAddItemsVisible] = useState(false);
  const [canvasItems, setCanvasItems] = useState<OutfitItem[]>([]);
  const [canvasLayout, setCanvasLayout] = useState({ width: 0, height: 0 });
  const [isSaving, setIsSaving] = useState(false);

  const viewShotRef = useRef<ViewShotRef>(null);
  const canvasRef = useRef<CanvasRef>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const clothingContext = useContext(ClothingContext);
  const outfitContext = useContext(OutfitContext);

  if (!clothingContext || !outfitContext) {
    return <Text>Loading...</Text>;
  }

  // If editing, load the existing outfit
  useEffect(() => {
    if (isEditing && route.params?.id) {
      const outfit = outfitContext.getOutfit(route.params.id);
      if (outfit) {
        setCanvasItems(outfit.clothingItems);
      }
    }
  }, [isEditing, route.params?.id]);

  // Create a map of clothing items for quick lookup
  const clothingItemsMap = clothingContext.clothingItems.reduce((map, item) => {
    map[item.id] = item;
    return map;
  }, {} as Record<string, ClothingItem>);

  const handleSelectItem = (item: ClothingItem) => {
    const newItem: OutfitItem = {
      id: item.id,
      transform: {
        x: canvasLayout.width / 2 - ITEM_SIZE / 2,
        y: canvasLayout.height / 2 - ITEM_SIZE / 2,
        scale: 1,
        rotation: 0,
      },
      zIndex: canvasItems.length + 1,
    };
    setCanvasItems((prev) => [...prev, newItem]);
  };

  const handleUpdateItem = (index: number, transform: OutfitItem["transform"]) => {
    setCanvasItems((prev) => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], transform };
      return newItems;
    });
  };

  const handleUpdateZIndex = (index: number, zIndex: number) => {
    setCanvasItems((prev) => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], zIndex };
      return newItems;
    });
  };

  const handleDeleteItem = (index: number) => {
    setCanvasItems((prev) => prev.filter((_, i) => i !== index));
  };

  const captureCanvas = async (): Promise<string> => {
    if (!viewShotRef.current) {
      throw new Error("Canvas reference not found");
    }

    try {
      // Set capturing state to true to remove background
      setIsCapturing(true);
      // Deselect all items before capture
      canvasRef.current?.deselectAll();

      // Wait a frame to ensure background is removed
      await new Promise((resolve) => requestAnimationFrame(resolve));

      const uri = await viewShotRef.current.capture({
        format: "png",
        quality: 1,
        result: "base64",
      });

      return uri;
    } catch (error) {
      console.error("Error capturing canvas:", error);
      throw error;
    } finally {
      // Reset capturing state
      setIsCapturing(false);
    }
  };

  const handleSave = async () => {
    if (canvasItems.length === 0) {
      Alert.alert("Error", "Please add at least one item to the outfit");
      return;
    }

    try {
      setIsSaving(true);
      const outfitImageUri = await captureCanvas();

      const outfit: Outfit = {
        id: isEditing ? route.params!.id! : uuidv4(),
        imageUri: outfitImageUri,
        createdAt: isEditing ? outfitContext.getOutfit(route.params!.id!)!.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        clothingItems: canvasItems,
        tags: [],
        season: [],
        occasion: [],
      };

      if (isEditing) {
        outfitContext.updateOutfit(outfit);
      } else {
        outfitContext.addOutfit(outfit);
      }

      navigation.goBack();
    } catch (error) {
      console.error("Error saving outfit:", error);
      Alert.alert("Error", "Failed to save outfit");
    } finally {
      setIsSaving(false);
    }
  };

  const safeAreaEdges: Edge[] = ["top", "left", "right"];

  return (
    <SafeAreaView
      style={styles.container}
      edges={safeAreaEdges}
      onLayout={(e) => setCanvasLayout(e.nativeEvent.layout)}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <MaterialIcons name="arrow-back" size={24} color={colors.icon_stroke} />
        </TouchableOpacity>
        <Text style={styles.title}>Outfit Canvas</Text>
        <TouchableOpacity onPress={handleSave} disabled={isSaving} style={styles.headerButton}>
          <MaterialIcons name="save" size={24} color={isSaving ? colors.text_gray : colors.icon_stroke} />
        </TouchableOpacity>
      </View>

      {/* Canvas Area */}
      <ViewShot
        ref={viewShotRef}
        style={styles.canvasArea}
        options={{
          format: "png",
          quality: 1,
        }}
      >
        <View
          style={[styles.canvasWrapper, { backgroundColor: isCapturing ? "transparent" : colors.thumbnail_background }]}
        >
          <OutfitCanvas
            ref={canvasRef}
            items={canvasItems}
            clothingItems={clothingItemsMap}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
            onUpdateZIndex={handleUpdateZIndex}
          />
        </View>
      </ViewShot>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={[styles.button, isSaving && styles.buttonDisabled]}
          onPress={() => setIsAddItemsVisible(true)}
          disabled={isSaving}
        >
          <Text style={styles.buttonText}>Add Items</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, isSaving && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={isSaving}
        >
          <Text style={styles.buttonText}>Save Outfit</Text>
        </TouchableOpacity>
      </View>

      {/* Add Items Overlay */}
      <AddClothingItemOverlay
        visible={isAddItemsVisible}
        onClose={() => setIsAddItemsVisible(false)}
        onSelectItem={handleSelectItem}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screen_background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider_light,
  },
  headerButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: typography.bold,
    color: colors.text_primary,
  },
  canvasArea: {
    flex: 1,
    margin: 16,
  },
  canvasWrapper: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  bottomButtons: {
    flexDirection: "row",
    padding: 16,
    gap: 16,
  },
  button: {
    flex: 1,
    backgroundColor: colors.primary_yellow,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: typography.bold,
    color: colors.text_primary,
  },
});

export default OutfitCanvasScreen;
