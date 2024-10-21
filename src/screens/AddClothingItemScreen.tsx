// screens/AddClothingItemScreen.tsx
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ClothingContext } from '../contexts/ClothingContext';
import { ClothingItem } from '../types/ClothingItem';
import { v4 as uuidv4 } from 'uuid';
import { removeBackground } from '../services/BackgroundRemoval';
import { categorizeClothing } from '../services/ClothingCategorization';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ClosetStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<ClosetStackParamList, 'AddClothingItemScreen'>;

const AddClothingItemScreen: React.FC<Props> = ({ navigation }) => {
  const context = useContext(ClothingContext);
  const addClothingItem = context?.addClothingItem;

  const handleChooseFromPhotos = async () => {
    // Request permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access gallery is required!');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      processImage(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    // Request permission
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access camera is required!');
      return;
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync();
    if (!result.canceled) {
      processImage(result.assets[0].uri);
    }
  };

  const processImage = async (uri: string) => {
    // Background removal
    const bgRemovedUri = await removeBackground(uri);
  
    // AI categorization
    const aiData = await categorizeClothing(bgRemovedUri);
  
    const newItem: ClothingItem = {
      id: uuidv4(),
      imageUri: uri,
      backgroundRemovedImageUri: bgRemovedUri,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: aiData.category || '',
      subcategory: aiData.subcategory || '',
      tags: [],
      color: aiData.color || '',
      season: [],
      occasion: [],
      brand: '',
      purchaseDate: '',
      price: 0,
    };  

    if (addClothingItem) {
      addClothingItem(newItem);
      navigation.navigate('ClothingDetail', { id: newItem.id });
    } else {
      console.error('addClothingItem is undefined');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleChooseFromPhotos}>
        <Text>Choose from Photos</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
        <Text>Camera</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  button: { margin: 10, padding: 10, backgroundColor: '#ddd' },
  cancelButton: { marginTop: 20, padding: 10 },
});

export default AddClothingItemScreen;
