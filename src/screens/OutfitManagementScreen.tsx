import React, { useContext } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { OutfitContext } from "../contexts/OutfitContext";
import { colors } from "../styles/colors";
import { typography } from "../styles/globalStyles";
import AddButton from "../components/common/AddButton";
import TagChips from "../components/common/TagChips";
import OutfitThumbnail from "../components/outfit/OutfitThumbnail";
import { OutfitStackScreenProps } from "../types/navigation";

type Props = OutfitStackScreenProps<"OutfitManagement">;

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const COLUMN_COUNT = 2;
const GRID_PADDING = 16;
const GRID_SPACING = 12;
const ITEM_WIDTH = (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_SPACING * (COLUMN_COUNT - 1)) / COLUMN_COUNT;
const ITEM_HEIGHT = (ITEM_WIDTH * 4) / 3; // 3:4 aspect ratio

const OutfitManagementScreen = ({ navigation }: Props) => {
  const context = useContext(OutfitContext);

  if (!context) {
    return <Text>Loading...</Text>;
  }

  const { tagData, filteredOutfits, activeFilters, setFilter } = context;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Outfits</Text>
        <Pressable style={styles.filterButton}>
          <MaterialIcons name="filter-list" size={24} color={colors.icon_stroke} />
        </Pressable>
      </View>

      {/* Tags Section */}
      {tagData.length > 0 && (
        <View style={styles.tagsSection}>
          <TagChips
            tags={activeFilters.tags || []}
            onAddTag={(tag) => {
              const currentTags = activeFilters.tags || [];
              setFilter("tags", [...currentTags, tag]);
            }}
            onRemoveTag={(tag) => {
              const currentTags = activeFilters.tags || [];
              setFilter(
                "tags",
                currentTags.filter((t) => t !== tag)
              );
            }}
          />
        </View>
      )}

      {/* Outfit Grid */}
      <FlatList
        data={filteredOutfits}
        renderItem={({ item }) => (
          <OutfitThumbnail
            outfit={item}
            width={ITEM_WIDTH}
            height={ITEM_HEIGHT}
            onPress={() => navigation.navigate("OutfitDetail", { id: item.id })}
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={styles.gridRow}
      />

      {/* Add Button */}
      <AddButton onPress={() => navigation.navigate("OutfitCanvas", { id: undefined })} />
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
  tagsSection: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider_light,
  },
  gridContent: {
    padding: GRID_PADDING,
  },
  gridRow: {
    justifyContent: "space-between",
    marginBottom: GRID_SPACING,
  },
});

export default OutfitManagementScreen;
