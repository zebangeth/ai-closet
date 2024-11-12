import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { OutfitStackScreenProps } from "../types/navigation";
import { colors } from "../styles/colors";
import { typography } from "../styles/globalStyles";
import AddClothingItemOverlay from "../components/outfit/AddClothingItemOverlay";
import { ClothingItem } from "../types/ClothingItem";

type Props = OutfitStackScreenProps<"OutfitCanvas">;

const OutfitCanvasScreen = ({ navigation, route }: Props) => {
  const isEditing = !!route.params?.id;
  const [isAddItemsVisible, setIsAddItemsVisible] = useState(false);

  const handleSelectItem = (item: ClothingItem) => {
    // TODO: Add the selected item to the canvas
    console.log("Selected item:", item);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <MaterialIcons name="arrow-back" size={24} color={colors.icon_stroke} />
        </TouchableOpacity>
        <Text style={styles.title}>Outfit Canvas</Text>
        <TouchableOpacity onPress={() => {}} style={styles.headerButton}>
          <MaterialIcons name="save" size={24} color={colors.icon_stroke} />
        </TouchableOpacity>
      </View>

      {/* Canvas Area Placeholder */}
      <View style={styles.canvasArea}>
        <Text style={styles.placeholderText}>Canvas Area</Text>
      </View>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.button} onPress={() => setIsAddItemsVisible(true)}>
          <Text style={styles.buttonText}>Add Items</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => {}}>
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
