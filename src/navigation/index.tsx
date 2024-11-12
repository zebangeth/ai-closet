import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Platform, StyleSheet } from "react-native";
import { MaterialIcons, MaterialCommunityIcons, FontAwesome6 } from "@expo/vector-icons";

// Screens
import ClothingManagementScreen from "../screens/ClothingManagementScreen";
import ClothingDetailScreen from "../screens/ClothingDetailScreen";
import OutfitManagementScreen from "../screens/OutfitManagementScreen";
import OutfitCanvasScreen from "../screens/OutfitCanvasScreen";
import OutfitDetailScreen from "../screens/OutfitDetailScreen";
import VirtualTryOnScreen from "../screens/VirtualTryOnScreen";
import { RootTabParamList, ClosetStackParamList, OutfitStackParamList } from "../types/navigation";
import { colors } from "../styles/colors";
import { typography } from "../styles/globalStyles";

const Tab = createBottomTabNavigator<RootTabParamList>();
const ClosetStack = createNativeStackNavigator<ClosetStackParamList>();
const OutfitStack = createNativeStackNavigator<OutfitStackParamList>();

const ProfileScreen = () => <></>;

// Stack Navigators
const ClosetStackNavigator = () => (
  <ClosetStack.Navigator screenOptions={{ headerShown: false }}>
    <ClosetStack.Screen name="ClothingManagement" component={ClothingManagementScreen} />
    <ClosetStack.Screen name="ClothingDetail" component={ClothingDetailScreen} />
  </ClosetStack.Navigator>
);

const OutfitStackNavigator = () => (
  <OutfitStack.Navigator screenOptions={{ headerShown: false }}>
    <OutfitStack.Screen name="OutfitManagement" component={OutfitManagementScreen} />
    <OutfitStack.Screen name="OutfitCanvas" component={OutfitCanvasScreen} />
    <OutfitStack.Screen name="OutfitDetail" component={OutfitDetailScreen} />
  </OutfitStack.Navigator>
);

// Main Navigation Container
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: colors.text_primary,
          tabBarInactiveTintColor: colors.text_gray,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarIconStyle: styles.tabBarIcon,
        }}
      >
        <Tab.Screen
          name="Closet"
          component={ClosetStackNavigator}
          options={{
            tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="wardrobe" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="Outfits"
          component={OutfitStackNavigator}
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
    elevation: 0,
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
