import React from "react";
import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { colors } from "../../styles/colors";
import { typography } from "../../styles/globalStyles";

type TagData = {
  tag: string;
  count: number;
}[];

interface TagChipProps {
  name: string;
  isSelected: boolean;
  onPress: () => void;
  count: number;
}

interface Props {
  tagData: TagData;
  selectedTags: string[];
  onTagPress: (tag: string) => void;
  containerStyle?: object;
}

const TagChip = ({ name, isSelected, onPress, count }: TagChipProps) => (
  <Pressable style={[styles.tagChip, isSelected && styles.tagChipSelected]} onPress={onPress}>
    <Text style={[styles.tagChipText, isSelected && styles.tagChipTextSelected]}>
      {name} ({count})
    </Text>
  </Pressable>
);

const TagFilterSection = ({ tagData, selectedTags, onTagPress, containerStyle }: Props) => {
  if (tagData.length === 0) return null;

  return (
    <View style={[styles.container, containerStyle]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {tagData.map(({ tag, count }) => (
          <TagChip
            key={tag}
            name={tag}
            isSelected={selectedTags.includes(tag)}
            onPress={() => onTagPress(tag)}
            count={count}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 38,
    marginTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: colors.divider_light,
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  tagChip: {
    height: 30,
    flexDirection: "row",
    backgroundColor: colors.tag_light,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 8,
  },
  tagChipSelected: {
    backgroundColor: colors.tag_dark,
  },
  tagChipText: {
    fontFamily: typography.regular,
    fontSize: 14,
    color: colors.tag_light_text,
  },
  tagChipTextSelected: {
    color: colors.tag_dark_text,
  },
});

export default TagFilterSection;
