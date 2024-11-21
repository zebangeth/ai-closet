import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";
import PressableFade from "./PressableFade";

type Props = {
  options: string[];
  selectedValues: string[];
  onValueChange: (selected: string[]) => void;
  disabled?: boolean;
};

const MultiSelectToggle = ({ options, selectedValues, onValueChange, disabled = false }: Props) => {
  const toggleValue = (value: string) => {
    if (disabled) return;

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
          <PressableFade
            key={option}
            style={[
              styles.button,
              isSelected && styles.buttonSelected,
              disabled && (isSelected ? styles.buttonSelectedDisabled : styles.buttonDisabled),
            ]}
            onPress={() => toggleValue(option)}
            disabled={disabled}
          >
            <View style={styles.buttonContent}>
              {isSelected && (
                <MaterialIcons
                  name="check"
                  size={16}
                  color={disabled ? colors.text_gray_light : colors.tag_dark_text}
                  style={styles.checkIcon}
                />
              )}
              <Text
                style={[
                  styles.buttonText,
                  isSelected && styles.buttonTextSelected,
                  disabled && (isSelected ? styles.buttonTextSelectedDisabled : styles.buttonTextDisabled),
                ]}
              >
                {option}
              </Text>
            </View>
          </PressableFade>
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
  buttonDisabled: {
    borderColor: colors.border_gray_light,
    opacity: 0.5,
  },
  buttonSelectedDisabled: {
    backgroundColor: colors.tag_dark_disabled,
    borderColor: colors.tag_dark_disabled,
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    color: colors.tag_light_text,
  },
  buttonTextSelected: {
    color: colors.tag_dark_text,
  },
  buttonTextDisabled: {
    color: colors.text_gray_light,
  },
  buttonTextSelectedDisabled: {
    color: colors.tag_dark_text_disabled,
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
