import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';

const AnimatedAddButton: React.FC<{
  onChoosePhoto: () => void;
  onTakePhoto: () => void;
}> = ({ onChoosePhoto, onTakePhoto }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleMenu = () => {
    if (isOpen) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setIsOpen(false));
    } else {
      setIsOpen(true);
      Animated.timing(animation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const rotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const screen = Dimensions.get('window');

  return (
    <>
      {/* Dimming Background */}
      {isOpen && (
        <TouchableOpacity
          style={styles.dimmedBackground}
          onPress={toggleMenu}
        />
      )}

      {/* Additional Buttons */}
      <Animated.View
        style={[
          styles.optionButton,
          {
            opacity,
            transform: [{ translateY: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -120],
            }) }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.circleButton}
          onPress={onChoosePhoto}
        >
          <MaterialIcons name="photo-library" size={24} color={colors.icon_stroke} />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        style={[
          styles.optionButton,
          {
            opacity,
            transform: [{ translateY: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -60],
            }) }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.circleButton}
          onPress={onTakePhoto}
        >
          <MaterialIcons name="camera-alt" size={24} color={colors.icon_stroke} />
        </TouchableOpacity>
      </Animated.View>

      {/* Main Add/Cancel Button */}
      <Animated.View style={[styles.addButton, { transform: [{ rotate: rotation }] }]}>
        <TouchableOpacity onPress={toggleMenu}>
          <MaterialIcons name="add" size={24} color={colors.icon_stroke} />
        </TouchableOpacity>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: colors.primary_yellow,
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  circleButton: {
    backgroundColor: colors.primary_yellow,
    borderRadius: 30,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dimmedBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    opacity: 0.5,
  },
});

export default AnimatedAddButton;
