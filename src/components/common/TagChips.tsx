import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";
import { typography } from "../../styles/globalStyles";
import PressableFade from "./PressableFade";

type Props = {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
};

const TagChips = ({ tags, onAddTag, onRemoveTag }: Props) => {
  const [newTag, setNewTag] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddTag = () => {
    if (newTag.trim()) {
      onAddTag(newTag.trim());
      setNewTag("");
      setIsAdding(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {tags.map((item) => (
          <View key={item} style={styles.chip}>
            <Text style={styles.chipText}>{item}</Text>
            <PressableFade onPress={() => onRemoveTag(item)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialIcons name="close" size={16} color={colors.text_gray} />
            </PressableFade>
          </View>
        ))}
        {isAdding ? (
          <View style={styles.addChip}>
            <TextInput
              style={styles.input}
              value={newTag}
              onChangeText={setNewTag}
              onSubmitEditing={handleAddTag}
              placeholder="New Tag"
              autoFocus
              placeholderTextColor={colors.text_gray}
            />
            <PressableFade onPress={handleAddTag}>
              <MaterialIcons name="check" size={20} color={colors.primary_yellow} />
            </PressableFade>
          </View>
        ) : (
          <PressableFade style={styles.addButton} onPress={() => setIsAdding(true)}>
            <MaterialIcons name="add" size={20} color={colors.primary_yellow} />
            <Text style={styles.addButtonText}>Add Tag</Text>
          </PressableFade>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  scrollContent: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  chip: {
    height: 30,
    flexDirection: "row",
    backgroundColor: colors.tag_light,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 8,
  },
  chipText: {
    color: colors.text_primary,
    fontSize: 14,
    marginRight: 4,
    fontFamily: typography.regular,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButtonText: {
    color: colors.primary_yellow,
    fontSize: 14,
    marginLeft: 4,
    fontFamily: typography.regular,
  },
  addChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.primary_yellow,
  },
  input: {
    minWidth: 60,
    fontSize: 14,
    fontFamily: typography.regular,
    color: colors.text_primary,
    padding: 0,
    margin: 0,
    borderColor: colors.primary_yellow,
  },
});

export default TagChips;
