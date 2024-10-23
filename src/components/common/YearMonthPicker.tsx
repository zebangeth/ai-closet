import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, FlatList, Pressable } from "react-native";

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
  const [tempMonth, setTempMonth] = useState<number>(new Date().getMonth());
  const [tempYear, setTempYear] = useState<number>(new Date().getFullYear());

  const handleConfirm = () => {
    const month = tempMonth + 1; // Months are zero-indexed
    const formattedMonth = month < 10 ? `0${month}` : month;
    onValueChange(`${tempYear}-${formattedMonth}`);
    setModalVisible(false);
  };

  const years = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= 2000; i--) {
    years.push(i);
  }

  return (
    <View>
      <TouchableOpacity style={styles.inputField} onPress={() => setModalVisible(true)}>
        <Text style={styles.inputText}>{selectedDate ? selectedDate : "Select Purchase Date"}</Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            {/* Header Bar */}
            <View style={styles.headerBar}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.headerButton}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Select Purchase Date</Text>
              <TouchableOpacity onPress={handleConfirm}>
                <Text style={styles.headerButton}>Confirm</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.pickerContent}>
              {/* Month Picker */}
              <View style={styles.pickerContainer}>
                <FlatList
                  data={months}
                  keyExtractor={(item) => item}
                  initialScrollIndex={tempMonth}
                  getItemLayout={(data, index) => ({
                    length: 40,
                    offset: 40 * index,
                    index,
                  })}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      style={[styles.pickerItem, tempMonth === index && styles.pickerItemSelected]}
                      onPress={() => setTempMonth(index)}
                    >
                      <Text style={styles.pickerItemText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>

              {/* Year Picker */}
              <View style={styles.pickerContainer}>
                <FlatList
                  data={years}
                  keyExtractor={(item) => item.toString()}
                  initialScrollIndex={0}
                  getItemLayout={(data, index) => ({
                    length: 40,
                    offset: 40 * index,
                    index,
                  })}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[styles.pickerItem, tempYear === item && styles.pickerItemSelected]}
                      onPress={() => setTempYear(item)}
                    >
                      <Text style={styles.pickerItemText}>{item}</Text>
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
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    justifyContent: "center",
  },
  inputText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContainer: {
    height: "40%", // Take half the screen
    backgroundColor: "#fff",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerBar: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerButton: {
    fontSize: 16,
    color: "#007aff",
  },
  pickerContent: {
    flexDirection: "row",
    flex: 1,
  },
  pickerContainer: {
    flex: 1,
  },
  pickerItem: {
    padding: 12,
    alignItems: "center",
  },
  pickerItemSelected: {
    backgroundColor: "#f0f0f0",
  },
  pickerItemText: {
    fontSize: 16,
  },
});

export default YearMonthPicker;
