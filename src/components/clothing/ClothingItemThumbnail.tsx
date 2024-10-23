import React from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";
import { ClothingItem } from "../../types/ClothingItem";

type Props = {
  item: ClothingItem;
  onPress: () => void;
};

const ClothingItemThumbnail = ({ item, onPress }: Props) => (
  <TouchableOpacity style={styles.container} onPress={onPress}>
    <Image source={{ uri: item.backgroundRemovedImageUri || item.imageUri }} style={styles.image} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1 / 3, aspectRatio: 1, margin: 2 },
  image: { width: "100%", height: "100%" },
});

export default ClothingItemThumbnail;
