import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, FlatList, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";
import { typography } from "../../styles/globalStyles";

type Props = {
  selectedDate: string; // Format: 'YYYY-MM'
  onValueChange: (date: string) => void;
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

const YearMonthPicker = ({ selectedDate, onValueChange }: Props) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [tempMonth, setTempMonth] = useState<number>(
    selectedDate ? parseInt(selectedDate.split("-")[1]) - 1 : new Date().getMonth()
  );
  const [tempYear, setTempYear] = useState<number>(
    selectedDate ? parseInt(selectedDate.split("-")[0]) : new Date().getFullYear()
  );

  const formatSelectedDate = (year: number, month: number): string => {
    const formattedMonth = months[month];
    return `${formattedMonth} ${year}`;
  };

  const handleConfirm = () => {
    const month = tempMonth + 1;
    const formattedMonth = month < 10 ? `0${month}` : month;
    onValueChange(`${tempYear}-${formattedMonth}`);
    setModalVisible(false);
  };

  const years = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= 2000; i--) {
    years.push(i);
  }

  // Find initial scroll indices
  const yearIndex = years.findIndex((year) => year === tempYear);
  const monthIndex = tempMonth;

  return (
    <View>
      <TouchableOpacity style={styles.inputField} onPress={() => setModalVisible(true)}>
        <Text style={styles.inputText}>
          {selectedDate ? formatSelectedDate(tempYear, tempMonth) : "Select Purchase Date"}
        </Text>
        <MaterialCommunityIcons name="chevron-down" size={24} color={colors.text_gray} />
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            {/* Header Bar */}
            <View style={styles.headerBar}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.headerButton}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Select Date</Text>
              <TouchableOpacity onPress={handleConfirm}>
                <Text style={[styles.headerButton, { color: colors.primary_yellow }]}>Done</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.pickerContent}>
              {/* Month Picker */}
              <View style={[styles.pickerContainer, styles.leftPicker]}>
                <FlatList
                  data={months}
                  keyExtractor={(item) => item}
                  initialScrollIndex={monthIndex}
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

              {/* Year Picker */}
              <View style={[styles.pickerContainer, styles.rightPicker]}>
                <FlatList
                  data={years}
                  keyExtractor={(item) => item.toString()}
                  initialScrollIndex={yearIndex}
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
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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
    textAlign: "center",
  },
  pickerItemTextSelected: {
    fontFamily: typography.medium,
    color: colors.text_primary,
  },
});

export default YearMonthPicker;
