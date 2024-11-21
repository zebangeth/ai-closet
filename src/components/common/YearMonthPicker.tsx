import React, { useState } from "react";
import { View, Text, Modal, StyleSheet, FlatList, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";
import { typography } from "../../styles/globalStyles";
import PressableFade from "./PressableFade";

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
  disabled?: boolean;
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

const YearMonthPicker = ({ selectedDate, onValueChange, disabled = false }: Props) => {
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

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return "Select Date";
    const [year, month] = dateString.split("-");
    const monthIndex = parseInt(month) - 1;
    return `${monthAbbreviations[monthIndex]} ${year}`;
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
            <PressableFade onPress={() => setModalVisible(false)} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>Cancel</Text>
            </PressableFade>
            <Text style={styles.headerTitle}>Select Purchase Date</Text>
            <PressableFade onPress={handleConfirm} style={styles.headerButton}>
              <Text style={[styles.headerButtonText, { color: colors.primary_yellow }]}>Done</Text>
            </PressableFade>
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
                  <PressableFade
                    style={[styles.pickerItem, tempMonth === index && styles.pickerItemSelected]}
                    onPress={() => setTempMonth(index)}
                  >
                    <Text style={[styles.pickerItemText, tempMonth === index && styles.pickerItemTextSelected]}>
                      {item}
                    </Text>
                  </PressableFade>
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
                  <PressableFade
                    style={[styles.pickerItem, tempYear === item && styles.pickerItemSelected]}
                    onPress={() => setTempYear(item)}
                  >
                    <Text style={[styles.pickerItemText, tempYear === item && styles.pickerItemTextSelected]}>
                      {item.toString()}
                    </Text>
                  </PressableFade>
                )}
              />
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <PressableFade
        style={[styles.pressableContainer, disabled && styles.pressableContainerDisabled]}
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
      >
        <View style={styles.valueContainer}>
          <Text style={[styles.value, disabled && styles.valueDisabled]} numberOfLines={1}>
            {formatDisplayDate(selectedDate)}
          </Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={ICON.SIZE}
            color={disabled ? colors.text_gray_light : colors.text_gray}
          />
        </View>
      </PressableFade>
      {renderModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pressableContainer: {
    flex: 1,
  },
  pressableContainerDisabled: {
    opacity: 0.5,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: SPACING.HORIZONTAL,
  },
  value: {
    fontSize: FONT_SIZE.REGULAR,
    fontFamily: typography.regular,
    color: colors.text_gray,
    marginRight: SPACING.TEXT,
    textAlign: "right",
    flex: 1,
  },
  valueDisabled: {
    color: colors.text_gray_light,
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
    padding: SPACING.TEXT,
  },
  headerButtonText: {
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
