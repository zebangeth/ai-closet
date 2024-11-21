import React, { useCallback, useContext, useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Dimensions, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView, Edge } from "react-native-safe-area-context";
import { OutfitContext } from "../contexts/OutfitContext";
import { colors } from "../styles/colors";
import { typography } from "../styles/globalStyles";
import AddButton from "../components/common/AddButton";
import OutfitThumbnail from "../components/outfit/OutfitThumbnail";
import { OutfitStackScreenProps } from "../types/navigation";
import TagFilterSection from "../components/common/TagFilterSection";
import DeleteModeHeader from "../components/common/DeleteModeHeader";
import DeleteButton from "../components/common/DeleteButton";
import { Outfit } from "../types/Outfit";

type Props = OutfitStackScreenProps<"OutfitManagement">;

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const COLUMN_COUNT = 2;
const GRID_PADDING = 16;
const GRID_SPACING = 12;
const ITEM_WIDTH = (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_SPACING * (COLUMN_COUNT - 1)) / COLUMN_COUNT;
const ITEM_HEIGHT = (ITEM_WIDTH * 4) / 3; // 3:4 aspect ratio

const OutfitManagementScreen = ({ navigation }: Props) => {
  // Selection state
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const context = useContext(OutfitContext);

  if (!context) {
    return <Text>Loading...</Text>;
  }

  const { tagData, filteredOutfits, activeFilters, setFilter, deleteOutfit } = context;

  // Selection handlers
  const handleLongPress = useCallback((outfitId: string) => {
    setIsSelectionMode(true);
    setSelectedItems(new Set([outfitId]));
  }, []);

  const handleItemPress = useCallback(
    (outfitId: string) => {
      if (isSelectionMode) {
        setSelectedItems((prev) => {
          const newSet = new Set(prev);
          if (newSet.has(outfitId)) {
            newSet.delete(outfitId);
            // If no items are selected, exit selection mode
            if (newSet.size === 0) {
              setIsSelectionMode(false);
            }
          } else {
            newSet.add(outfitId);
          }
          return newSet;
        });
      } else {
        navigation.navigate("OutfitDetail", { id: outfitId });
      }
    },
    [isSelectionMode, navigation]
  );

  const handleCancelSelection = useCallback(() => {
    setIsSelectionMode(false);
    setSelectedItems(new Set());
  }, []);

  const handleDelete = useCallback(() => {
    Alert.alert(
      "Delete Outfits",
      `Are you sure you want to delete ${selectedItems.size} outfit${selectedItems.size > 1 ? "s" : ""}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            selectedItems.forEach((id) => {
              deleteOutfit(id);
            });
            setIsSelectionMode(false);
            setSelectedItems(new Set());
          },
        },
      ]
    );
  }, [selectedItems, deleteOutfit]);

  const handleTagPress = (tag: string) => {
    const currentTags = activeFilters.tags || [];
    const newTags = currentTags.includes(tag) ? currentTags.filter((t) => t !== tag) : [...currentTags, tag];
    setFilter("tags", newTags);
  };

  const renderItem = ({ item, index }: { item: Outfit; index: number }) => {
    const isFirstInRow = index % 2 === 0;
    const style = isFirstInRow
      ? { marginRight: GRID_SPACING / 2, marginBottom: GRID_SPACING }
      : { marginLeft: GRID_SPACING / 2, marginBottom: GRID_SPACING };

    return (
      <OutfitThumbnail
        outfit={item}
        width={ITEM_WIDTH}
        height={ITEM_HEIGHT}
        style={style}
        onPress={() => handleItemPress(item.id)}
        onLongPress={() => handleLongPress(item.id)}
        isSelectable={isSelectionMode}
        isSelected={selectedItems.has(item.id)}
      />
    );
  };

  const safeAreaEdges: Edge[] = ["top", "left", "right"];

  return (
    <SafeAreaView style={styles.container} edges={safeAreaEdges}>
      {/* Header */}
      {isSelectionMode ? (
        <DeleteModeHeader selectedCount={selectedItems.size} onCancel={handleCancelSelection} />
      ) : (
        <View style={styles.header}>
          <Text style={styles.title}>My Outfits</Text>
          <Pressable>
            <MaterialIcons name="filter-list" size={24} color={colors.icon_stroke} />
          </Pressable>
        </View>
      )}

      {/* Tags Filter Section */}
      <TagFilterSection tagData={tagData} selectedTags={activeFilters.tags || []} onTagPress={handleTagPress} />

      {/* Outfit Grid */}
      <FlatList
        data={filteredOutfits}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={COLUMN_COUNT}
        contentContainerStyle={[styles.gridContent, isSelectionMode && styles.gridContentWithDelete]}
      />

      {/* Add Button or Delete Button */}
      {isSelectionMode ? (
        <DeleteButton onDelete={handleDelete} selectedCount={selectedItems.size} />
      ) : (
        <AddButton onPress={() => navigation.navigate("OutfitCanvas", { id: undefined })} />
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
  gridContent: {
    padding: GRID_PADDING,
  },
  gridContentWithDelete: {
    paddingBottom: 80, // Additional padding when delete button is shown
  },
});

export default OutfitManagementScreen;
