import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ClothingManagementScreen from "../screens/ClothingManagementScreen";
import ClothingDetailScreen from "../screens/ClothingDetailScreen";
import VirtualTryOnScreen from "../screens/VirtualTryOnScreen";
import { ClosetStackParamList } from "../types/navigation";
import { MaterialIcons, MaterialCommunityIcons, SimpleLineIcons, FontAwesome6 } from "@expo/vector-icons";
import { Platform, StyleSheet } from "react-native";
import { colors } from "../styles/colors";
import { typography } from "../styles/globalStyles";

const Tab = createBottomTabNavigator();
const ClosetStack = createNativeStackNavigator<ClosetStackParamList>();

const OutfitManagementScreen = () => <></>;
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
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: "#1C170D",
          tabBarInactiveTintColor: "#9C854A",
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarIconStyle: styles.tabBarIcon,
        }}
      >
        <Tab.Screen
          name="Closet"
          component={ClosetStackScreen}
          options={{
            tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="wardrobe" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="Outfits"
          component={OutfitManagementScreen}
          options={{
            tabBarIcon: ({ color, size }) => <MaterialIcons name="style" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="Try-On"
          component={VirtualTryOnScreen}
          options={{
            tabBarIcon: ({ color, size }) => <FontAwesome6 name="wand-magic-sparkles" size={20} color={color} />,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size }) => <MaterialIcons name="person" size={size} color={color} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === "ios" ? 90 : 60,
    paddingBottom: Platform.OS === "ios" ? 32 : 10,
    paddingTop: 10,
    backgroundColor: colors.screen_background,
    borderTopColor: colors.divider_light,
    borderTopWidth: 1,
    elevation: 0, // Remove shadow on Android
  },
  tabBarLabel: {
    fontFamily: typography.medium,
    fontSize: 12,
    marginTop: 4,
  },
  tabBarIcon: {
    marginTop: 4,
  },
});

export default AppNavigator;
