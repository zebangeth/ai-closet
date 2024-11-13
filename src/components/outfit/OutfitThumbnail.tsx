import React from "react";
import { TouchableOpacity, Image, StyleSheet, View } from "react-native";
import { Outfit } from "../../types/Outfit";
import { colors } from "../../styles/colors";

type Props = {
  outfit: Outfit;
  width: number;
  height: number;
  onPress: () => void;
};

const OutfitThumbnail = ({ outfit, width, height, onPress }: Props) => (
  <TouchableOpacity
    style={[
      styles.container,
      {
        width,
        height,
      },
    ]}
    onPress={onPress}
  >
    <View style={styles.card}>
      <Image source={{ uri: outfit.imageUri }} style={styles.image} resizeMode="cover" />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    // Width and height are passed as props
  },
  card: {
    flex: 1,
    backgroundColor: colors.thumbnail_background,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default OutfitThumbnail;
