import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";

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
      {seasons.map((season) => (
        <TouchableOpacity
          key={season}
          style={[
            styles.button,
            selectedSeasons.includes(season) && styles.buttonSelected,
          ]}
          onPress={() => toggleSeason(season)}
        >
          <Text
            style={[
              styles.buttonText,
              selectedSeasons.includes(season) && styles.buttonTextSelected,
            ]}
          >
            {season}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonSelected: {
    backgroundColor: "#ffd700",
    borderColor: "#ffd700",
  },
  buttonText: {
    fontSize: 16,
    color: "#333",
  },
  buttonTextSelected: {
    color: "#fff",
  },
});

export default SeasonToggle;
