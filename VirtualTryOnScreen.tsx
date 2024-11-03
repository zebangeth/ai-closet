import React, { useState } from "react";
import { View, Text, Alert, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { colors } from "../styles/colors";
import { typography } from "../styles/globalStyles";
import TryOnOptionSheet from "../components/virtualTryOn/TryOnOptionSheet";
import ContentSelectionBox from "../components/virtualTryOn/ContentSelectionBox";

const VirtualTryOnScreen = () => {
  const [isOptionSheetVisible, setOptionSheetVisible] = useState(false);
  const [selectedOutfitUri, setSelectedOutfitUri] = useState<string>();
  const [selectedPhotoUri, setSelectedPhotoUri] = useState<string>();
  const [resultImageUri, setResultImageUri] = useState<string>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");

  const imageToBase64 = async (uri: string): Promise<string> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onerror = reject;
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(",")[1]);
      };
      reader.readAsDataURL(blob);
    });
  };

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

  const handleTryOn = async () => {
    if (!selectedOutfitUri || !selectedPhotoUri) {
      Alert.alert("Error", "Please select both an outfit and a photo.");
      return;
    }

    setIsProcessing(true);
    setFeedbackMessage("Processing, please wait...");

    try {
      const modelImageBase64 = await imageToBase64(selectedPhotoUri);
      const clothImageBase64 = await imageToBase64(selectedOutfitUri);

      const data = {
        model_image: modelImageBase64,
        cloth_image: clothImageBase64,
        category: "Upper body",
        num_inference_steps: 35,
        guidance_scale: 2,
        seed: 12467,
        base64: true,
      };

      const headers = {
        "x-api-key": "Your_API_KEY",
      };

      const response = await axios.post("https://api.segmind.com/v1/try-on-diffusion", data, { headers });

      if (response.data && response.data.image) {
        setResultImageUri(`data:image/png;base64,${response.data.image}`);
        setFeedbackMessage("Try-on complete! See your result below.");
      } else {
        setFeedbackMessage("Failed to retrieve the try-on result.");
        Alert.alert("Error", "Failed to get the try-on result.");
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      setFeedbackMessage("An error occurred during the try-on process.");
      Alert.alert("Error", "An error occurred during the try-on process.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Virtual Try-On</Text>
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.instructions}>Select an outfit and upload your photo to see how it looks on you</Text>

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

          <TouchableOpacity style={styles.tryOnButton} onPress={handleTryOn}>
            <Text style={styles.tryOnButtonText}>Try It On</Text>
          </TouchableOpacity>

          {feedbackMessage ? <Text style={styles.feedbackMessage}>{feedbackMessage}</Text> : null}

          {isProcessing && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={colors.primary_yellow} />
              </View>
          )}

          {/* Result Image Styled with "contain" Resize Mode */}
          {resultImageUri && (
              <View style={styles.resultContainer}>
                <Image source={{ uri: resultImageUri }} style={styles.resultImage} resizeMode="contain" />
              </View>
          )}
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
  tryOnButton: {
    backgroundColor: colors.primary_yellow,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  tryOnButtonText: {
    fontSize: 18,
    fontFamily: typography.bold,
    color: colors.text_primary,
  },
  feedbackMessage: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: typography.medium,
    color: colors.text_primary,
    marginVertical: 10,
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
  resultContainer: {
    width: "100%", // Full width
    aspectRatio: 3 / 4, // Set a portrait aspect ratio to match typical model images
    backgroundColor: colors.thumbnail_background,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginTop: 16,
  },
  resultImage: {
    width: "100%",
    height: "100%",
  },
});

export default VirtualTryOnScreen;
