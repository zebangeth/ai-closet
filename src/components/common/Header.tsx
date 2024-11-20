import React from "react";
import { View, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";
import PressableFade from "./PressableFade";

type Props = {
  onBack?: () => void;
  onDelete?: () => void;
};

const Header = ({ onBack, onDelete }: Props) => (
  <View style={styles.container}>
    {onBack && (
      <PressableFade onPress={onBack}>
        <MaterialIcons name="arrow-back" size={24} color={colors.icon_stroke} />
      </PressableFade>
    )}
    {onDelete && (
      <PressableFade onPress={onDelete}>
        <MaterialIcons name="delete" size={24} color={colors.icon_stroke} />
      </PressableFade>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider_light,
  },
});

export default Header;
