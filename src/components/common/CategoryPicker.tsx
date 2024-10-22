// src/components/common/CategoryPicker.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { categories } from '../../data/categories';
import { categoryIcons } from '../../data/categoryIcons';
import { CategoryType } from '../../types/CategoryTypes';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';

type Props = {
  selectedCategory: string;
  selectedSubcategory: string;
  onValueChange: (category: string, subcategory: string) => void;
};

const CategoryPicker: React.FC<Props> = ({
  selectedCategory,
  selectedSubcategory,
  onValueChange,
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [tempCategory, setTempCategory] = useState<CategoryType>(
    (selectedCategory as CategoryType) || 'Shoes'
  );
  const [tempSubcategory, setTempSubcategory] = useState(
    selectedSubcategory || categories[tempCategory][0]
  );

  const handleCategorySelect = (category: CategoryType) => {
    setTempCategory(category);
    setTempSubcategory(categories[category][0]);
  };

  const handleConfirm = () => {
    onValueChange(tempCategory, tempSubcategory);
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.inputField}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.inputText}>
          {selectedCategory
            ? `${selectedCategory} - ${selectedSubcategory}`
            : 'Select Category'}
        </Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Top Bar with Confirm and Cancel Buttons */}
            <View style={styles.topBar}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.topBarButton}
              >
                <Text style={styles.topBarButtonText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.topBarTitle}>Select Category</Text>
              <TouchableOpacity
                onPress={handleConfirm}
                style={styles.topBarButton}
              >
                <Text style={styles.topBarButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
            {/* Content */}
            <View style={styles.pickersContainer}>
              {/* Category List */}
              <View style={styles.pickerContainer}>
                <FlatList
                  data={Object.keys(categories) as CategoryType[]}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.pickerItem,
                        tempCategory === item && styles.pickerItemSelected,
                      ]}
                      onPress={() => handleCategorySelect(item)}
                    >
                      <MaterialCommunityIcons
                        name={categoryIcons[item]}
                        size={24}
                        color={
                          tempCategory === item
                            ? colors.primary_yellow
                            : colors.text_gray
                        }
                        style={{ marginRight: 8 }}
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
                      style={[
                        styles.pickerItem,
                        tempSubcategory === item && styles.pickerItemSelected,
                      ]}
                      onPress={() => setTempSubcategory(item)}
                    >
                      <Text style={styles.pickerItemText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  inputField: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    height: '50%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  topBar: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  topBarButton: {
    padding: 8,
  },
  topBarButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pickersContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  pickerContainer: {
    flex: 1,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  pickerItemSelected: {
    backgroundColor: '#f0f0f0',
  },
  pickerItemText: {
    fontSize: 16,
  },
});

export default CategoryPicker;
