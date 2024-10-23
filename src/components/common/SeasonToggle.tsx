import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Ensure you're using Expo or have react-native-vector-icons installed
import { colors } from "../../styles/colors";

type Props = {
  selectedSeasons: string[];
  onValueChange: (seasons: string[]) => void;
};

const seasons = ["Spring/Fall", "Summer", "Winter"];

const SeasonToggle = ({ selectedSeasons, onValueChange }: Props) => {
  const toggleSeason = (season: string) => {
    let updatedSeasons = [...selectedSeasons];
    if (updatedSeasons.includes(season)) {
      updatedSeasons = updatedSeasons.filter((s) => s !== season);
    } else {
      updatedSeasons.push(season);
    }
    onValueChange(updatedSeasons);
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {seasons.map((season) => {
        const isSelected = selectedSeasons.includes(season);
        return (
          <TouchableOpacity
            key={season}
            style={[styles.button, isSelected && styles.buttonSelected]}
            onPress={() => toggleSeason(season)}
          >
            <View style={styles.buttonContent}>
              {isSelected && (
                <MaterialIcons name="check" size={16} color={colors.tag_dark_text} style={styles.checkIcon} />
              )}
              <Text style={[styles.buttonText, isSelected && styles.buttonTextSelected]}>{season}</Text>
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

export default SeasonToggle;
