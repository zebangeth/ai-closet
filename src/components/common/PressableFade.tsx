import { useRef } from "react";
import { Pressable, Animated, StyleProp, ViewStyle, PressableProps } from "react-native";

interface Props extends Omit<PressableProps, "style"> {
  activeOpacity?: number;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

const PressableFade = ({
  activeOpacity = 0.6,
  style,
  containerStyle,
  onPress,
  children,
  disabled,
  ...props
}: Props) => {
  const DURATION = 260;
  const opacityAnimation = useRef(new Animated.Value(1)).current;

  const fadeIn = () => {
    Animated.timing(opacityAnimation, {
      toValue: 1,
      duration: DURATION,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(opacityAnimation, {
      toValue: activeOpacity,
      duration: DURATION / 2,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={fadeOut}
      onPressOut={fadeIn}
      disabled={disabled}
      style={containerStyle}
      {...props}
    >
      <Animated.View style={[style, { opacity: opacityAnimation }]}>{children}</Animated.View>
    </Pressable>
  );
};

export default PressableFade;
