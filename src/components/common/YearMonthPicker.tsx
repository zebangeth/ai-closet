import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, FlatList, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";
import { typography } from "../../styles/globalStyles";

// Style Constants
const MODAL = {
  HEADER_HEIGHT: 56,
  HEIGHT_PERCENTAGE: "50%" as const,
  BORDER_RADIUS: 20,
};

const SPACING = {
  HORIZONTAL: 16,
  VERTICAL: 16,
  TEXT: 8,
};

const FONT_SIZE = {
  HEADER: 18,
  REGULAR: 16,
};

const ICON = {
  SIZE: 30,
};

const PICKER_ITEM = {
  HEIGHT: 56,
};

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
    const month = tempMonth + 1;
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
                  length: PICKER_ITEM.HEIGHT,
                  offset: PICKER_ITEM.HEIGHT * index,
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
                  length: PICKER_ITEM.HEIGHT,
                  offset: PICKER_ITEM.HEIGHT * index,
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
          <Text style={styles.inlineValue}>{formatDisplayDate(selectedDate, true)}</Text>
          <MaterialCommunityIcons name="chevron-right" size={ICON.SIZE} color={colors.text_gray} />
        </TouchableOpacity>
        {renderModal()}
      </View>
    );
  }

  return (
    <View>
      <TouchableOpacity style={styles.inputField} onPress={() => setModalVisible(true)}>
        <Text style={styles.inputText}>{formatDisplayDate(selectedDate)}</Text>
        <MaterialCommunityIcons name="chevron-down" size={ICON.SIZE} color={colors.text_gray} />
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
    paddingRight: SPACING.HORIZONTAL,
    flex: 1,
  },
  inlineValue: {
    fontSize: FONT_SIZE.REGULAR,
    fontFamily: typography.regular,
    color: colors.text_gray,
    marginRight: SPACING.TEXT,
  },
  inputField: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.border_gray,
    borderRadius: 8,
    padding: SPACING.VERTICAL,
    backgroundColor: colors.screen_background,
  },
  inputText: {
    fontSize: FONT_SIZE.REGULAR,
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
    borderTopLeftRadius: MODAL.BORDER_RADIUS,
    borderTopRightRadius: MODAL.BORDER_RADIUS,
    height: MODAL.HEIGHT_PERCENTAGE,
    overflow: "hidden",
  },
  headerBar: {
    height: MODAL.HEADER_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.HORIZONTAL,
    borderBottomWidth: 1,
    borderColor: colors.divider_light,
    backgroundColor: colors.screen_background,
  },
  headerTitle: {
    fontSize: FONT_SIZE.HEADER,
    fontFamily: typography.bold,
    color: colors.text_primary,
  },
  headerButton: {
    fontSize: FONT_SIZE.REGULAR,
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
    height: PICKER_ITEM.HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.HORIZONTAL,
  },
  pickerItemSelected: {
    backgroundColor: colors.light_yellow,
  },
  pickerItemText: {
    fontSize: FONT_SIZE.REGULAR,
    fontFamily: typography.regular,
    color: colors.text_gray,
  },
  pickerItemTextSelected: {
    fontFamily: typography.medium,
    color: colors.text_primary,
  },
});

export default YearMonthPicker;
