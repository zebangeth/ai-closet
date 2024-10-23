// screens/ClothingDetailScreen.tsx

import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Alert,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { ClothingContext } from "../contexts/ClothingContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ClosetStackParamList } from "../types/navigation";
import { ClothingItem } from "../types/ClothingItem";
import { colors } from "../styles/colors";
import TagChips from "../components/common/TagChips";
import Header from "../components/common/Header";
import CategoryPicker from "../components/common/CategoryPicker";
import SeasonToggle from "../components/common/SeasonToggle";
import YearMonthPicker from "../components/common/YearMonthPicker";
import {
  colors as colorSuggestions,
  brands as brandSuggestions,
  occasions as occasionSuggestions,
} from "../data/suggestions";

type Props = NativeStackScreenProps<ClosetStackParamList, "ClothingDetail">;

const ClothingDetailScreen = ({ route, navigation }: Props) => {
  const { id } = route.params;
  const context = useContext(ClothingContext);

  if (!context) {
    return <Text>Loading...</Text>;
  }

  const { getClothingItem, updateClothingItem, deleteClothingItem } = context;

  // Get the initial item from context
  const contextItem = getClothingItem(id);

  // Manage local state for the form
  const [localItem, setLocalItem] = useState<ClothingItem | undefined>(contextItem);
  const [isDirty, setIsDirty] = useState(false);

  // Update local state when context item changes
  useEffect(() => {
    if (contextItem) {
      setLocalItem(contextItem);
    }
  }, [contextItem]);

  if (!localItem) {
    return (
      <View style={styles.container}>
        <Text>Clothing item not found.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert("Delete Item", "Are you sure you want to delete this clothing item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteClothingItem(id);
          navigation.goBack();
        },
      },
    ]);
  };

  const handleSave = () => {
    if (localItem) {
      updateClothingItem(localItem);
      setIsDirty(false);
      Alert.alert("Success", "Clothing item updated successfully");
    }
  };

  const handleFieldChange = (field: keyof ClothingItem, value: any) => {
    setLocalItem((prevItem) => {
      if (!prevItem) return prevItem;
      return { ...prevItem, [field]: value };
    });
    setIsDirty(true);
  };

  return (
    <View style={styles.container}>
      <Header
        onBack={() => {
          if (isDirty) {
            Alert.alert("Unsaved Changes", "Do you want to save your changes?", [
              {
                text: "Discard",
                style: "destructive",
                onPress: () => navigation.goBack(),
              },
              {
                text: "Save",
                onPress: () => {
                  handleSave();
                  navigation.goBack();
                },
              },
            ]);
          } else {
            navigation.goBack();
          }
        }}
        onDelete={handleDelete}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="always" // Allows tapping on suggestions without dismissing the keyboard
        >
          <Image
            source={{
              uri: localItem.backgroundRemovedImageUri || localItem.imageUri,
            }}
            style={styles.image}
          />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <TagChips
              tags={localItem.tags}
              onAddTag={(tag) => {
                handleFieldChange("tags", [...localItem.tags, tag]);
              }}
              onRemoveTag={(tag) => {
                handleFieldChange(
                  "tags",
                  localItem.tags.filter((t) => t !== tag)
                );
              }}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Item Details</Text>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Category</Text>
              <CategoryPicker
                selectedCategory={localItem.category}
                selectedSubcategory={localItem.subcategory}
                onValueChange={(category, subcategory) => {
                  handleFieldChange("category", category);
                  handleFieldChange("subcategory", subcategory);
                }}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Season</Text>
              <SeasonToggle
                selectedSeasons={localItem.season}
                onValueChange={(seasons) => handleFieldChange("season", seasons)}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Color</Text>
              <TextInput
                style={styles.textInput}
                value={localItem.color}
                placeholder="Enter color"
                onChangeText={(text) => handleFieldChange("color", text)}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Occasion</Text>
              <TextInput
                style={styles.textInput}
                value={localItem.occasion.join(", ")}
                placeholder="Enter occasion(s)"
                onChangeText={(text) =>
                  handleFieldChange(
                    "occasion",
                    text.split(",").map((s) => s.trim())
                  )
                }
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Brand</Text>
              <TextInput
                style={styles.textInput}
                value={localItem.brand}
                placeholder="Enter brand"
                onChangeText={(text) => handleFieldChange("brand", text)}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Purchase Date</Text>
              <YearMonthPicker
                selectedDate={localItem.purchaseDate}
                onValueChange={(date) => handleFieldChange("purchaseDate", date)}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Price</Text>
              <TextInput
                style={styles.fieldInput}
                value={localItem.price ? localItem.price.toString() : ""}
                keyboardType="numeric"
                onChangeText={(text) => {
                  const numericValue = parseFloat(text);
                  handleFieldChange("price", isNaN(numericValue) ? 0 : numericValue);
                }}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {isDirty && (
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screen_background,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  field: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
  },
  saveButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: colors.primary_yellow,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    color: "#fff",
  },
});

export default ClothingDetailScreen;
