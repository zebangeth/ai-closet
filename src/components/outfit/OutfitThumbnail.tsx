import React from "react";
import { Image, StyleSheet, View, ViewStyle } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Outfit } from "../../types/Outfit";
import { colors } from "../../styles/colors";
import PressableFade from "../common/PressableFade";

type Props = {
  outfit: Outfit;
  width: number;
  height: number;
  onPress: () => void;
  onLongPress?: () => void;
  isSelectable?: boolean;
  isSelected?: boolean;
  style?: ViewStyle;
};

const OutfitThumbnail = ({ outfit, width, height, onPress, onLongPress, isSelectable, isSelected, style }: Props) => {
  const thumbnailStyle = {
    width,
    height,
  };

  return (
    <PressableFade style={[style]} onPress={onPress} onLongPress={onLongPress}>
      <View style={[styles.card, thumbnailStyle, isSelected && styles.cardSelected]}>
        <Image source={{ uri: outfit.imageUri }} style={styles.image} resizeMode="cover" />
        {isSelectable && (
          <View style={styles.checkboxContainer}>
            <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
              {isSelected && <MaterialIcons name="check" size={16} color={colors.screen_background} />}
            </View>
          </View>
        )}
      </View>
    </PressableFade>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.thumbnail_background,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  cardSelected: {
    borderColor: colors.primary_yellow,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  checkboxContainer: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.thumbnail_background,
    borderWidth: 2,
    borderColor: colors.primary_yellow,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: colors.primary_yellow,
  },
});

export default OutfitThumbnail;
