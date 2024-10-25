import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";

type Props = {
  options: string[];
  selectedValues: string[];
  onValueChange: (selected: string[]) => void;
};

const MultiSelectToggle = ({ options, selectedValues, onValueChange }: Props) => {
  const toggleValue = (value: string) => {
    let updatedValues = [...selectedValues];
    if (updatedValues.includes(value)) {
      updatedValues = updatedValues.filter((v) => v !== value);
    } else {
      updatedValues.push(value);
    }
    onValueChange(updatedValues);
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {options.map((option) => {
        const isSelected = selectedValues.includes(option);
        return (
          <TouchableOpacity
            key={option}
            style={[styles.button, isSelected && styles.buttonSelected]}
            onPress={() => toggleValue(option)}
          >
            <View style={styles.buttonContent}>
              {isSelected && (
                <MaterialIcons name="check" size={16} color={colors.tag_dark_text} style={styles.checkIcon} />
              )}
              <Text style={[styles.buttonText, isSelected && styles.buttonTextSelected]}>{option}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border_gray,
  },
  buttonSelected: {
    backgroundColor: colors.tag_dark,
    borderColor: colors.tag_dark,
  },
  buttonText: {
    fontSize: 16,
    color: colors.tag_light_text,
  },
  buttonTextSelected: {
    color: colors.tag_dark_text,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkIcon: {
    marginRight: 4,
  },
});

export default MultiSelectToggle;
