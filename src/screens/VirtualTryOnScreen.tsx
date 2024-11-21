import React, { useState, useEffect, useCallback, useContext } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, Image } from "react-native";
import { SafeAreaView, Edge } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { colors } from "../styles/colors";
import { typography } from "../styles/globalStyles";
import PressableFade from "../components/common/PressableFade";
import TryOnOptionSheet from "../components/virtualTryOn/TryOnOptionSheet";
import ContentSelectionBox from "../components/virtualTryOn/ContentSelectionBox";
import PhotoTipsSection from "../components/virtualTryOn/PhotoTipsSection";
import TryOnProgress from "../components/virtualTryOn/TryOnProgress";
import RecentlyTriedSection from "../components/virtualTryOn/RecentlyTriedSection";
import { virtualTryOn } from "../services/VirtualTryOn";
import { VirtualTryOnContext } from "../contexts/VirtualTryOnContext";
import { VirtualTryOnItem } from "../types/VirtualTryOn";
import { TryOnStackScreenProps } from "../types/navigation";
import DeleteModeHeader from "../components/common/DeleteModeHeader";
import DeleteButton from "../components/common/DeleteButton";

type Props = TryOnStackScreenProps<"VirtualTryOn">;

const VirtualTryOnScreen = ({ navigation }: Props) => {
  const [isOptionSheetVisible, setOptionSheetVisible] = useState(false);
  const [selectedOutfitUri, setSelectedOutfitUri] = useState<string>();
  const [selectedPhotoUri, setSelectedPhotoUri] = useState<string>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultImageUri, setResultImageUri] = useState<string>();
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const tryOnContext = useContext(VirtualTryOnContext);
  if (!tryOnContext) {
    return null;
  }
  const { recentTryOns, addTryOn, deleteHistoryItems } = tryOnContext;

  // Progress timer effect
  useEffect(() => {
    if (isProcessing) {
      const startTime = Date.now();
      const targetTime = startTime + 30000; // 30 seconds

      const intervalId = setInterval(() => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const percentage = Math.min((elapsed / 30000) * 95, 95); // Max 95% until API returns

        if (currentTime >= targetTime) {
          clearInterval(intervalId);
        } else {
          setProgress(percentage);
        }
      }, 100); // Update every 100ms for smooth animation

      return () => clearInterval(intervalId);
    }
  }, [isProcessing]);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "Permission to access gallery is required!");
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      aspect: [3, 4],
      quality: 1,
    });

    return !result.canceled ? result.assets[0].uri : null;
  };

  const handleOptionSelect = async (optionId: string) => {
    setOptionSheetVisible(false);

    // Add slight delay before showing picker to ensure smooth animation
    setTimeout(async () => {
      if (optionId === "discover") {
        const uri = await pickImage();
        if (uri) {
          setSelectedOutfitUri(uri);
          setResultImageUri(undefined);
        }
      }
    }, 300);
  };

  const handlePhotoSelect = async () => {
    const uri = await pickImage();
    if (uri) {
      setSelectedPhotoUri(uri);
      setResultImageUri(undefined);
    }
  };

  // Handle try-on process
  const handleTryOn = useCallback(async () => {
    if (!selectedOutfitUri || !selectedPhotoUri) {
      Alert.alert("Missing Content", "Please select both an outfit and a photo to continue.");
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const response = await virtualTryOn({
        outfitImageUri: selectedOutfitUri,
        userPhotoUri: selectedPhotoUri,
      });

      setResultImageUri(response.resultImageUri);
      setProgress(100);

      // Save to try-on history
      await addTryOn({
        tryOnType: "discover",
        newClothingImageUri: selectedOutfitUri,
        userPhotoUri: selectedPhotoUri,
        resultImageUri: response.resultImageUri,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to process virtual try-on. Please try again.");
      console.error("Virtual try-on error:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [selectedOutfitUri, selectedPhotoUri, addTryOn]);

  const handleRecentItemPress = (item: VirtualTryOnItem) => {
    setSelectedOutfitUri(item.newClothingImageUri);
    setSelectedPhotoUri(item.userPhotoUri);
    setResultImageUri(item.resultImageUri);
  };

  const handleLongPress = useCallback((item: VirtualTryOnItem) => {
    setIsSelectionMode(true);
    setSelectedItems(new Set([item.id]));
  }, []);

  const handleItemPress = useCallback(
    (item: VirtualTryOnItem) => {
      if (isSelectionMode) {
        setSelectedItems((prev) => {
          const newSet = new Set(prev);
          if (newSet.has(item.id)) {
            newSet.delete(item.id);
            // If no items are selected, exit selection mode
            if (newSet.size === 0) {
              setIsSelectionMode(false);
            }
          } else {
            newSet.add(item.id);
          }
          return newSet;
        });
      } else {
        // Normal item press handler
        setSelectedOutfitUri(item.newClothingImageUri);
        setSelectedPhotoUri(item.userPhotoUri);
        setResultImageUri(item.resultImageUri);
      }
    },
    [isSelectionMode]
  );

  const handleCancelSelection = useCallback(() => {
    setIsSelectionMode(false);
    setSelectedItems(new Set());
  }, []);

  const handleDelete = useCallback(() => {
    Alert.alert(
      "Delete History",
      `Are you sure you want to delete ${selectedItems.size} item${
        selectedItems.size > 1 ? "s" : ""
      } from your try-on history?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteHistoryItems(selectedItems);
              setIsSelectionMode(false);
              setSelectedItems(new Set());
            } catch (error) {
              Alert.alert("Error", "Failed to delete items. Please try again.");
            }
          },
        },
      ]
    );
  }, [selectedItems, deleteHistoryItems]);

  const safeAreaEdges: Edge[] = ["top", "left", "right"];

  return (
    <SafeAreaView style={styles.container} edges={safeAreaEdges}>
      {/* Header */}
      {isSelectionMode ? (
        <DeleteModeHeader selectedCount={selectedItems.size} onCancel={handleCancelSelection} />
      ) : (
        <View style={styles.header}>
          <Text style={styles.title}>Virtual Try-On</Text>
        </View>
      )}

      <ScrollView style={[styles.content, isSelectionMode && styles.contentWithDelete]}>
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

        {/* Try-On Progress or Button */}
        {isProcessing ? (
          <TryOnProgress progress={progress} />
        ) : (
          !resultImageUri && (
            <PressableFade
              containerStyle={styles.tryOnButtonContainer}
              style={[styles.tryOnButton, (!selectedOutfitUri || !selectedPhotoUri) && styles.tryOnButtonDisabled]}
              onPress={handleTryOn}
              disabled={!selectedOutfitUri || !selectedPhotoUri}
            >
              <Text style={styles.tryOnButtonText}>Try It On!</Text>
            </PressableFade>
          )
        )}

        {/* Result Display */}
        {resultImageUri && (
          <View style={styles.resultContainer}>
            <Text style={styles.subtitle}>Here's how it looks on you!</Text>
            <Image source={{ uri: resultImageUri }} style={styles.resultImage} resizeMode="contain" />
            <PressableFade
              containerStyle={styles.regenerateButtonContainer}
              style={styles.regenerateButton}
              onPress={() => {
                setResultImageUri(undefined);
                handleTryOn();
              }}
            >
              <Text style={styles.regenerateButtonText}>Re-generate</Text>
            </PressableFade>
          </View>
        )}

        {/* Recently Tried Section */}
        {recentTryOns.length > 0 && (
          <RecentlyTriedSection
            items={recentTryOns}
            onItemPress={handleItemPress}
            onItemLongPress={handleLongPress}
            isSelectionMode={isSelectionMode}
            selectedItems={selectedItems}
          />
        )}
      </ScrollView>

      {/* Delete Button */}
      {isSelectionMode && <DeleteButton onDelete={handleDelete} selectedCount={selectedItems.size} />}

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
  tryOnButtonContainer: {
    marginBottom: 24,
  },
  tryOnButton: {
    backgroundColor: colors.primary_yellow,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  tryOnButtonDisabled: {
    opacity: 0.5,
  },
  tryOnButtonText: {
    fontSize: 16,
    fontFamily: typography.bold,
    color: colors.text_primary,
  },
  resultContainer: {
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: typography.medium,
    color: colors.text_primary,
    marginBottom: 12,
  },
  resultImage: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: colors.thumbnail_background,
  },
  regenerateButtonContainer: {
    width: "100%",
  },
  regenerateButton: {
    backgroundColor: colors.thumbnail_background,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  regenerateButtonText: {
    fontSize: 14,
    fontFamily: typography.medium,
    color: colors.text_primary,
  },
  contentWithDelete: {
    paddingBottom: 80,
  },
});

export default VirtualTryOnScreen;
