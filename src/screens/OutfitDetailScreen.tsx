import React, { useContext, useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ScrollView, Alert } from "react-native";
import { SafeAreaView, Edge } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { OutfitContext } from "../contexts/OutfitContext";
import {
  OutfitStackScreenProps,
  RootStackScreenProps,
  RootStackParamList,
  MainTabParamList,
  OutfitStackParamList,
} from "../types/navigation";
import { Outfit } from "../types/Outfit";
import { colors } from "../styles/colors";
import { typography } from "../styles/globalStyles";
import TagChips from "../components/common/TagChips";
import Header from "../components/common/Header";
import MultiSelectToggle from "../components/common/MultiSelectToggle";
import { seasons, occasions } from "../data/options";
import { MaterialIcons } from "@expo/vector-icons";
import ClothingItemThumbnail from "../components/clothing/ClothingItemThumbnail";
import { ClothingContext } from "../contexts/ClothingContext";
import PressableFade from "../components/common/PressableFade";

type Props = OutfitStackScreenProps<"OutfitDetail"> | RootStackScreenProps<"OutfitDetailModal">;

const OutfitDetailScreen = ({ route, navigation }: Props) => {
  const isModal = route.name === "OutfitDetailModal";

  const { id } = route.params;
  const outfitContext = useContext(OutfitContext);
  const clothingContext = useContext(ClothingContext);

  if (!outfitContext || !clothingContext) {
    return <Text>Loading...</Text>;
  }

  const { getOutfit, updateOutfit, deleteOutfit } = outfitContext;
  const { getClothingItem } = clothingContext;

  // Get the initial outfit from context
  const contextOutfit = getOutfit(id);

  // Manage local state for the form
  const [localOutfit, setLocalOutfit] = useState<Outfit | undefined>(contextOutfit);
  const [isDirty, setIsDirty] = useState(false);

  // Update local state when context outfit changes
  useEffect(() => {
    if (contextOutfit) {
      setLocalOutfit(contextOutfit);
    }
  }, [contextOutfit]);

  if (!localOutfit) {
    return (
      <View style={styles.container}>
        <Text>Outfit not found.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert("Delete Outfit", "Are you sure you want to delete this outfit?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteOutfit(id);
          navigation.goBack();
        },
      },
    ]);
  };

  const handleSave = () => {
    if (localOutfit) {
      updateOutfit(localOutfit);
      setIsDirty(false);
      Alert.alert("Success", "Outfit updated successfully");
    }
  };

  const handleFieldChange = (field: keyof Outfit, value: any) => {
    setLocalOutfit((prevOutfit) => {
      if (!prevOutfit) return prevOutfit;
      return { ...prevOutfit, [field]: value };
    });
    setIsDirty(true);
  };

  const handleEditOutfit = () => {
    if (!isModal) {
      // If not in modal, we can directly navigate within the outfit stack
      (navigation as NativeStackNavigationProp<OutfitStackParamList>).navigate("OutfitCanvas", {
        id,
      });
    }
  };

  const handleClothingItemPress = (itemId: string) => {
    // Get the root navigation and navigate to the modal
    navigation
      .getParent<NativeStackNavigationProp<RootStackParamList>>()
      ?.navigate("ClothingDetailModal", { id: itemId });
  };

  const safeAreaEdges: Edge[] = ["top", "left", "right"];

  return (
    <SafeAreaView style={styles.container} edges={safeAreaEdges}>
      <Header
        onBack={() => {
          if (isDirty) {
            Alert.alert("Unsaved Changes", "Do you want to save your changes?", [
              {
                text: "Discard",
                style: "destructive",
                onPress: () => navigation.goBack(),
              },
              {
                text: "Save",
                onPress: () => {
                  handleSave();
                  navigation.goBack();
                },
              },
            ]);
          } else {
            navigation.goBack();
          }
        }}
        onDelete={handleDelete}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Main outfit image section */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: localOutfit.imageUri }} style={styles.image} resizeMode="contain" />
          {!isModal && ( // Only show edit button if not in modal
            <PressableFade
              containerStyle={styles.editButtonContainer}
              style={styles.editButton}
              onPress={handleEditOutfit}
            >
              <View style={styles.editButtonContent}>
                <MaterialIcons name="edit" size={20} color={colors.text_primary} />
                <Text style={styles.editButtonText}>Edit Outfit</Text>
              </View>
            </PressableFade>
          )}
        </View>

        {/* Tags section */}
        <View style={[styles.section, { paddingTop: 14 }]}>
          <TagChips
            tags={localOutfit.tags}
            onAddTag={(tag) => {
              handleFieldChange("tags", [...localOutfit.tags, tag]);
            }}
            onRemoveTag={(tag) => {
              handleFieldChange(
                "tags",
                localOutfit.tags.filter((t) => t !== tag)
              );
            }}
          />
        </View>

        {/* Included Items section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Included Items</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.itemsScroll}>
            {localOutfit.clothingItems.map((item) => {
              const clothingItem = getClothingItem(item.id);
              if (!clothingItem) return null;
              return (
                <View key={item.id} style={styles.itemThumbnail}>
                  <ClothingItemThumbnail item={clothingItem} onPress={() => handleClothingItemPress(item.id)} />
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* Outfit Details section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Outfit Details</Text>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Season</Text>
            <MultiSelectToggle
              options={seasons}
              selectedValues={localOutfit.season}
              onValueChange={(selectedSeasons) => handleFieldChange("season", selectedSeasons)}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Occasion</Text>
            <MultiSelectToggle
              options={occasions}
              selectedValues={localOutfit.occasion}
              onValueChange={(selectedOccasions) => handleFieldChange("occasion", selectedOccasions)}
            />
          </View>
        </View>
      </ScrollView>

      {isDirty && (
        <PressableFade containerStyle={styles.saveButtonContainer} style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </PressableFade>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screen_background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 3 / 4,
    backgroundColor: colors.thumbnail_background,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  editButtonContainer: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
  editButton: {
    backgroundColor: colors.primary_yellow,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  editButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  editButtonText: {
    marginLeft: 4,
    fontSize: 14,
    fontFamily: typography.medium,
    color: colors.text_primary,
  },
  section: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: typography.bold,
    color: colors.text_primary,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  field: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  fieldLabel: {
    fontSize: 16,
    fontFamily: typography.medium,
    color: colors.text_primary,
    marginBottom: 8,
  },
  itemsScroll: {
    paddingHorizontal: 11,
  },
  itemThumbnail: {
    width: 120,
  },
  saveButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  saveButton: {
    backgroundColor: colors.primary_yellow,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: typography.bold,
    color: colors.text_primary,
  },
});

export default OutfitDetailScreen;
