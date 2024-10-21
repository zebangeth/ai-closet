import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ClothingContext } from '../contexts/ClothingContext';
import { ClothingItem } from '../types/ClothingItem';
import { v4 as uuidv4 } from 'uuid';
import { removeBackground } from '../services/BackgroundRemoval';
import { categorizeClothing } from '../services/ClothingCategorization';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ClosetStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<ClosetStackParamList, 'AddClothingItemScreen'>;

const AddClothingItemScreen: React.FC<Props> = ({ navigation, route }) => {
  const { source } = route.params;
  const context = useContext(ClothingContext);
  const addClothingItem = context?.addClothingItem;

  useEffect(() => {
    if (source === 'gallery') {
      handleChooseFromPhotos();
    } else if (source === 'camera') {
      handleTakePhoto();
    }
  }, []);

  const handleChooseFromPhotos = async () => {
    // Request permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Permission to access gallery is required!');
      navigation.goBack();
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      processImage(result.assets[0].uri);
    } else {
      navigation.goBack();
    }
  };

  const handleTakePhoto = async () => {
    // Request permission
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Permission to access camera is required!');
      navigation.goBack();
      return;
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync();
    if (!result.canceled) {
      processImage(result.assets[0].uri);
    } else {
      navigation.goBack();
    }
  };

  const processImage = async (uri: string) => {
    try {
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
    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert('Error', 'An error occurred while processing the image.');
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text>Processing image...</Text>
      {/* You can add a loading indicator here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default AddClothingItemScreen;
