import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, FlatList, Pressable } from "react-native";
import { categories } from "../../data/categories";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  selectedCategory: string;
  selectedSubcategory: string;
  onValueChange: (category: string, subcategory: string) => void;
};

type CategoryKey = keyof typeof categories;

const categoryIcons: { [key in CategoryKey]: React.ComponentProps<typeof MaterialCommunityIcons>["name"] } = {
  Tops: "tshirt-crew",
  Pants: "roller-skate-off",
  Skirts: "tshirt-crew",
  Dresses: "tshirt-crew",
  Shoes: "shoe-formal",
  Bags: "bag-personal",
  Hats: "hat-fedora",
  Jewelry: "diamond-stone",
  Accessories: "sunglasses",
};

const CategoryPicker = ({ selectedCategory, selectedSubcategory, onValueChange }: Props) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [tempCategory, setTempCategory] = useState<CategoryKey>((selectedCategory as CategoryKey) || "");
  const [tempSubcategory, setTempSubcategory] = useState(selectedSubcategory || "");

  useEffect(() => {
    if (isModalVisible) {
      setTempCategory((selectedCategory as CategoryKey) || "");
      setTempSubcategory(selectedSubcategory || "");
    }
  }, [isModalVisible]);

  const handleCategorySelect = (category: CategoryKey) => {
    setTempCategory(category);
    setTempSubcategory(categories[category][0]);
  };

  const handleConfirm = () => {
    onValueChange(tempCategory, tempSubcategory);
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity style={styles.inputField} onPress={() => setModalVisible(true)}>
        <Text style={styles.inputText}>
          {selectedCategory ? `${selectedCategory} - ${selectedSubcategory}` : "Select Category"}
        </Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            {/* Header Bar */}
            <View style={styles.headerBar}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.headerButton}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Select Category</Text>
              <TouchableOpacity onPress={handleConfirm}>
                <Text style={styles.headerButton}>Confirm</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.pickerContent}>
              {/* Category List */}
              <View style={styles.pickerContainer}>
                <FlatList
                  data={Object.keys(categories)}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[styles.pickerItem, tempCategory === item && styles.pickerItemSelected]}
                      onPress={() => handleCategorySelect(item as CategoryKey)}
                    >
                      <MaterialCommunityIcons
                        name={categoryIcons[item as CategoryKey]}
                        size={24}
                        color="black"
                        style={styles.icon}
                      />
                      <Text style={styles.pickerItemText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>

              {/* Subcategory List */}
              <View style={styles.pickerContainer}>
                <FlatList
                  data={categories[tempCategory]}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[styles.pickerItem, tempSubcategory === item && styles.pickerItemSelected]}
                      onPress={() => setTempSubcategory(item)}
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
    color: "#007aff", // iOS default blue color
  },
  pickerContent: {
    flexDirection: "row",
    flex: 1,
  },
  pickerContainer: {
    flex: 1,
  },
  pickerItem: {
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
  },
  pickerItemSelected: {
    backgroundColor: "#f0f0f0",
  },
  pickerItemText: {
    fontSize: 16,
    marginLeft: 8,
  },
  icon: {
    marginRight: 8,
  },
});

export default CategoryPicker;
