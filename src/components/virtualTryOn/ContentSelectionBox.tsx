import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";
import { typography } from "../../styles/globalStyles";
import PressableFade from "../common/PressableFade";

type Props = {
  title: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
  selectedImageUri?: string;
};

const ContentSelectionBox = ({ title, iconName, onPress, selectedImageUri }: Props) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    <PressableFade onPress={onPress} style={styles.selectionArea}>
      {selectedImageUri ? (
        <Image source={{ uri: selectedImageUri }} style={styles.selectedImage} resizeMode="contain" />
      ) : (
        <>
          <View style={styles.iconCircle}>
            <MaterialIcons name={iconName} size={32} color={colors.text_gray} />
          </View>
          <Text style={styles.addButtonText}>{title}</Text>
        </>
      )}
    </PressableFade>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 6,
  },
  title: {
    fontSize: 16,
    fontFamily: typography.semiBold,
    color: colors.text_primary,
    marginBottom: 8,
  },
  selectionArea: {
    aspectRatio: 3 / 4,
    backgroundColor: colors.thumbnail_background,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.screen_background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: typography.medium,
    color: colors.text_gray,
  },
  selectedImage: {
    width: "100%",
    height: "100%",
  },
});

export default ContentSelectionBox;
