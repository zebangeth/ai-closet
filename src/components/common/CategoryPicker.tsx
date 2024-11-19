import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, FlatList, Pressable } from "react-native";
import { categories } from "../../data/categories";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";
import { typography } from "../../styles/globalStyles";

type Props = {
  selectedCategory: string;
  selectedSubcategory: string;
  onValueChange: (category: string, subcategory: string) => void;
  presentationType?: "default" | "inline";
};

type CategoryKey = keyof typeof categories;

const categoryIcons: { [key in CategoryKey]: React.ComponentProps<typeof MaterialCommunityIcons>["name"] } = {
  Tops: "tshirt-crew",
  Bottoms: "roller-skate-off",
  Dresses: "tshirt-crew",
  Footwear: "shoe-formal",
  Bags: "bag-personal",
  Accessories: "hat-fedora",
  Jewelry: "diamond-stone",
};

const CategoryPicker = ({
  selectedCategory,
  selectedSubcategory,
  onValueChange,
  presentationType = "default",
}: Props) => {
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

  const renderModal = () => (
    <Modal visible={isModalVisible} transparent animationType="slide">
      <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.headerBar}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.headerButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Select Category</Text>
            <TouchableOpacity onPress={handleConfirm}>
              <Text style={[styles.headerButton, { color: colors.primary_yellow }]}>Done</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pickerContent}>
            <View style={[styles.pickerContainer, styles.leftPicker]}>
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
                      color={tempCategory === item ? colors.text_primary : colors.text_gray}
                      style={styles.icon}
                    />
                    <Text style={[styles.pickerItemText, tempCategory === item && styles.pickerItemTextSelected]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            <View style={[styles.pickerContainer, styles.rightPicker]}>
              <FlatList
                data={categories[tempCategory]}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.pickerItem, tempSubcategory === item && styles.pickerItemSelected]}
                    onPress={() => setTempSubcategory(item)}
                  >
                    <Text style={[styles.pickerItemText, tempSubcategory === item && styles.pickerItemTextSelected]}>
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
  );

  if (presentationType === "inline") {
    return (
      <View style={styles.inlineContainer}>
        <TouchableOpacity style={styles.inlineValueContainer} onPress={() => setModalVisible(true)}>
          <Text style={styles.inlineValue}>
            {selectedCategory ? `${selectedCategory} - ${selectedSubcategory}` : "Select Category"}
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
          {selectedCategory ? `${selectedCategory} - ${selectedSubcategory}` : "Select Category"}
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
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
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
  icon: {
    marginRight: 12,
  },
});

export default CategoryPicker;
