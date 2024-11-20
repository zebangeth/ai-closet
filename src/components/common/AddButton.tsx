import React from "react";
import { StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";
import PressableFade from "./PressableFade";

const AddButton = ({ onPress }: { onPress: () => void }) => (
  <PressableFade style={styles.button} onPress={onPress}>
    <MaterialIcons name="add" size={24} color={colors.icon_stroke} />
  </PressableFade>
);

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: colors.primary_yellow,
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AddButton;
