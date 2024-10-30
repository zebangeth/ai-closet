import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, FlatList, ScrollView, Pressable, Alert, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { v4 as uuidv4 } from "uuid";
import { ClothingContext } from "../contexts/ClothingContext";
import { ClothingItem } from "../types/ClothingItem";
import { ClosetStackParamList } from "../types/navigation";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import ClothingItemThumbnail from "../components/clothing/ClothingItemThumbnail";
import AnimatedAddButton from "../components/common/AnimatedAddButton";
import { categories } from "../data/categories";
import { colors } from "../styles/colors";
import { typography } from "../styles/globalStyles";
import { removeBackground } from "../services/BackgroundRemoval";
import { categorizeClothing } from "../services/ClothingCategorization";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = NativeStackScreenProps<ClosetStackParamList, "ClothingManagement">;

interface CategoryTabProps {
  name: string;
  isSelected: boolean;
  onPress: () => void;
  count: number;
}

interface TagChipProps {
  name: string;
  isSelected: boolean;
  onPress: () => void;
  count: number;
}

// Subcomponents
const CategoryTab = ({ name, isSelected, onPress, count }: CategoryTabProps) => (
  <Pressable style={[styles.categoryTab, isSelected && styles.categoryTabSelected]} onPress={onPress}>
    <Text style={[styles.categoryTabText, isSelected && styles.categoryTabTextSelected]}>{name}</Text>
    <Text style={[styles.categoryCount, isSelected && styles.categoryCountSelected]}>{count}</Text>
  </Pressable>
);

const TagChip = ({ name, isSelected, onPress, count }: TagChipProps) => (
  <Pressable style={[styles.tagChip, isSelected && styles.tagChipSelected]} onPress={onPress}>
    <Text style={[styles.tagChipText, isSelected && styles.tagChipTextSelected]}>
      {name} ({count})
    </Text>
  </Pressable>
);

// Main Component
const ClothingManagementScreen = ({ navigation }: Props) => {
  const context = useContext(ClothingContext);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!context) {
    return <Text>Loading...</Text>;
  }

  const { categoryData, tagData, filteredItems, activeFilters, setFilter, addClothingItem } = context;

  const handleChoosePhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      processImage(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "Permission to access camera is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();
    if (!result.canceled) {
      processImage(result.assets[0].uri);
    }
  };

  const processImage = async (uri: string) => {
    try {
      setIsProcessing(true);

      // Step 1: Remove background
      const bgRemovedUri = await removeBackground(uri);

      // Step 2: Categorize clothing
      const aiData = await categorizeClothing(bgRemovedUri);

      // Step 3: Create a new ClothingItem
      const newItem: ClothingItem = {
        id: uuidv4(),
        imageUri: uri,
        backgroundRemovedImageUri: bgRemovedUri,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: [],
        category: aiData.category || "",
        subcategory: aiData.subcategory || "",
        color: aiData.color || "",
        season: aiData.season || [],
        occasion: aiData.occasion || [],
        brand: "",
        purchaseDate: "",
        price: 0,
      };

      // Step 4: Add the new clothing item to context
      addClothingItem(newItem);

      // Step 5: Navigate to the detail screen
      navigation.navigate("ClothingDetail", { id: newItem.id });
    } catch (error) {
      console.error("Error processing image:", error);
      Alert.alert("Error", "An error occurred while processing the image.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Closet</Text>
        <Pressable style={styles.filterButton}>
          <MaterialIcons name="filter-list" size={24} color={colors.icon_stroke} />
        </Pressable>
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryTabsContainer}
        contentContainerStyle={styles.categoryTabsContent}
      >
        <CategoryTab
          name="All"
          isSelected={activeFilters.category === "All"}
          onPress={() => setFilter("category", "All")}
          count={categoryData.All}
        />
        {Object.keys(categories).map((category) => (
          <CategoryTab
            key={category}
            name={category}
            isSelected={activeFilters.category === category}
            onPress={() => setFilter("category", category)}
            count={categoryData[category]}
          />
        ))}
      </ScrollView>

      {/* Tags Section */}
      {tagData.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tagsContainer}
          contentContainerStyle={styles.tagsContent}
        >
          {tagData.map(({ tag, count }) => (
            <TagChip
              key={tag}
              name={tag}
              isSelected={(activeFilters.tags || []).includes(tag)}
              onPress={() => {
                const currentTags = activeFilters.tags || [];
                const newTags = currentTags.includes(tag)
                  ? currentTags.filter((t) => t !== tag)
                  : [...currentTags, tag];
                setFilter("tags", newTags);
              }}
              count={count}
            />
          ))}
        </ScrollView>
      )}

      {/* Clothing Grid */}
      <FlatList
        data={filteredItems}
        renderItem={({ item }) => (
          <ClothingItemThumbnail item={item} onPress={() => navigation.navigate("ClothingDetail", { id: item.id })} />
        )}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.gridContent}
      />

      {/* Add Button */}
      <AnimatedAddButton onChoosePhoto={handleChoosePhoto} onTakePhoto={handleTakePhoto} />

      {/* Loading Overlay */}
      {isProcessing && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary_yellow} />
          <Text style={styles.loadingText}>Processing image...</Text>
        </View>
      )}
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: typography.bold,
    color: colors.text_primary,
  },
  filterButton: {
    padding: 8,
  },
  categoryTabsContainer: {
    maxHeight: 48,
  },
  categoryTabsContent: {
    paddingHorizontal: 16,
  },
  categoryTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: colors.thumbnail_background,
  },
  categoryTabSelected: {
    backgroundColor: colors.primary_yellow,
  },
  categoryTabText: {
    fontFamily: typography.medium,
    fontSize: 14,
    color: colors.text_gray,
    marginRight: 4,
  },
  categoryTabTextSelected: {
    color: colors.text_primary,
  },
  categoryCount: {
    fontFamily: typography.regular,
    fontSize: 12,
    color: colors.text_gray,
  },
  categoryCountSelected: {
    color: colors.text_primary,
  },
  tagsContainer: {
    maxHeight: 38,
    marginTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: colors.divider_light,
  },
  tagsContent: {
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  tagChip: {
    height: 30,
    flexDirection: "row",
    backgroundColor: colors.tag_light,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 8,
  },
  tagChipSelected: {
    backgroundColor: colors.tag_dark,
  },
  tagChipText: {
    fontFamily: typography.regular,
    fontSize: 14,
    color: colors.tag_light_text,
  },
  tagChipTextSelected: {
    color: colors.tag_dark_text,
  },
  gridContent: {
    paddingTop: 6,
    paddingHorizontal: 10,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background_dim,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    color: "#fff",
    fontSize: 18,
    fontFamily: typography.medium,
  },
});

export default ClothingManagementScreen;
