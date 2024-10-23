import React, { useContext, useState } from "react";
import { View, Text, FlatList, StyleSheet, Alert, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { v4 as uuidv4 } from "uuid";
import { ClothingContext } from "../contexts/ClothingContext";
import ClothingItemThumbnail from "../components/clothing/ClothingItemThumbnail";
import AnimatedAddButton from "../components/common/AnimatedAddButton";
import { ClothingItem } from "../types/ClothingItem";
import { removeBackground } from "../services/BackgroundRemoval";
import { categorizeClothing } from "../services/ClothingCategorization";
import { colors } from "../styles/colors";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ClosetStackParamList } from "../types/navigation";

type Props = NativeStackScreenProps<ClosetStackParamList, "ClothingManagement">;

const ClothingManagementScreen = ({ navigation }: Props) => {
  const context = useContext(ClothingContext);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!context) {
    return <Text>Loading...</Text>;
  }

  const { clothingItems, addClothingItem } = context;

  const renderItem = ({ item }: { item: ClothingItem }) => (
    <ClothingItemThumbnail item={item} onPress={() => navigation.navigate("ClothingDetail", { id: item.id })} />
  );

  const handleChoosePhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      processImage(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "Permission to access camera is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();
    if (!result.canceled) {
      processImage(result.assets[0].uri);
    }
  };

  const processImage = async (uri: string) => {
    try {
      setIsProcessing(true);

      const bgRemovedUri = await removeBackground(uri);
      const aiData = await categorizeClothing(bgRemovedUri);

      const newItem: ClothingItem = {
        id: uuidv4(),
        imageUri: uri,
        backgroundRemovedImageUri: bgRemovedUri,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        category: aiData.category || "",
        subcategory: aiData.subcategory || "",
        tags: [],
        color: aiData.color || "",
        season: [],
        occasion: [],
        brand: "",
        purchaseDate: "",
        price: 0,
      };

      addClothingItem(newItem);
      navigation.navigate("ClothingDetail", { id: newItem.id });
    } catch (error) {
      console.error("Error processing image:", error);
      Alert.alert("Error", "An error occurred while processing the image.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList<ClothingItem>
        data={clothingItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.listContent}
      />
      <AnimatedAddButton onChoosePhoto={handleChoosePhoto} onTakePhoto={handleTakePhoto} />
      {isProcessing && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary_yellow} />
          <Text style={styles.loadingText}>Processing image...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.screen_background },
  listContent: {
    paddingBottom: 80,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background_dim,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    color: "#fff",
    fontSize: 18,
  },
});

export default ClothingManagementScreen;
