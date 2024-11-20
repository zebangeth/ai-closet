import { useCallback } from "react";
import { Pressable, StyleProp, ViewStyle, PressableProps } from "react-native";
import Animated, { useAnimatedStyle, withTiming, useSharedValue, WithTimingConfig } from "react-native-reanimated";

interface Props extends Omit<PressableProps, "style"> {
  activeOpacity?: number;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

const TIMING_CONFIG: WithTimingConfig = {
  duration: 260,
};

const PRESS_OUT_CONFIG: WithTimingConfig = {
  duration: 130, // Half duration for press out
};

const PressableFade = ({
  activeOpacity = 0.6,
  style,
  containerStyle,
  onPress,
  children,
  disabled,
  ...props
}: Props) => {
  // Use shared value for better performance
  const opacity = useSharedValue(1);

  // Create animated style using worklet
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  // Handlers as callbacks to prevent recreating on each render
  const handlePressIn = useCallback(() => {
    opacity.value = withTiming(activeOpacity, PRESS_OUT_CONFIG);
  }, [activeOpacity]);

  const handlePressOut = useCallback(() => {
    opacity.value = withTiming(1, TIMING_CONFIG);
  }, []);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={containerStyle}
      {...props}
    >
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    </Pressable>
  );
};

export default PressableFade;
