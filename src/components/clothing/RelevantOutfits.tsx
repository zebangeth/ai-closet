import React, { useContext, useMemo } from "react";
import { View, Text, ScrollView, StyleSheet, useWindowDimensions } from "react-native";
import { OutfitContext } from "../../contexts/OutfitContext";
import OutfitThumbnail from "../outfit/OutfitThumbnail";
import { colors } from "../../styles/colors";
import { typography } from "../../styles/globalStyles";

type Props = {
  clothingItemId: string;
  onOutfitPress: (outfitId: string) => void;
};

const RelevantOutfits = ({ clothingItemId, onOutfitPress }: Props) => {
  const outfitContext = useContext(OutfitContext);
  const { width } = useWindowDimensions();

  // Calculate thumbnail dimensions
  const thumbnailWidth = (width - 32 - 16) / 2.5; // allowing 2.5 items to be visible
  const thumbnailHeight = (thumbnailWidth * 4) / 3; // 3:4 aspect ratio

  const relevantOutfits = useMemo(() => {
    if (!outfitContext) return [];
    return outfitContext.outfits.filter((outfit) => outfit.clothingItems.some((item) => item.id === clothingItemId));
  }, [outfitContext, clothingItemId]);

  if (relevantOutfits.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Relevant Outfits</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {relevantOutfits.map((outfit) => (
          <View key={outfit.id} style={styles.thumbnailContainer}>
            <OutfitThumbnail
              outfit={outfit}
              width={thumbnailWidth}
              height={thumbnailHeight}
              onPress={() => onOutfitPress(outfit.id)}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: typography.bold,
    color: colors.text_primary,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  thumbnailContainer: {
    marginRight: 8,
  },
});

export default RelevantOutfits;
