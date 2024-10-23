import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";

type Props = {
  onBack?: () => void;
  onDelete?: () => void;
};

const Header = ({ onBack, onDelete }: Props) => (
  <View style={styles.container}>
    {onBack && (
      <TouchableOpacity onPress={onBack}>
        <MaterialIcons name="arrow-back" size={24} color={colors.icon_stroke} />
      </TouchableOpacity>
    )}
    {onDelete && (
      <TouchableOpacity onPress={onDelete}>
        <MaterialIcons name="delete" size={24} color={colors.icon_stroke} />
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
});

export default Header;
