import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';

type Props = {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
};

const TagChips: React.FC<Props> = ({ tags, onAddTag, onRemoveTag }) => {
  const [newTag, setNewTag] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddTag = () => {
    if (newTag.trim()) {
      onAddTag(newTag.trim());
      setNewTag('');
      setIsAdding(false);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={tags}
        horizontal
        renderItem={({ item }) => (
          <View style={styles.chip}>
            <Text style={styles.chipText}>{item}</Text>
            <TouchableOpacity onPress={() => onRemoveTag(item)}>
              <MaterialIcons name="close" size={16} color="#fff" />
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
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setIsAdding(true)}
            >
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    backgroundColor: colors.primary_yellow,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    alignItems: 'center',
    marginRight: 8,
  },
  chipText: {
    color: '#fff',
    marginRight: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    color: colors.primary_yellow,
    marginLeft: 4,
  },
  addChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colors.primary_yellow,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  input: {
    minWidth: 60,
  },
});

export default TagChips;
