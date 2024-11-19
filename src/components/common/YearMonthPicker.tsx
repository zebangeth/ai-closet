import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, FlatList, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";
import { typography } from "../../styles/globalStyles";

type Props = {
  selectedDate: string; // Format: 'YYYY-MM'
  onValueChange: (date: string) => void;
  presentationType?: "default" | "inline";
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const monthAbbreviations = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const YearMonthPicker = ({ selectedDate, onValueChange, presentationType = "default" }: Props) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [tempMonth, setTempMonth] = useState<number>(
    selectedDate ? parseInt(selectedDate.split("-")[1]) - 1 : new Date().getMonth()
  );
  const [tempYear, setTempYear] = useState<number>(
    selectedDate ? parseInt(selectedDate.split("-")[0]) : new Date().getFullYear()
  );

  const handleConfirm = () => {
    const month = tempMonth + 1; // Months are zero-indexed
    const formattedMonth = month < 10 ? `0${month}` : month;
    onValueChange(`${tempYear}-${formattedMonth}`);
    setModalVisible(false);
  };

  const formatDisplayDate = (dateString: string, useAbbreviation: boolean = false) => {
    if (!dateString) return "Select Date";
    const [year, month] = dateString.split("-");
    const monthIndex = parseInt(month) - 1;
    const monthDisplay = useAbbreviation ? monthAbbreviations[monthIndex] : months[monthIndex];
    return `${monthDisplay} ${year}`;
  };

  // Create array of years with proper typing
  const years: number[] = Array.from(
    { length: new Date().getFullYear() - 1999 },
    (_, index) => new Date().getFullYear() - index
  );

  const getInitialScrollIndex = (data: (string | number)[], selectedValue: string | number): number => {
    const index = data.indexOf(selectedValue);
    return Math.max(0, index);
  };

  const renderModal = () => (
    <Modal visible={isModalVisible} transparent animationType="slide">
      <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.headerBar}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.headerButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Select Purchase Date</Text>
            <TouchableOpacity onPress={handleConfirm}>
              <Text style={[styles.headerButton, { color: colors.primary_yellow }]}>Done</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pickerContent}>
            <View style={[styles.pickerContainer, styles.leftPicker]}>
              <FlatList
                data={months}
                keyExtractor={(item) => item}
                initialScrollIndex={getInitialScrollIndex(months, months[tempMonth])}
                getItemLayout={(data, index) => ({
                  length: 56,
                  offset: 56 * index,
                  index,
                })}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    style={[styles.pickerItem, tempMonth === index && styles.pickerItemSelected]}
                    onPress={() => setTempMonth(index)}
                  >
                    <Text style={[styles.pickerItemText, tempMonth === index && styles.pickerItemTextSelected]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            <View style={[styles.pickerContainer, styles.rightPicker]}>
              <FlatList
                data={years}
                keyExtractor={(item) => item.toString()}
                initialScrollIndex={getInitialScrollIndex(years, tempYear)}
                getItemLayout={(data, index) => ({
                  length: 56,
                  offset: 56 * index,
                  index,
                })}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.pickerItem, tempYear === item && styles.pickerItemSelected]}
                    onPress={() => setTempYear(item)}
                  >
                    <Text style={[styles.pickerItemText, tempYear === item && styles.pickerItemTextSelected]}>
                      {item.toString()}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  );

  if (presentationType === "inline") {
    return (
      <View style={styles.inlineContainer}>
        <TouchableOpacity style={styles.inlineValueContainer} onPress={() => setModalVisible(true)} activeOpacity={0.7}>
          <Text style={styles.inlineValue}>
            {formatDisplayDate(selectedDate, true)} {/* Using abbreviated months for inline display */}
          </Text>
          <MaterialCommunityIcons name="chevron-right" size={30} color={colors.text_gray} />
        </TouchableOpacity>
        {renderModal()}
      </View>
    );
  }

  return (
    <View>
      <TouchableOpacity style={styles.inputField} onPress={() => setModalVisible(true)}>
        <Text style={styles.inputText}>
          {formatDisplayDate(selectedDate)} {/* Using full month names for default display */}
        </Text>
        <MaterialCommunityIcons name="chevron-down" size={30} color={colors.text_gray} />
      </TouchableOpacity>
      {renderModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  inlineContainer: {
    flex: 1,
  },
  inlineValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: 16,
    flex: 1,
  },
  inlineValue: {
    fontSize: 16,
    fontFamily: typography.regular,
    color: colors.text_gray,
    marginRight: 8,
  },
  inputField: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.border_gray,
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.screen_background,
  },
  inputText: {
    fontSize: 16,
    fontFamily: typography.regular,
    color: colors.text_primary,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.background_dim,
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: colors.screen_background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "50%",
    overflow: "hidden",
  },
  headerBar: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: colors.divider_light,
    backgroundColor: colors.screen_background,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: typography.bold,
    color: colors.text_primary,
  },
  headerButton: {
    fontSize: 16,
    fontFamily: typography.medium,
    color: colors.text_gray,
  },
  pickerContent: {
    flexDirection: "row",
    flex: 1,
  },
  pickerContainer: {
    flex: 1,
  },
  leftPicker: {
    borderRightWidth: 1,
    borderColor: colors.divider_light,
  },
  rightPicker: {
    backgroundColor: colors.thumbnail_background,
  },
  pickerItem: {
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  pickerItemSelected: {
    backgroundColor: colors.light_yellow,
  },
  pickerItemText: {
    fontSize: 16,
    fontFamily: typography.regular,
    color: colors.text_gray,
  },
  pickerItemTextSelected: {
    fontFamily: typography.medium,
    color: colors.text_primary,
  },
});

export default YearMonthPicker;
