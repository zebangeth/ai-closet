import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ClothingItem } from "../../types/ClothingItem";
import { colors } from "../../styles/colors";
import PressableFade from "../common/PressableFade";

type Props = {
  item: ClothingItem;
  onPress: () => void;
  onLongPress?: () => void;
  isSelectable?: boolean;
  isSelected?: boolean;
};

const ClothingItemThumbnail = ({ item, onPress, onLongPress, isSelectable, isSelected }: Props) => (
  <PressableFade
    containerStyle={styles.container}
    style={styles.pressableContent}
    onPress={onPress}
    onLongPress={onLongPress}
  >
    <View style={[styles.card, isSelected && styles.cardSelected]}>
      <Image
        source={{ uri: item.backgroundRemovedImageUri || item.imageUri }}
        style={styles.image}
        resizeMode="contain"
      />
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

const styles = StyleSheet.create({
  container: {
    flex: 1 / 3,
    aspectRatio: 1,
    padding: 6,
  },
  pressableContent: {
    flex: 1,
  },
  card: {
    flex: 1,
    backgroundColor: colors.thumbnail_background,
    borderRadius: 12,
    padding: 4,
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

export default ClothingItemThumbnail;
