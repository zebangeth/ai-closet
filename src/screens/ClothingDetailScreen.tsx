import React, { useContext, useState, useEffect, useRef } from "react";
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
import { SafeAreaView, Edge } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ClothingContext } from "../contexts/ClothingContext";
import { ClosetStackScreenProps, RootStackScreenProps } from "../types/navigation";
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

// Style Constants
const SPACING = {
  VERTICAL: 16,
  HORIZONTAL: 16,
  SECTION: 12,
  SMALL: 8,
  TINY: 4,
};

const FONT_SIZE = {
  SECTION_TITLE: 18,
  REGULAR: 16,
};

const CONTAINER = {
  BOTTOM_BUTTON: 20,
  MIN_INPUT_HEIGHT: 24,
  BORDER_RADIUS: {
    SMALL: 8,
    MEDIUM: 12,
  },
  SCROLL_BOTTOM_PADDING: 100,
  ICON_SIZE: 30,
};

const FLEX = {
  LABEL: 1,
  VALUE: 2,
};

// Types
type Props = ClosetStackScreenProps<"ClothingDetail"> | RootStackScreenProps<"ClothingDetailModal">;

// DetailField component for text input fields
const DetailField = ({
  label,
  value,
  onChangeText,
  keyboardType = "default",
  placeholder = "",
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: "default" | "numeric";
  placeholder?: string;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Pressable
        style={[styles.valueContainer, isFocused && styles.valueContainerFocused]}
        onPress={() => inputRef.current?.focus()}
      >
        <TextInput
          ref={inputRef}
          style={styles.detailValue}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          placeholder={placeholder}
          placeholderTextColor={colors.text_gray}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <MaterialCommunityIcons name="chevron-right" size={CONTAINER.ICON_SIZE} color={colors.text_gray} />
      </Pressable>
    </View>
  );
};

// MultiSelectField component for seasons and occasions
const MultiSelectField = ({
  label,
  selectedValues,
  options,
  onValueChange,
}: {
  label: string;
  selectedValues: string[];
  options: string[];
  onValueChange: (values: string[]) => void;
}) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <View style={styles.multiSelectContainer}>
      <MultiSelectToggle options={options} selectedValues={selectedValues} onValueChange={onValueChange} />
    </View>
  </View>
);

const ClothingDetailScreen = ({ route, navigation }: Props) => {
  const { id } = route.params;
  const context = useContext(ClothingContext);

  // Determine if we're in modal mode by checking the route name
  const isModal = route.name === "ClothingDetailModal";

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

  // Remove SafeAreaView for the top edge in modal mode
  const safeAreaEdges: Edge[] = isModal ? ["left", "right"] : ["top", "left", "right"];

  return (
    <SafeAreaView style={styles.container} edges={safeAreaEdges}>
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
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Image
            source={{
              uri: localItem.backgroundRemovedImageUri || localItem.imageUri,
            }}
            resizeMode="contain"
            style={styles.image}
          />

          <View style={styles.section}>
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

            {/* Category */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category</Text>
              <CategoryPicker
                selectedCategory={localItem.category}
                selectedSubcategory={localItem.subcategory}
                onValueChange={(category, subcategory) => {
                  handleFieldChange("category", category);
                  handleFieldChange("subcategory", subcategory);
                }}
              />
            </View>

            {/* Color */}
            <DetailField
              label="Color"
              value={localItem.color.join(", ")}
              onChangeText={(text) =>
                handleFieldChange(
                  "color",
                  text.split(",").map((s) => s.trim())
                )
              }
              placeholder="Enter color(s)"
            />

            {/* Season */}
            <MultiSelectField
              label="Season"
              selectedValues={localItem.season}
              options={seasons}
              onValueChange={(selectedSeasons) => handleFieldChange("season", selectedSeasons)}
            />

            {/* Occasion */}
            <MultiSelectField
              label="Occasion"
              selectedValues={localItem.occasion}
              options={occasions}
              onValueChange={(selectedOccasions) => handleFieldChange("occasion", selectedOccasions)}
            />

            {/* Brand */}
            <DetailField
              label="Brand"
              value={localItem.brand}
              onChangeText={(text) => handleFieldChange("brand", text)}
              placeholder="Enter brand"
            />

            {/* Purchase Date */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Purchase Date</Text>
              <YearMonthPicker
                selectedDate={localItem.purchaseDate}
                onValueChange={(date) => handleFieldChange("purchaseDate", date)}
              />
            </View>

            {/* Price */}
            <DetailField
              label="Price"
              value={localItem.price ? localItem.price.toString() : ""}
              onChangeText={(text) => {
                const numericValue = parseFloat(text);
                handleFieldChange("price", isNaN(numericValue) ? 0 : numericValue);
              }}
              keyboardType="numeric"
              placeholder="Enter price"
            />
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
    paddingBottom: CONTAINER.SCROLL_BOTTOM_PADDING,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#F8F8F8",
  },
  section: {
    paddingVertical: SPACING.VERTICAL,
  },
  sectionTitle: {
    fontFamily: typography.bold,
    fontSize: FONT_SIZE.SECTION_TITLE,
    color: colors.text_primary,
    paddingHorizontal: SPACING.HORIZONTAL,
    marginBottom: SPACING.SECTION,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.VERTICAL,
    paddingLeft: SPACING.HORIZONTAL,
  },
  detailLabel: {
    fontSize: FONT_SIZE.REGULAR,
    fontFamily: typography.medium,
    color: colors.text_primary,
    flex: FLEX.LABEL,
  },
  valueContainer: {
    flex: FLEX.VALUE,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: SPACING.HORIZONTAL,
    minHeight: CONTAINER.MIN_INPUT_HEIGHT,
  },
  valueContainerFocused: {
    backgroundColor: colors.thumbnail_background,
    marginVertical: -SPACING.SMALL,
    paddingVertical: SPACING.SMALL,
    marginRight: SPACING.HORIZONTAL,
    paddingRight: -SPACING.SMALL,
    borderRadius: CONTAINER.BORDER_RADIUS.SMALL,
  },
  detailValue: {
    flex: 1,
    fontSize: FONT_SIZE.REGULAR,
    fontFamily: typography.regular,
    color: colors.text_gray,
    textAlign: "right",
    marginRight: SPACING.SMALL,
  },
  multiSelectContainer: {
    flex: FLEX.VALUE,
    alignItems: "flex-end",
  },
  saveButton: {
    position: "absolute",
    bottom: CONTAINER.BOTTOM_BUTTON,
    left: CONTAINER.BOTTOM_BUTTON,
    right: CONTAINER.BOTTOM_BUTTON,
    backgroundColor: colors.primary_yellow,
    padding: SPACING.HORIZONTAL,
    borderRadius: CONTAINER.BORDER_RADIUS.MEDIUM,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: FONT_SIZE.REGULAR,
    fontFamily: typography.bold,
    color: colors.text_primary,
  },
});

export default ClothingDetailScreen;
