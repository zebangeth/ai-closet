import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClothingManagementScreen from '../screens/ClothingManagementScreen';
import ClothingDetailScreen from '../screens/ClothingDetailScreen';
import { ClosetStackParamList } from '../types/navigation';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const ClosetStack = createNativeStackNavigator<ClosetStackParamList>();

const OutfitManagementScreen = () => <></>;
const VirtualTryOnScreen = () => <></>;
const ProfileScreen = () => <></>;

// Define the Stack Navigator for the Closet tab
const ClosetStackScreen = () => (
  <ClosetStack.Navigator screenOptions={{ headerShown: false }}>
    <ClosetStack.Screen name="ClothingManagement" component={ClothingManagementScreen} />
    <ClosetStack.Screen name="ClothingDetail" component={ClothingDetailScreen} />
  </ClosetStack.Navigator>
);

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Closet"
          component={ClosetStackScreen}
          options={{tabBarIcon: ({color, size}) => (
          <MaterialCommunityIcons name="hanger" size={size} color={color} />)}}
        />
        <Tab.Screen
          name="Outfits"
          component={OutfitManagementScreen}
          options={{tabBarIcon: ({color, size}) => (
          <MaterialIcons name="style" size={size} color={color} />)}}
        />
        <Tab.Screen name="Try-On" component={VirtualTryOnScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
