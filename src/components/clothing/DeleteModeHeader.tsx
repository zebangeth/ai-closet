import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { colors } from "../../styles/colors";
import { typography } from "../../styles/globalStyles";

type Props = {
  selectedCount: number;
  onCancel: () => void;
};

const DeleteModeHeader = ({ selectedCount, onCancel }: Props) => (
  <View style={styles.header}>
    <Text style={styles.selectedText}>{selectedCount} selected</Text>
    <Pressable onPress={onCancel}>
      <Text style={styles.cancelText}>Cancel</Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  selectedText: {
    fontSize: 24,
    fontFamily: typography.bold,
    color: colors.text_primary,
  },
  cancelText: {
    fontSize: 16,
    fontFamily: typography.medium,
    color: colors.text_gray,
  },
});

export default DeleteModeHeader;
