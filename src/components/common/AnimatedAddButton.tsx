import React, { useState } from "react";
import { StyleSheet, Animated, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";

type IconName = React.ComponentProps<typeof MaterialIcons>["name"];

const BUTTON_SIZE = 60;
const BUTTON_MARGIN = 16;
const TOTAL_BUTTON_HEIGHT = BUTTON_SIZE + BUTTON_MARGIN;

const AnimatedAddButton = ({
  onChoosePhoto,
  onTakePhoto,
}: {
  onChoosePhoto: () => void;
  onTakePhoto: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    setIsOpen(!isOpen);
    Animated.timing(animation, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const rotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "135deg"],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const mainButtonColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.primary_yellow, colors.light_yellow],
  });

  const renderOptionButton = (
    icon: IconName,
    label: string,
    onPress: () => void,
    translateY: Animated.AnimatedInterpolation<number>
  ) => (
    <Animated.View
      style={[
        styles.optionButton,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Animated.Text style={[styles.buttonLabel, { opacity }]}>
        {label}
      </Animated.Text>
      <Pressable
        style={[
          styles.circleButton,
          { backgroundColor: colors.primary_yellow },
        ]}
        onPress={() => {
          onPress();
          toggleMenu();
        }}
      >
        <MaterialIcons name={icon} size={24} color={colors.icon_stroke} />
      </Pressable>
    </Animated.View>
  );

  return (
    <>
      {isOpen && (
        <Pressable
          style={styles.dimmedBackground}
          onPress={toggleMenu}
          android_ripple={{ color: "rgba(0,0,0,0.2)" }}
        />
      )}

      {renderOptionButton(
        "photo-library",
        "Add from Photos",
        onChoosePhoto,
        animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -TOTAL_BUTTON_HEIGHT * 2],
        })
      )}

      {renderOptionButton(
        "camera-alt",
        "Add by Camera",
        onTakePhoto,
        animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -TOTAL_BUTTON_HEIGHT],
        })
      )}

      <Animated.View
        style={[
          styles.addButton,
          {
            backgroundColor: mainButtonColor,
            transform: [{ rotate: rotation }],
          },
        ]}
      >
        <Pressable onPress={toggleMenu} style={styles.mainButtonTouchable}>
          <MaterialIcons name="add" size={26} color={colors.icon_stroke} />
        </Pressable>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    borderRadius: BUTTON_SIZE / 2,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  mainButtonTouchable: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  optionButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  circleButton: {
    borderRadius: BUTTON_SIZE / 2,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonLabel: {
    marginRight: 10,
    color: colors.text_primary,
    fontSize: 16,
  },
  dimmedBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background_dim,
  },
});

export default AnimatedAddButton;
