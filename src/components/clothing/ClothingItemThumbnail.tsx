import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { ClothingItem } from "../../types/ClothingItem";
import { colors } from "../../styles/colors";
import PressableFade from "../common/PressableFade";

type Props = {
  item: ClothingItem;
  onPress: () => void;
};

const ClothingItemThumbnail = ({ item, onPress }: Props) => (
  <PressableFade containerStyle={styles.container} style={styles.pressableContent} onPress={onPress}>
    <View style={styles.card}>
      <Image
        source={{ uri: item.backgroundRemovedImageUri || item.imageUri }}
        style={styles.image}
        resizeMode="contain"
      />
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
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default ClothingItemThumbnail;
