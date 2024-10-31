import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../styles/colors";
import { typography } from "../styles/globalStyles";
import TryOnOptionSheet from "../components/virtualTryOn/TryOnOptionSheet";

const VirtualTryOnScreen = () => {
  const [isOptionSheetVisible, setOptionSheetVisible] = useState(false);

  const handleOptionSelect = (optionId: string) => {
    setOptionSheetVisible(false);
    // Handle option selection in the next step
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
        <View style={styles.tipsSection}>
          <MaterialIcons name="info" size={20} color={colors.text_gray} />
          <Text style={styles.tipsText}>Show Photo Tips</Text>
        </View>

        {/* Main content areas will be added in next step */}
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
  tipsSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
  },
  tipsText: {
    fontSize: 14,
    fontFamily: typography.medium,
    color: colors.text_gray,
    textDecorationLine: "underline",
  },
});

export default VirtualTryOnScreen;
