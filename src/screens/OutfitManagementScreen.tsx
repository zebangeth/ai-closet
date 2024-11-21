import React, { useContext } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView, Edge } from "react-native-safe-area-context";
import { OutfitContext } from "../contexts/OutfitContext";
import { colors } from "../styles/colors";
import { typography } from "../styles/globalStyles";
import AddButton from "../components/common/AddButton";
import OutfitThumbnail from "../components/outfit/OutfitThumbnail";
import { OutfitStackScreenProps } from "../types/navigation";
import TagFilterSection from "../components/common/TagFilterSection";

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

  const handleTagPress = (tag: string) => {
    const currentTags = activeFilters.tags || [];
    const newTags = currentTags.includes(tag) ? currentTags.filter((t) => t !== tag) : [...currentTags, tag];
    setFilter("tags", newTags);
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const isFirstInRow = index % 2 === 0;
    const style = isFirstInRow
      ? { marginRight: GRID_SPACING / 2, marginBottom: GRID_SPACING }
      : { marginLeft: GRID_SPACING / 2, marginBottom: GRID_SPACING };

    return (
      <View style={style}>
        <OutfitThumbnail
          outfit={item}
          width={ITEM_WIDTH}
          height={ITEM_HEIGHT}
          onPress={() => navigation.navigate("OutfitDetail", { id: item.id })}
        />
      </View>
    );
  };

  const safeAreaEdges: Edge[] = ["top", "left", "right"];

  return (
    <SafeAreaView style={styles.container} edges={safeAreaEdges}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Outfits</Text>
        <Pressable>
          <MaterialIcons name="filter-list" size={24} color={colors.icon_stroke} />
        </Pressable>
      </View>

      {/* Tags Filter Section */}
      <TagFilterSection tagData={tagData} selectedTags={activeFilters.tags || []} onTagPress={handleTagPress} />

      {/* Outfit Grid */}
      <FlatList
        data={filteredOutfits}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={COLUMN_COUNT}
        contentContainerStyle={styles.gridContent}
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
  gridContent: {
    padding: GRID_PADDING,
  },
});

export default OutfitManagementScreen;
