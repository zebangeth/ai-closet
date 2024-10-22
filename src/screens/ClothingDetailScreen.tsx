import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  TextInput,
  Platform,
} from 'react-native';
import { ClothingContext } from '../contexts/ClothingContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ClosetStackParamList } from '../types/navigation';
import { ClothingItem } from '../types/ClothingItem';
import { colors } from '../styles/colors';
import TagChips from '../components/common/TagChips';
import { MaterialIcons } from '@expo/vector-icons';
import Header from '../components/common/Header';
import CategoryPicker from '../components/common/CategoryPicker';
import SeasonToggle from '../components/common/SeasonToggle';
import AutocompleteInput from '../components/common/AutocompleteInput';
import YearMonthPicker from '../components/common/YearMonthPicker';
import globalStyles from '../styles/globalStyles';
import {
  colors as colorSuggestions,
  brands as brandSuggestions,
  occasions as occasionSuggestions,
} from '../data/suggestions';
import { KeyboardAvoidingView, Platform as RNPlatform, ScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


type Props = NativeStackScreenProps<ClosetStackParamList, 'ClothingDetail'>;

const ClothingDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const context = useContext(ClothingContext);

  if (!context) {
    return <Text>Loading...</Text>;
  }

  const { clothingItems, deleteClothingItem, updateClothingItem } = context;
  const [item, setItem] = useState<ClothingItem | undefined>(
    clothingItems.find((ci) => ci.id === id)
  );

  const [isDirty, setIsDirty] = useState(false); // To track if changes were made

  useEffect(() => {
    const updatedItem = clothingItems.find((ci) => ci.id === id);
    setItem(updatedItem);
  }, [clothingItems]);

  if (!item) {
    return (
      <View style={styles.container}>
        <Text>Clothing item not found.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert('Delete Item', 'Are you sure you want to delete this clothing item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteClothingItem(id);
          navigation.goBack();
        },
      },
    ]);
  };

  const handleSave = () => {
    updateClothingItem(item);
    setIsDirty(false);
    Alert.alert('Success', 'Clothing item updated.');
  };

  const handleFieldChange = (field: keyof ClothingItem, value: any) => {
    setItem({ ...item!, [field]: value });
    setIsDirty(true);
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <Header onBack={() => navigation.goBack()} onDelete={handleDelete} />

      <KeyboardAvoidingView
        behavior={RNPlatform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
      >
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          extraScrollHeight={20}
        >
          {/* Image */}
          <Image
            source={{ uri: item.backgroundRemovedImageUri || item.imageUri }}
            style={styles.image}
          />

          {/* Tags Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <TagChips
              tags={item.tags}
              onAddTag={(tag) => {
                handleFieldChange('tags', [...item.tags, tag]);
              }}
              onRemoveTag={(tag) => {
                handleFieldChange('tags', item.tags.filter((t) => t !== tag));
              }}
            />
          </View>

          {/* Relevant Outfits Section */}
          {/* ... (Assuming no changes here) */}

          {/* Item Details Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Item Details</Text>

            {/* Category & Subcategory Field */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Category & Subcategory</Text>
              <CategoryPicker
                selectedCategory={item.category}
                selectedSubcategory={item.subcategory}
                onValueChange={(category, subcategory) => {
                  handleFieldChange('category', category);
                  handleFieldChange('subcategory', subcategory);
                }}
              />
            </View>

            {/* Season Field */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Season</Text>
              <SeasonToggle
                selectedSeasons={item.season}
                onValueChange={(seasons) => handleFieldChange('season', seasons)}
              />
            </View>

            {/* Color Field */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Color</Text>
              <AutocompleteInput
                value={item.color}
                data={colorSuggestions}
                placeholder="Enter color"
                onChangeText={(text) => handleFieldChange('color', text)}
              />
            </View>

            {/* Occasion Field */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Occasion</Text>
              <AutocompleteInput
                value={item.occasion.join(', ')}
                data={occasionSuggestions}
                placeholder="Enter occasion(s)"
                onChangeText={(text) =>
                  handleFieldChange(
                    'occasion',
                    text.split(',').map((s) => s.trim())
                  )
                }
              />
            </View>

            {/* Brand Field */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Brand</Text>
              <AutocompleteInput
                value={item.brand}
                data={brandSuggestions}
                placeholder="Enter brand"
                onChangeText={(text) => handleFieldChange('brand', text)}
              />
            </View>

            {/* Purchase Date Field */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Purchase Date</Text>
              <YearMonthPicker
                selectedDate={item.purchaseDate}
                onValueChange={(date) => handleFieldChange('purchaseDate', date)}
              />
            </View>

            {/* Price Field */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Price</Text>
              <TextInput
                style={styles.fieldInput}
                value={item.price ? item.price.toString() : ''}
                keyboardType="numeric"
                onChangeText={(text) => {
                  const numericValue = parseFloat(text);
                  handleFieldChange('price', isNaN(numericValue) ? 0 : numericValue);
                }}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>

      {/* Save Button */}
      {isDirty && (
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.screen_background },
  scrollContent: {
    paddingBottom: 80, // to avoid overlapping the save button
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  field: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
  },
  saveButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: colors.primary_yellow,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  outfitThumbnail: {
    width: 100,
    height: 150,
    marginRight: 8,
  },
  outfitImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});

export default ClothingDetailScreen;
