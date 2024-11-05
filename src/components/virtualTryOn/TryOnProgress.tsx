import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { colors } from "../../styles/colors";
import { typography } from "../../styles/globalStyles";

type Props = {
  progress: number;
};

const TryOnProgress = ({ progress }: Props) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Try-on Rendering Progress</Text>
        <Text style={styles.percentage}>{Math.round(progress)}%</Text>
      </View>
      <View style={styles.progressBackground}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: animatedWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.thumbnail_background,
    padding: 16,
    borderRadius: 12,
    marginVertical: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: typography.semiBold,
    color: colors.text_primary,
  },
  percentage: {
    fontSize: 14,
    fontFamily: typography.medium,
    color: colors.text_gray,
  },
  progressBackground: {
    height: 8,
    backgroundColor: colors.screen_background,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary_yellow,
  },
});

export default TryOnProgress;
