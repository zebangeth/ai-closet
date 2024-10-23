import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";

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
      <FlatList
        style={{ paddingBottom: 8 }}
        data={tags}
        horizontal
        renderItem={({ item }) => (
          <View style={styles.chip}>
            <Text style={styles.chipText}>{item}</Text>
            <TouchableOpacity onPress={() => onRemoveTag(item)}>
              <MaterialIcons name="close" size={16} color={colors.tag_light_text} />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item}
        ListFooterComponent={
          isAdding ? (
            <View style={styles.addChip}>
              <TextInput
                style={styles.input}
                value={newTag}
                onChangeText={setNewTag}
                onSubmitEditing={handleAddTag}
                placeholder="New Tag"
                autoFocus
              />
              <TouchableOpacity onPress={handleAddTag}>
                <MaterialIcons name="check" size={24} color={colors.primary_yellow} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.addButton} onPress={() => setIsAdding(true)}>
              <MaterialIcons name="add" size={24} color={colors.primary_yellow} />
              <Text style={styles.addButtonText}>Add Tag</Text>
            </TouchableOpacity>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  chip: {
    flexDirection: "row",
    backgroundColor: colors.tag_light,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 8,
  },
  chipText: {
    color: colors.tag_light_text,
    marginRight: 4,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButtonText: {
    color: colors.primary_yellow,
    marginLeft: 4,
  },
  addChip: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: colors.primary_yellow,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  input: {
    minWidth: 60,
  },
});

export default TagChips;
