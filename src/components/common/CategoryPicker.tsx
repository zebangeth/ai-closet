import React, { useState, useEffect } from "react";
import { View, Text, Modal, StyleSheet, FlatList, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { categories } from "../../data/categories";
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
  ICON: 12,
  TEXT: 8,
};

const FONT_SIZE = {
  HEADER: 18,
  REGULAR: 16,
};

const ICON = {
  SIZE: 30,
  CATEGORY_SIZE: 24,
};

type Props = {
  selectedCategory: string;
  selectedSubcategory: string;
  onValueChange: (category: string, subcategory: string) => void;
  disabled?: boolean;
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

const CategoryPicker = ({ selectedCategory, selectedSubcategory, onValueChange, disabled = false }: Props) => {
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
            <PressableFade onPress={() => setModalVisible(false)} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>Cancel</Text>
            </PressableFade>
            <Text style={styles.headerTitle}>Select Category</Text>
            <PressableFade onPress={handleConfirm} style={styles.headerButton}>
              <Text style={[styles.headerButtonText, { color: colors.primary_yellow }]}>Done</Text>
            </PressableFade>
          </View>

          <View style={styles.pickerContent}>
            <View style={[styles.pickerContainer, styles.leftPicker]}>
              <FlatList
                data={Object.keys(categories)}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <PressableFade
                    style={[styles.pickerItem, tempCategory === item && styles.pickerItemSelected]}
                    onPress={() => handleCategorySelect(item as CategoryKey)}
                  >
                    <MaterialCommunityIcons
                      name={categoryIcons[item as CategoryKey]}
                      size={ICON.CATEGORY_SIZE}
                      color={tempCategory === item ? colors.text_primary : colors.text_gray}
                      style={styles.icon}
                    />
                    <Text style={[styles.pickerItemText, tempCategory === item && styles.pickerItemTextSelected]}>
                      {item}
                    </Text>
                  </PressableFade>
                )}
              />
            </View>

            <View style={[styles.pickerContainer, styles.rightPicker]}>
              <FlatList
                data={categories[tempCategory]}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <PressableFade
                    style={[styles.pickerItem, tempSubcategory === item && styles.pickerItemSelected]}
                    onPress={() => setTempSubcategory(item)}
                  >
                    <Text style={[styles.pickerItemText, tempSubcategory === item && styles.pickerItemTextSelected]}>
                      {item}
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
            {selectedCategory ? `${selectedCategory} - ${selectedSubcategory}` : "Select Category"}
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
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.HORIZONTAL,
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
  icon: {
    marginRight: SPACING.ICON,
  },
});

export default CategoryPicker;
