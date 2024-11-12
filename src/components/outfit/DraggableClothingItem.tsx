import React from "react";
import { StyleSheet, Image, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, runOnJS } from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";
import { ClothingItem } from "../../types/ClothingItem";
import { OutfitItem } from "../../types/Outfit";

type Props = {
  item: ClothingItem;
  transform: OutfitItem["transform"];
  canvasLayout: { width: number; height: number };
  onUpdate: (transform: OutfitItem["transform"]) => void;
  onDelete: () => void;
  isSelected: boolean;
  onSelect: () => void;
};

const CONTROL_BUTTON_SIZE = 24;
const MIN_SCALE = 0.2;
const MAX_SCALE = 3;
const ITEM_SIZE = 150; // Default item size

const DraggableClothingItem = ({ item, transform, canvasLayout, onUpdate, onDelete, isSelected, onSelect }: Props) => {
  // Shared values for animations
  const translateX = useSharedValue(transform.x);
  const translateY = useSharedValue(transform.y);
  const scale = useSharedValue(transform.scale);
  const rotate = useSharedValue(transform.rotation);

  // Context for storing initial values
  const savedValues = useSharedValue({
    scale: transform.scale,
    rotation: transform.rotation,
    translationX: transform.x,
    translationY: transform.y,
  });

  // Update parent component with new transform values
  const updateTransform = () => {
    onUpdate({
      x: translateX.value,
      y: translateY.value,
      scale: scale.value,
      rotation: rotate.value,
    });
  };

  // Drag gesture for moving the item
  const dragGesture = Gesture.Pan()
    .minPointers(1)
    .maxPointers(1) // Ensure only single finger drag
    .onStart(() => {
      savedValues.value = {
        ...savedValues.value,
        translationX: translateX.value,
        translationY: translateY.value,
      };
    })
    .onUpdate((e) => {
      translateX.value = savedValues.value.translationX + e.translationX;
      translateY.value = savedValues.value.translationY + e.translationY;
    })
    .onEnd(() => {
      runOnJS(updateTransform)();
    });

  // Simple tap for selection
  const tapGesture = Gesture.Tap().onStart(() => {
    runOnJS(onSelect)();
  });

  // Pinch gesture for scaling
  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      savedValues.value = {
        ...savedValues.value,
        scale: scale.value,
      };
    })
    .onUpdate((e) => {
      const newScale = savedValues.value.scale * e.scale;
      if (newScale >= MIN_SCALE && newScale <= MAX_SCALE) {
        scale.value = newScale;
      }
    })
    .onEnd(() => {
      runOnJS(updateTransform)();
    });

  // Rotation gesture
  const rotationGesture = Gesture.Rotation()
    .onStart(() => {
      savedValues.value = {
        ...savedValues.value,
        rotation: rotate.value,
      };
    })
    .onUpdate((e) => {
      rotate.value = savedValues.value.rotation + e.rotation;
    })
    .onEnd(() => {
      runOnJS(updateTransform)();
    });

  // Compose gestures:
  // 1. Combine pinch and rotation to work simultaneously
  const pinchAndRotate = Gesture.Simultaneous(pinchGesture, rotationGesture);

  // 2. Combine drag and tap as exclusive (only one can work at a time)
  const dragAndTap = Gesture.Exclusive(dragGesture, tapGesture);

  // 3. Make the combined gestures race with each other
  // This allows either single-finger or two-finger gestures to be recognized
  // depending on how many fingers are used
  const composed = Gesture.Race(pinchAndRotate, dragAndTap);

  // Combined animated style
  const rStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotate.value}rad` },
    ],
  }));

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[styles.container, rStyle]}>
        {/* Main Image Area */}
        <View style={[styles.imageContainer, isSelected && styles.selected]}>
          <Image
            source={{ uri: item.backgroundRemovedImageUri || item.imageUri }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Delete Button */}
        {isSelected && (
          <GestureDetector gesture={Gesture.Tap().onStart(() => runOnJS(onDelete)())}>
            <View style={[styles.controlButton, styles.deleteButton]}>
              <MaterialIcons name="close" size={20} color="white" />
            </View>
          </GestureDetector>
        )}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: ITEM_SIZE,
    height: ITEM_SIZE,
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    overflow: "hidden",
  },
  selected: {
    borderWidth: 2,
    borderColor: colors.primary_yellow,
    borderStyle: "dashed",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  controlButton: {
    position: "absolute",
    width: CONTROL_BUTTON_SIZE,
    height: CONTROL_BUTTON_SIZE,
    borderRadius: CONTROL_BUTTON_SIZE / 2,
    backgroundColor: colors.primary_yellow,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  deleteButton: {
    top: -CONTROL_BUTTON_SIZE / 2,
    right: -CONTROL_BUTTON_SIZE / 2,
    backgroundColor: "#FF4444",
  },
});

export default DraggableClothingItem;
