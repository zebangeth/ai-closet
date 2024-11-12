import React, { useContext } from "react";
import { View, Text, StyleSheet, FlatList, ScrollView, Pressable, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ClothingContext } from "../../contexts/ClothingContext";
import ClothingItemThumbnail from "../clothing/ClothingItemThumbnail";
import { categories } from "../../data/categories";
import { colors } from "../../styles/colors";
import { typography } from "../../styles/globalStyles";
import { ClothingItem } from "../../types/ClothingItem";

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

// Subcomponents (same as ClothingManagementScreen)
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

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelectItem: (item: ClothingItem) => void;
};

const AddClothingItemOverlay = ({ visible, onClose, onSelectItem }: Props) => {
  const context = useContext(ClothingContext);

  if (!context) {
    return null;
  }

  const { categoryData, tagData, filteredItems, activeFilters, setFilter } = context;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Choose Closet Items to Add</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={colors.icon_stroke} />
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
              <ClothingItemThumbnail
                item={item}
                onPress={() => {
                  onSelectItem(item);
                  onClose();
                }}
              />
            )}
            keyExtractor={(item) => item.id}
            numColumns={3}
            contentContainerStyle={styles.gridContent}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    flex: 1,
    backgroundColor: colors.screen_background,
    marginTop: 160,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontFamily: typography.bold,
    color: colors.text_primary,
  },
  closeButton: {
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
    padding: 10,
  },
});

export default AddClothingItemOverlay;
