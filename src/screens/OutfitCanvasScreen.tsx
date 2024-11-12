import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { OutfitStackScreenProps } from "../types/navigation";
import { colors } from "../styles/colors";
import { typography } from "../styles/globalStyles";
import AddClothingItemOverlay from "../components/outfit/AddClothingItemOverlay";
import OutfitCanvas from "../components/outfit/OutfitCanvas";
import { ClothingItem } from "../types/ClothingItem";
import { OutfitItem } from "../types/Outfit";

type Props = OutfitStackScreenProps<"OutfitCanvas">;

type CanvasItem = {
  clothingItem: ClothingItem;
  transform: OutfitItem["transform"];
};

const OutfitCanvasScreen = ({ navigation, route }: Props) => {
  const isEditing = !!route.params?.id;
  const [isAddItemsVisible, setIsAddItemsVisible] = useState(false);
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);

  const handleSelectItem = (item: ClothingItem) => {
    // Add new item to the canvas center with default transform
    const newItem: CanvasItem = {
      clothingItem: item,
      transform: {
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
      },
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

  const handleDeleteItem = (index: number) => {
    Alert.alert("Delete Item", "Are you sure you want to remove this item from the outfit?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setCanvasItems((prev) => prev.filter((_, i) => i !== index));
        },
      },
    ]);
  };

  const handleSave = () => {
    if (canvasItems.length === 0) {
      Alert.alert("Error", "Please add at least one item to the outfit");
      return;
    }
    // TODO: Implement save functionality
    console.log("Saving outfit:", canvasItems);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <MaterialIcons name="arrow-back" size={24} color={colors.icon_stroke} />
        </TouchableOpacity>
        <Text style={styles.title}>Outfit Canvas</Text>
        <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
          <MaterialIcons name="save" size={24} color={colors.icon_stroke} />
        </TouchableOpacity>
      </View>

      {/* Canvas Area */}
      <View style={styles.canvasArea}>
        <OutfitCanvas items={canvasItems} onUpdateItem={handleUpdateItem} onDeleteItem={handleDeleteItem} />
      </View>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.button} onPress={() => setIsAddItemsVisible(true)}>
          <Text style={styles.buttonText}>Add Items</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.thumbnail_background,
    margin: 16,
    borderRadius: 12,
  },
  placeholderText: {
    fontSize: 16,
    fontFamily: typography.medium,
    color: colors.text_gray,
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
  buttonText: {
    fontSize: 16,
    fontFamily: typography.bold,
    color: colors.text_primary,
  },
});

export default OutfitCanvasScreen;
