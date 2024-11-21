import React from "react";
import { StyleSheet, View, Image, ActivityIndicator } from "react-native";
import { BlurView } from "expo-blur";
import Animated, { FadeIn } from "react-native-reanimated";
import { colors } from "../../styles/colors";
import { typography } from "../../styles/globalStyles";

type Props = {
  imageUri: string;
  processedImageUri?: string;
  isLoading?: boolean;
  loadingText?: string;
  style?: any;
};

const LoadingImageView = ({ imageUri, processedImageUri, isLoading = false, loadingText, style }: Props) => {
  const displayImageUri = processedImageUri || imageUri;

  return (
    <View style={[styles.container, style]}>
      <Image source={{ uri: displayImageUri }} style={styles.image} resizeMode={isLoading ? "cover" : "contain"} />

      {isLoading && (
        <Animated.View entering={FadeIn} style={StyleSheet.absoluteFill}>
          <BlurView intensity={60} style={styles.blurContainer}>
            <ActivityIndicator size="large" color={colors.primary_yellow} />
            {loadingText && (
              <Animated.Text entering={FadeIn.delay(300)} style={styles.loadingText}>
                {loadingText}
              </Animated.Text>
            )}
          </BlurView>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: colors.thumbnail_background,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  blurContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: typography.medium,
    color: colors.text_gray,
    textAlign: "center",
  },
});

export default LoadingImageView;
