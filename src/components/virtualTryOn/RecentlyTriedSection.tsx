import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";
import { typography } from "../../styles/globalStyles";
import { VirtualTryOnItem } from "../../types/VirtualTryOn";

type Props = {
  items: VirtualTryOnItem[];
  onItemPress: (item: VirtualTryOnItem) => void;
};

const RecentlyTriedSection = ({ items, onItemPress }: Props) => {
  if (items.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recently Tried</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {items.map((item) => (
          <TouchableOpacity key={item.id} style={styles.itemContainer} onPress={() => onItemPress(item)}>
            <View style={styles.imageWrapper}>
              <Image source={{ uri: item.resultImageUri }} style={styles.image} resizeMode="cover" />
              <View style={styles.tryOnTypeTag}>
                <MaterialIcons
                  name={item.tryOnType === "discover" ? "photo-library" : "checkroom"}
                  size={12}
                  color={colors.text_primary}
                />
                <Text style={styles.tryOnTypeText}>{item.tryOnType === "discover" ? "Discover" : "Closet Item"}</Text>
              </View>
            </View>
            <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: typography.medium,
    color: colors.text_primary,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  itemContainer: {
    marginRight: 12,
    marginLeft: 4,
    width: 120,
  },
  imageWrapper: {
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: colors.thumbnail_background,
    marginBottom: 4,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  tryOnTypeTag: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: colors.primary_yellow,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  tryOnTypeText: {
    fontSize: 10,
    fontFamily: typography.medium,
    color: colors.text_primary,
  },
  date: {
    fontSize: 12,
    fontFamily: typography.regular,
    color: colors.text_gray,
    textAlign: "center",
  },
});

export default RecentlyTriedSection;
