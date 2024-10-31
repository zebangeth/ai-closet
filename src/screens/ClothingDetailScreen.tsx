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
import { ClothingDetailScreenProps as Props } from "../types/navigation";
import { ClothingItem } from "../types/ClothingItem";
import { colors } from "../styles/colors";
import TagChips from "../components/common/TagChips";
import Header from "../components/common/Header";
import CategoryPicker from "../components/common/CategoryPicker";
import MultiSelectToggle from "../components/common/MultiSelectToggle";
import YearMonthPicker from "../components/common/YearMonthPicker";
import { colors as colorOptions, seasons, occasions } from "../data/options";
import { brands as brandSuggestions } from "../data/suggestions";
import { typography } from "../styles/globalStyles";
import { SafeAreaView } from "react-native-safe-area-context";

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
    <SafeAreaView style={styles.container}>
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

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="always" // Allows tapping on suggestions without dismissing the keyboard
        >
          <Image
            source={{
              uri: localItem.backgroundRemovedImageUri || localItem.imageUri,
            }}
            resizeMode="contain"
            style={styles.image}
          />

          <View style={[styles.section, { paddingTop: 14 }]}>
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
              <Text style={styles.fieldLabel}>Color</Text>
              <TextInput
                style={styles.textInput}
                value={localItem.color.join(", ")}
                placeholder="Enter color(s)"
                onChangeText={(text) =>
                  handleFieldChange(
                    "color",
                    text.split(",").map((s) => s.trim())
                  )
                }
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Season</Text>
              <MultiSelectToggle
                options={seasons}
                selectedValues={localItem.season}
                onValueChange={(selectedSeasons) => handleFieldChange("season", selectedSeasons)}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Occasion</Text>
              <MultiSelectToggle
                options={occasions}
                selectedValues={localItem.occasion}
                onValueChange={(selectedOccasions) => handleFieldChange("occasion", selectedOccasions)}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screen_background,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#F8F8F8",
  },
  section: {
    paddingVertical: 8,
  },
  sectionTitle: {
    fontFamily: typography.bold,
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  field: {
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  fieldLabel: {
    fontFamily: typography.medium,
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
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: typography.bold,
    color: colors.text_primary,
  },
});

export default ClothingDetailScreen;
