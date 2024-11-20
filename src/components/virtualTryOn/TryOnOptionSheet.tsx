import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";
import { typography } from "../../styles/globalStyles";
import PressableFade from "../common/PressableFade";

type TryOnOption = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  isComingSoon?: boolean;
};

const tryOnOptions: TryOnOption[] = [
  {
    id: "single",
    title: "Single Closet Item",
    description: "Try a single item from your closet",
    icon: "checkroom",
  },
  {
    id: "discover",
    title: "Discover & Try",
    description: "Try on new items from your photo albums or product images from online stores",
    icon: "photo-library",
  },
  {
    id: "outfit",
    title: "Complete Outfits",
    description: "Try on your saved outfit with multiple pieces",
    icon: "style",
    isComingSoon: true,
  },
];

type Props = {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (optionId: string) => void;
};

const TryOnOptionSheet = ({ isVisible, onClose, onSelect }: Props) => {
  if (!isVisible) return null;

  return (
    <Pressable style={styles.overlay} onPress={onClose}>
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose what to try on</Text>
          <PressableFade onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color={colors.icon_stroke} />
          </PressableFade>
        </View>

        <View style={styles.optionsList}>
          {tryOnOptions.map((option) => (
            <PressableFade
              key={option.id}
              style={styles.optionItem}
              onPress={() => !option.isComingSoon && onSelect(option.id)}
              disabled={option.isComingSoon}
            >
              <View style={styles.optionIcon}>
                <MaterialIcons name={option.icon} size={24} color={colors.icon_stroke} />
              </View>
              <View style={styles.optionContent}>
                <View style={styles.optionTitleRow}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  {option.isComingSoon && (
                    <View style={styles.comingSoonBadge}>
                      <Text style={styles.comingSoonText}>Coming Soon</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
            </PressableFade>
          ))}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background_dim,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.screen_background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: "50%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontFamily: typography.bold,
    fontSize: 20,
    color: colors.text_primary,
  },
  closeButton: {
    padding: 4,
  },
  optionsList: {
    gap: 16,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: colors.thumbnail_background,
    borderRadius: 12,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.screen_background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  optionTitle: {
    fontFamily: typography.semiBold,
    fontSize: 16,
    color: colors.text_primary,
    marginRight: 8,
  },
  optionDescription: {
    fontFamily: typography.regular,
    fontSize: 14,
    color: colors.text_gray,
  },
  comingSoonBadge: {
    backgroundColor: colors.light_yellow,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  comingSoonText: {
    fontFamily: typography.medium,
    fontSize: 12,
    color: colors.text_primary,
  },
});

export default TryOnOptionSheet;
