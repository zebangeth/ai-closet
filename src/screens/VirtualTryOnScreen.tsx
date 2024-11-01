import React, { useState } from "react";
import { View, Text, Alert, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { colors } from "../styles/colors";
import { typography } from "../styles/globalStyles";
import TryOnOptionSheet from "../components/virtualTryOn/TryOnOptionSheet";
import ContentSelectionBox from "../components/virtualTryOn/ContentSelectionBox";
import PhotoTipsSection from "../components/virtualTryOn/PhotoTipsSection";

const VirtualTryOnScreen = () => {
  const [isOptionSheetVisible, setOptionSheetVisible] = useState(false);
  const [selectedOutfitUri, setSelectedOutfitUri] = useState<string>();
  const [selectedPhotoUri, setSelectedPhotoUri] = useState<string>();

  const handleOptionSelect = async (optionId: string) => {
    setOptionSheetVisible(false);

    if (optionId === "discover") {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Required", "Permission to access gallery is required!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedOutfitUri(result.assets[0].uri);
      }
    }
    // Handle other options in the next implementation steps
  };

  const handlePhotoSelect = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedPhotoUri(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Virtual Try-On</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Instructions */}
        <Text style={styles.instructions}>Select an outfit and upload your photo to see how it looks on you</Text>

        {/* Photo Tips Section */}
        <PhotoTipsSection />

        {/* Content Selection Area */}
        <View style={styles.selectionContainer}>
          <ContentSelectionBox
            title="Choose Outfit"
            iconName="checkroom"
            onPress={() => setOptionSheetVisible(true)}
            selectedImageUri={selectedOutfitUri}
          />
          <ContentSelectionBox
            title="Add Your Picture"
            iconName="add-a-photo"
            onPress={handlePhotoSelect}
            selectedImageUri={selectedPhotoUri}
          />
        </View>

        {/* Try It On button will be added in the next step */}
      </ScrollView>

      <TryOnOptionSheet
        isVisible={isOptionSheetVisible}
        onClose={() => setOptionSheetVisible(false)}
        onSelect={handleOptionSelect}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screen_background,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider_light,
  },
  title: {
    fontSize: 24,
    fontFamily: typography.bold,
    color: colors.text_primary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  instructions: {
    fontSize: 16,
    fontFamily: typography.regular,
    color: colors.text_gray,
    marginBottom: 16,
  },
  selectionContainer: {
    flexDirection: "row",
    marginHorizontal: -6,
    marginBottom: 24,
  },
});

export default VirtualTryOnScreen;
