I am a software engineer working on the AI Closet app project (the project design doc is pasted below in the `<design-doc>` tag). Now, part of the app has been implemented and the current repo structure and content are pasted below in the `<current-repo>` tag (some parts are omitted for brevity). 

<design-doc>

# AI Closet App Design Doc

## 1. Introduction

This design document outlines the implementation plan for the AI Closet Mobile App, a React Native application built with Expo to support both iOS and Android devices. The app aims to help users manage their clothes, create stylish outfits, and virtually try on clothes using AI-powered features like automatic clothing categorization, background removal, and virtual try-on capabilities.

Target Users:

- Fashion-conscious individuals and style enthusiasts interested in creating and sharing outfit ideas.
- Online shoppers who want to visualize clothing items before purchasing.

## 2. Features

1. Clothing Management:

   - Add, view, and categorize clothing items with AI assistance
   - Automatic background removal and clothing categorization
   - Custom tagging, attributes management and organization options

2. Outfit Management:

   - Create, save, and manage outfits using clothing items
   - Outfit collage creation, which provides user an empty canvas and user can drag-and-move different clothing items on the canvas to create outfits
   - Tagging and categorization of outfits

3. Virtual Try-On:
   - Allow users to virtually try on clothes using their photos
   - User can choose to try-on: individual items from the closet, or upload items from the user’s photo albums

## 3. High-Level Architecture

The application follows a modular architecture, separating concerns into distinct layers:

- UI Layer: Handles the presentation and user interaction, built with React Native components.
- State Management Layer: Manages global state using React Context API.
- Data Layer: Handles data storage and retrieval using AsyncStorage and expo-file-system for local data.
- Service Layer: Manages interactions with third-party APIs for AI functionalities.
- Navigation Layer: Manages screen transitions using React Navigation.

Component Interaction Flow:

- User Interaction: User interacts with UI components (e.g., adds a clothing item).
- State Update: UI components dispatch actions to update the global state via Context API.
- Data Persistence: Changes in state trigger updates to local storage.
- API Services: When AI features are needed, service calls are made to third-party APIs.
- UI Update: Responses from APIs update the state, which in turn updates the UI.

## 4. Implementation Details

### 4.1 UI/UX Design

Overall Layout:

- Tabs at the bottom of the screen for Clothing Management, Outfit Management, and Virtual Try-On

1. Clothing Management Screens:

   1.1 All Clothing Items Screen:

   Layout:

   - Top bar with "My Closet" title and a filter icon
   - Horizontal scrolling clothing item category tabs: All, Tops, Bottoms, Dresses, Outerwear
   - Tag section below categories, showing custom tags for quick filtering (e.g., Summer Favorites, Workwear)
   - Main content area with a grid layout of clothing item thumbnails (1:1 aspect ratio), 3 items per row
   - Bottom navigation bar with icons for Closet, Outfits, Try-On, and Profile

   Components:

   - Filter button in the top bar for sorting/filtering options
   - Category tabs for quick filtering
   - Tag chips for quick additional custom filtering
   - Clothing item thumbnails, showing the item on a neutral background
   - Add floating action button (yellow circle with "+" sign) in the bottom right corner
   - Navigation bar at the bottom

   Interactions:

   - Tapping category tabs filters the displayed items
   - Tapping tag chips applies additional filters
   - Tapping a clothing item thumbnail opens the item details screen
   - Tapping the add floating action button initiates the process of adding a new item:
     - The background dims, and 3 button options appear:
       - "Choose from Photos" button with gallery icon - tapping opens the device's photo gallery
       - "Camera" button with camera icon - tapping activates the device's camera for taking a new photo
       - "Cancel" button with an "x" icon - tapping dismisses the add item process
       - Post-tap actions:
         - If the user selects an image from the gallery or takes a photo, the background removal and AI categorization process starts, and the user is directed to the Clothing Item Detail Screen to review and edit the item attributes.
         - If the user cancels, the background returns to normal.
     - Animation: When the user taps the Add Button, the following happens simultaneously:
       - the background (clothing grid) becomes slightly dimmed to focus attention on the action options.
       - two additional buttons (for “Choose from Photos” and “Camera”) emerge from the original Add Button
       - the original Add Button transforms into a Cancel Button by rotating 45 degrees clockwise
   - Tapping navigation icons switches between main app sections
   
   1.2 Clothing Item Detail Screen:

   Layout:

   - Top bar with back arrow and delete icon
   - Large image of the clothing item (background removed)
   - Custom tags section below the image (e.g., Summer Favorites, Workwear)
   - "Relevant Outfits" section with horizontal scrolling thumbnails of outfits including the item
   - "Item Details" section with various attributes

   Components:

   - Back arrow for navigation
   - Delete icon (trash can) for removing the item
   - Main image (1:1 aspect ratio) of the clothing item with background removed
   - Tag chips (e.g., Summer Favorites, Workwear) with an add chip option
   - Horizontal scrolling outfit thumbnails (3:4 aspect ratio) showing the outfits that include the item
   - Attribute fields (Category(e.g., Tops/T-shirts), Color, Season, Occasion, Brand, Purchase Date, Price)
     - Each field is editable: tapping on it opens a dropdown or text input
   - Save button at the bottom (disabled until changes are made)

   Interactions:

   - Tapping the back arrow returns to the previous screen
   - Tapping the delete icon prompts a confirmation dialog for item removal
   - Tapping the add button next to tag chips allows adding new custom tags
   - Tapping outfit thumbnails opens the outfit details screen
   - Tapping attribute fields expands them for editing
   - Tapping the Save button commits changes

2. Outfit Management Screens:

   2.1 All Outfits Screen:

   Layout:

   - Top bar with "My Outfits" title and a filter icon
   - Tag section below the title, showing custom tags for quick filtering (outfit tags, not clothing item tags, e.g., Summer Looks, Date Night)
   - Main content area with a grid layout of outfit thumbnails (3:4 aspect ratio), 2 items per row
   - Bottom navigation bar with icons for Closet, Outfits, Try-On, and Profile

   Components:

   - Filter button in the top bar for sorting/filtering options
   - Tag chips for quick custom filtering
   - Outfit thumbnails showing the outfit collage
   - Add floating action button (yellow circle with "+" sign) in the bottom right corner
   - Navigation bar at the bottom

   Interactions:

   - Tapping tag chips applies quick filters based on tags
   - Tapping an outfit thumbnail opens the outfit details screen
   - Tapping the add floating action button opens the outfit canvas screen to create a new outfit
   - Tapping navigation icons switches between main app sections

   2.2 Outfit Canvas Screen:

   Layout:

   - Top bar with back arrow, "Outfit Canvas" title, and a save icon
   - Main canvas area displaying clothing items
   - Two yellow buttons at the bottom: "Add Items" and "Save Outfit"

   Components:

   - Back arrow for navigation to the previous screen
   - Canvas area where clothing items are displayed and can be arranged
   - Clothing items with manipulation controls (resize, rotate, delete)
   - "Add Items" button to open the clothing item selection screen to include more clothing pieces
   - "Save Outfit" button to finalize and save the current outfit

   Interactions:

   - Tapping the back arrow returns to the previous screen
   - Drag-and-drop, pinch-to-zoom, and rotate gestures for manipulating clothing items on the canvas
   - Using manipulation controls to adjust item size and orientation
   - Tapping "Add Items" pops up the "Outfit Canvas / Add Clothing Item" screen
   - Tapping "Save Outfit" saves the created outfit and likely opens the outfit detail screen

   2.3 Outfit Canvas / Add Clothing Item Component:

   Layout:

   - Overlay on top of the Outfit Canvas screen
   - A close button (X icon) on the top right corner of the overlay
   - The overlay component is similar to the "All Clothing Items" screen:
     - Top bar with "Choose Closet Items to Add"" Subtitle and a filter icon
     - Horizontal scrolling category tabs: All, Tops, Bottoms, Dresses, Outerwear
     - Tag section below categories, showing custom tags for quick filtering (e.g., Summer Favorites, Workwear)
     - Main content area with a grid layout of clothing item thumbnails (1:1 aspect ratio), 3 items per row

   Components:

   - Close button (X icon) to dismiss the overlay
   - Filter button in the top bar for sorting/filtering options
   - Category tabs for quick filtering
   - Tag chips for additional custom filtering
   - Clothing item thumbnails for selection

   Interactions:

   - Tapping the close button dismisses the overlay and returns to the Outfit Canvas
   - Tapping filter button opens sorting/filtering options
   - Tapping category tabs filters the displayed items
   - Tapping tag chips applies additional filters
   - Tapping a clothing item thumbnail adds it to the outfit canvas

   2.4 Add Outfit & Outfit Details Screen:

   Layout:

   - Top bar with back arrow and delete icon
   - Main image of the complete outfit
   - Custom tags section below the image
   - "Included Items" section with horizontal scrolling thumbnails of individual clothing items (1:1 aspect ratio) in the outfit
   - "Outfit Details" section with 2 attributes (Season, Occasion)

   Components:

   - Back arrow for navigation
   - Delete icon (trash can) for removing the outfit
   - Main image of the complete outfit (1:1 aspect ratio)
   - Tag chips (outfit tags, not clothing item tags) with an add chip option
   - Thumbnails of individual clothing items in the outfit
   - Attribute fields (Season, Occasion)
   - Save button at the bottom (disabled until changes are made)

   Interactions:

   - Tapping the back arrow returns to the previous screen (All Outfits, Outfit Canvas, Clothing Item Details)
   - Tapping the delete icon prompts a confirmation dialog for outfit removal
   - Tapping the add button next to tags allows adding new tag chips
   - Tapping individual item thumbnails could open the item details
   - Tapping attribute fields allows for editing
   - Tapping the Save button commits changes

3. Virtual Try-On Screens:

   3.1 Virtual Try-On Screen:

   Layout:

   - Top bar with "Virtual Try-On" title
   - Main View:
     - Instructional text below the title - "Select an outfit and upload your photo to see how it looks on you"
     - An expandable "Show Photo Tips" option with an information icon
     - Two main content areas side by side: "Choose Outfit" and "Add Your Picture"
     - "Try It On!" button (yellow) below the main content areas
     - "Recently Tried" section at the bottom with a grid of recent try-on results 2 items per row
     - Main View area is vertically scrollable
   - Bottom navigation bar with icons for Closet, Outfits, Try-On, and Profile

   Components:

   - Instructional text for guidance
   - Expandable information icon for photo tips
   - Selected outfit preview area (left side)
   - Selected user photo area (right side)
   - "Choose Outfit" and "Add Your Picture" buttons within their respective areas
   - "Try It On!" action button (disabled until both outfit and photo are selected)
   - Thumbnails of recently tried outfits/items
   - Navigation bar at the bottom

   Interactions:

   - Tapping the "Show Photo Tips" expands the section to show photo tips
   - Tapping "Choose Outfit" pops up the "Choose What to Try-On" bottom sheet
   - Tapping "Add Your Picture" opens the device's photo gallery for image selection
   - When both outfit and photo are selected, the "Try It On!" button becomes enabled
   - Tapping "Try It On!" initiates the virtual try-on process:
     - The "Try It On!" button changes to a "Try-on Rendering Progress" bar, everything else stays the same
     - The "Try-on Rendering Progress" component consists of a text label, a progress bar, and a percentage indicator:
       - The text "Try-on Rendering Progress" is displayed prominently at the top.
       - Below the text is a horizontal progress bar.
       - The percentage completion (xx%) is shown in the top-right corner.
     - Once the rendering is complete, the "Try-on Rendering Progress" bar disappears, and the try-on result image is displayed in the main view between the two main content areas for outfit and photo selection and the "Recently Tried" section (the original place of "Try It On!" button):
       - The try-on result image is displayed in a 3:4 aspect ratio.
       - Re-generate button is displayed below the try-on result image. If the user taps this button, the try-on process is reinitiated.
       - The thumbnail of the generated try-on image is added to the "Recently Tried" section.
       - If the user taps the choose outfit or add your picture buttons, the screen returns to the original state.
   - Tapping a recently tried thumbnail displays the full try-on image
   - Tapping navigation icons switches between main app sections

   3.2 Virtual Try-On / Choose What to Try-On Bottom Sheet:

   Layout:

   - Bottom sheet overlay on top of the Virtual Try-On screen
   - A close button (X icon) on the top right corner of the overlay
   - "Choose what to try on" title with instructions
   - Three options presented vertically: Single Closet Item, Discover & Try, Complete Outfits (Coming Soon)

   Components:

   - Close button (X icon) to dismiss the overlay
   - Icon and text for each try-on option (Single Closet Item, Discover & Try, Complete Outfits)
   - Brief description under each option (e.g., "Try a single item from your closet", "Try on new items from your photo albums or product images from online stores", "Try on your saved outfit with multiple pieces")

   Interactions:

   - Tapping the close button dismisses the overlay and returns to the Virtual Try-On screen
   - Selecting "Single Closet Item" opens the Add Clothing Item Component overlay (similar to the Outfit Canvas / Add Clothing Item screen)
   - Selecting "Discover & Try" opens the device's photo gallery for image selection
   - "Complete Outfits" is marked as "Coming Soon" and is not interactive yet

   3.3 Virtual Try-On / Choose What to Try-On / Choose Closet Item Screen:

   - This is the same component as the "Outfit Canvas / Add Clothing Item" screen but with a different title and purpose
   - The layout and components are the same as the "Outfit Canvas / Add Clothing Item" screen
   - The title is "Choose Closet Items to Try On" instead of "Choose Closet Items to Add"

### 4.2 Data Management

- AsyncStorage: Used for storing structured data like JSON representations of ClothingItems, Outfits, and TryOnSessions.
- expo-file-system: Used for storing image files locally on the device.

Data Persistence Strategy:

- When a new item is added or updated, the corresponding data model is serialized to JSON and stored in AsyncStorage.
- Image files are stored using expo-file-system, and their URIs are referenced in the data models.
- Data retrieval is handled asynchronously, loading from AsyncStorage and file system upon app launch or when needed.

#### 4.2.1 Data Models

1. Clothing Item Model:

   - id: string (uuid)
   - imageUri: string
   - backgroundRemovedImageUri: string
   - createdAt: string
   - updatedAt: string
   - category: string (Tops, Bottoms, Dresses, Outerwear)
   - subcategory: string (e.g., T-shirts, Jeans, Skirts, Jackets)
   - tags: string[] (custom tags, e.g., Summer Favorites, Workwear)
   - color: string[]
   - season: string[] (Spring/Fall, Summer, Winter)
   - occasion: string[] (Casual, Work, Formal, Party, Sports)
   - brand: string
   - purchaseDate: string (formatted date)
   - price: number

2. Outfit Model:

   - id: string (uuid)
   - imageUri: string
   - createdAt: string
   - updatedAt: string
   - clothingItems: string[] (references to included clothing item ids)
   - tags: string[] (custom tags, e.g., Summer Looks, Date Night)
   - season: string[] (Spring, Summer, Fall, Winter)
   - occasion: string[] (Casual, Work, Formal, Party)

3. Virtual Try-On Model:
   - id: string (uuid)
   - createdAt: string
   - updatedAt: string
   - tryOnType: string (Single Closet Item, Discover & Try, Complete Outfits)
   - clothingItemId: string (reference to the selected clothing item id)
   - outfitId: string (reference to the selected outfit id)
   - newClothingImageUri: string (user-uploaded photo for try-on, for Discover & Try option)
   - userPhotoUri: string
   - resultImageUri: string

#### 4.2.2 State Management

- Use React Context and hooks (if applicable) for global state management to avoid prop drilling and provide state access across the app.

- Contexts:

  - ClothingContext: Manages clothing items.
  - OutfitContext: Manages outfits.
  - TryOnContext: Manages try-on sessions.

- Actions:
  - Add, Update, Delete operations for each data model.
  - Load Initial Data: Fetch data from AsyncStorage on app startup.

</design-doc>

<current-repo>

src Directory Structure:
src/
├── types/
│   ├── navigation.ts
│   ├── ClothingItem.ts
├── contexts/
│   ├── ClothingContext.tsx
├── navigation/
│   ├── index.tsx
├── utils/
│   ├── AsyncStorage.ts
│   ├── ImageUtils.ts
├── screens/
│   ├── ClothingManagementScreen.tsx
│   ├── OutfitManagementScreen.tsx
│   ├── VirtualTryOnScreen.tsx
│   ├── ClothingDetailScreen.tsx
├── styles/
│   ├── colors.ts
│   ├── globalStyles.ts
├── components/
│   ├── outfit/
│   ├── clothing/
│   │   ├── ClothingItemThumbnail.tsx
│   ├── virtualTryOn/
│   ├── common/
│   │   ├── AnimatedAddButton.tsx
│   │   ├── YearMonthPicker.tsx
│   │   ├── CategoryPicker.tsx
│   │   ├── MultiSelectToggle.tsx
│   │   ├── Header.tsx
│   │   ├── AddButton.tsx
│   │   ├── TagChips.tsx
│   │   ├── FilterButton.tsx
├── data/
│   ├── categories.ts
│   ├── suggestions.ts
│   ├── options.ts
├── services/
│   ├── BackgroundRemoval.ts
│   ├── ClothingCategorization.ts

types/navigation.ts:
```
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type ClosetStackParamList = {
  ClothingManagement: undefined;
  ClothingDetail: { id: string };
};

export type ClothingDetailScreenProps = NativeStackScreenProps<ClosetStackParamList, 'ClothingDetail'>;
export type ClothingManagementScreenProps = NativeStackScreenProps<ClosetStackParamList, 'ClothingManagement'>;

```

types/ClothingItem.ts:
```
export interface ClothingItem {
  id: string;
  imageUri: string;
  backgroundRemovedImageUri: string;
  createdAt: string;
  updatedAt: string;
  category: string;
  subcategory: string;
  tags: string[]; // custom tags, e.g. 'summer favorite', 'work outfit'
  color: string[];
  season: string[];
  occasion: string[];
  brand: string;
  purchaseDate: string;
  price: number;
}

```

contexts/ClothingContext.tsx:
```
import React, { createContext, useState, useEffect, ReactNode, useMemo, useCallback } from "react";
import { ClothingItem } from "../types/ClothingItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { categories } from "../data/categories";

type CategoryCounts = {
  All: number;
  [key: string]: number;
};

type TagData = {
  tag: string;
  count: number;
}[];

type ClothingFilters = {
  category?: string;
  tags?: string[];
};

type ClothingContextType = {
  // Data
  clothingItems: ClothingItem[];
  categoryData: CategoryCounts;
  tagData: TagData;

  // Filtering
  activeFilters: ClothingFilters;
  filteredItems: ClothingItem[];
  setFilter: (type: keyof ClothingFilters, value: any) => void;
  clearFilters: () => void;

  // CRUD operations
  getClothingItem: (id: string) => ClothingItem | undefined;
  addClothingItem: (item: ClothingItem) => void;
  updateClothingItem: (item: ClothingItem) => void;
  deleteClothingItem: (id: string) => void;
};

export const ClothingContext = createContext<ClothingContextType | null>(null);

export const ClothingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [activeFilters, setActiveFilters] = useState<ClothingFilters>({
    category: "All",
    tags: [],
  });

  // Load clothing items from AsyncStorage on mount
  useEffect(() => {
    const loadClothingItems = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("@clothing_items");
        if (jsonValue != null) {
          setClothingItems(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.error("Error loading clothing items:", e);
      }
    };
    loadClothingItems();
  }, []);

  // Save clothing items to AsyncStorage whenever they change
  useEffect(() => {
    const saveClothingItems = async () => {
      try {
        await AsyncStorage.setItem("@clothing_items", JSON.stringify(clothingItems));
      } catch (e) {
        console.error("Error saving clothing items:", e);
      }
    };
    saveClothingItems();
  }, [clothingItems]);

  // Memoized category counts
  const categoryData = useMemo(() => {
    let counts: CategoryCounts = { All: clothingItems.length };

    // Use reduce for better performance than forEach
    counts = Object.keys(categories).reduce((acc, category) => {
      acc[category] = clothingItems.reduce((count, item) => (item.category === category ? count + 1 : count), 0);
      return acc;
    }, counts);

    return counts;
  }, [clothingItems]);

  // Memoized tag frequency data
  const tagData = useMemo(() => {
    // Use reduce to build tag counts in a single pass
    const tagCounts = clothingItems.reduce((acc, item) => {
      item.tags.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    // Convert to array and sort by frequency
    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }, [clothingItems]);

  // Memoized filtered items with optimized filtering
  const filteredItems = useMemo(() => {
    // Early return if no filters are active
    if (activeFilters.category === "All" && (!activeFilters.tags || activeFilters.tags.length === 0)) {
      return clothingItems;
    }

    // Create a Set of tag filters for O(1) lookup
    const tagFilters = new Set(activeFilters.tags);

    return clothingItems.filter((item) => {
      // Category filter
      if (activeFilters.category !== "All" && item.category !== activeFilters.category) {
        return false;
      }

      // Tag filter - only check if we have active tag filters
      if (tagFilters.size > 0) {
        return Array.from(tagFilters).every((tag) => item.tags.includes(tag));
      }

      return true;
    });
  }, [clothingItems, activeFilters]);

  // Filter management
  const setFilter = useCallback((type: keyof ClothingFilters, value: any) => {
    setActiveFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setActiveFilters({
      category: "All",
      tags: [],
    });
  }, []);

  // CRUD operations
  const getClothingItem = useCallback(
    (id: string) => {
      return clothingItems.find((item) => item.id === id);
    },
    [clothingItems]
  );

  const addClothingItem = useCallback((item: ClothingItem) => {
    setClothingItems((prev) => [...prev, item]);
  }, []);

  const updateClothingItem = useCallback((updatedItem: ClothingItem) => {
    setClothingItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? { ...updatedItem, updatedAt: new Date().toISOString() } : item))
    );
  }, []);

  const deleteClothingItem = useCallback((id: string) => {
    setClothingItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const contextValue = {
    // Data
    clothingItems,
    categoryData,
    tagData,

    // Filtering
    activeFilters,
    filteredItems,
    setFilter,
    clearFilters,

    // CRUD operations
    getClothingItem,
    addClothingItem,
    updateClothingItem,
    deleteClothingItem,
  };

  return <ClothingContext.Provider value={contextValue}>{children}</ClothingContext.Provider>;
};

```

navigation/index.tsx:
```
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ClothingManagementScreen from "../screens/ClothingManagementScreen";
import ClothingDetailScreen from "../screens/ClothingDetailScreen";
import { ClosetStackParamList } from "../types/navigation";
import { MaterialIcons, MaterialCommunityIcons, SimpleLineIcons, FontAwesome6 } from "@expo/vector-icons";
import { Platform, StyleSheet } from "react-native";
import { colors } from "../styles/colors";
import { typography } from "../styles/globalStyles";

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

```

utils/AsyncStorage.ts:
```

```

utils/ImageUtils.ts:
```

```

screens/ClothingManagementScreen.tsx:
```
import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, FlatList, ScrollView, Pressable, Alert, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { v4 as uuidv4 } from "uuid";
import { ClothingContext } from "../contexts/ClothingContext";
import { ClothingItem } from "../types/ClothingItem";
import { ClosetStackParamList } from "../types/navigation";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import ClothingItemThumbnail from "../components/clothing/ClothingItemThumbnail";
import AnimatedAddButton from "../components/common/AnimatedAddButton";
import { categories } from "../data/categories";
import { colors } from "../styles/colors";
import { typography } from "../styles/globalStyles";
import { removeBackground } from "../services/BackgroundRemoval";
import { categorizeClothing } from "../services/ClothingCategorization";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = NativeStackScreenProps<ClosetStackParamList, "ClothingManagement">;

interface CategoryTabProps {
  name: string;
  isSelected: boolean;
  onPress: () => void;
  count: number;
}

interface TagChipProps {
  name: string;
  isSelected: boolean;
  onPress: () => void;
  count: number;
}

// Subcomponents
const CategoryTab = ({ name, isSelected, onPress, count }: CategoryTabProps) => (
  <Pressable style={[styles.categoryTab, isSelected && styles.categoryTabSelected]} onPress={onPress}>
    <Text style={[styles.categoryTabText, isSelected && styles.categoryTabTextSelected]}>{name}</Text>
    <Text style={[styles.categoryCount, isSelected && styles.categoryCountSelected]}>{count}</Text>
  </Pressable>
);

const TagChip = ({ name, isSelected, onPress, count }: TagChipProps) => (
  <Pressable style={[styles.tagChip, isSelected && styles.tagChipSelected]} onPress={onPress}>
    <Text style={[styles.tagChipText, isSelected && styles.tagChipTextSelected]}>
      {name} ({count})
    </Text>
  </Pressable>
);

// Main Component
const ClothingManagementScreen = ({ navigation }: Props) => {
  const context = useContext(ClothingContext);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!context) {
    return <Text>Loading...</Text>;
  }

  const { categoryData, tagData, filteredItems, activeFilters, setFilter, addClothingItem } = context;

  const handleChoosePhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      processImage(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "Permission to access camera is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();
    if (!result.canceled) {
      processImage(result.assets[0].uri);
    }
  };

  const processImage = async (uri: string) => {
    try {
      setIsProcessing(true);

      // Step 1: Run background removal and categorization
      const [bgRemovedUri, aiData] = await Promise.all([removeBackground(uri), categorizeClothing(uri)]);

      // Step 2: Create a new ClothingItem
      const newItem: ClothingItem = {
        id: uuidv4(),
        imageUri: uri,
        backgroundRemovedImageUri: bgRemovedUri,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: [],
        category: aiData.category || "",
        subcategory: aiData.subcategory || "",
        color: aiData.color || [],
        season: aiData.season || [],
        occasion: aiData.occasion || [],
        brand: "",
        purchaseDate: "",
        price: 0,
      };

      // Step 3: Add the new clothing item to context
      addClothingItem(newItem);

      // Step 4: Navigate to the detail screen
      navigation.navigate("ClothingDetail", { id: newItem.id });
    } catch (error) {
      console.error("Error processing image:", error);
      Alert.alert("Error", "An error occurred while processing the image.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Closet</Text>
        <Pressable style={styles.filterButton}>
          <MaterialIcons name="filter-list" size={24} color={colors.icon_stroke} />
        </Pressable>
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryTabsContainer}
        contentContainerStyle={styles.categoryTabsContent}
      >
        <CategoryTab
          name="All"
          isSelected={activeFilters.category === "All"}
          onPress={() => setFilter("category", "All")}
          count={categoryData.All}
        />
        {Object.keys(categories).map((category) => (
          <CategoryTab
            key={category}
            name={category}
            isSelected={activeFilters.category === category}
            onPress={() => setFilter("category", category)}
            count={categoryData[category]}
          />
        ))}
      </ScrollView>

      {/* Tags Section */}
      {tagData.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tagsContainer}
          contentContainerStyle={styles.tagsContent}
        >
          {tagData.map(({ tag, count }) => (
            <TagChip
              key={tag}
              name={tag}
              isSelected={(activeFilters.tags || []).includes(tag)}
              onPress={() => {
                const currentTags = activeFilters.tags || [];
                const newTags = currentTags.includes(tag)
                  ? currentTags.filter((t) => t !== tag)
                  : [...currentTags, tag];
                setFilter("tags", newTags);
              }}
              count={count}
            />
          ))}
        </ScrollView>
      )}

      {/* Clothing Grid */}
      <FlatList
        data={filteredItems}
        renderItem={({ item }) => (
          <ClothingItemThumbnail item={item} onPress={() => navigation.navigate("ClothingDetail", { id: item.id })} />
        )}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.gridContent}
      />

      {/* Add Button */}
      <AnimatedAddButton onChoosePhoto={handleChoosePhoto} onTakePhoto={handleTakePhoto} />

      {/* Loading Overlay */}
      {isProcessing && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary_yellow} />
          <Text style={styles.loadingText}>Processing image...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screen_background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: typography.bold,
    color: colors.text_primary,
  },
  filterButton: {
    padding: 8,
  },
  categoryTabsContainer: {
    maxHeight: 48,
  },
  categoryTabsContent: {
    paddingHorizontal: 16,
  },
  categoryTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: colors.thumbnail_background,
  },
  categoryTabSelected: {
    backgroundColor: colors.primary_yellow,
  },
  categoryTabText: {
    fontFamily: typography.medium,
    fontSize: 14,
    color: colors.text_gray,
    marginRight: 4,
  },
  categoryTabTextSelected: {
    color: colors.text_primary,
  },
  categoryCount: {
    fontFamily: typography.regular,
    fontSize: 12,
    color: colors.text_gray,
  },
  categoryCountSelected: {
    color: colors.text_primary,
  },
  tagsContainer: {
    maxHeight: 38,
    marginTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: colors.divider_light,
  },
  tagsContent: {
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  tagChip: {
    height: 30,
    flexDirection: "row",
    backgroundColor: colors.tag_light,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 8,
  },
  tagChipSelected: {
    backgroundColor: colors.tag_dark,
  },
  tagChipText: {
    fontFamily: typography.regular,
    fontSize: 14,
    color: colors.tag_light_text,
  },
  tagChipTextSelected: {
    color: colors.tag_dark_text,
  },
  gridContent: {
    paddingTop: 6,
    paddingHorizontal: 10,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background_dim,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    color: "#fff",
    fontSize: 18,
    fontFamily: typography.medium,
  },
});

export default ClothingManagementScreen;

```

screens/OutfitManagementScreen.tsx:
```

```

screens/VirtualTryOnScreen.tsx:
```

```

screens/ClothingDetailScreen.tsx:
```
import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Alert,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { ClothingContext } from "../contexts/ClothingContext";
import { ClothingDetailScreenProps as Props } from "../types/navigation";
import { ClothingItem } from "../types/ClothingItem";
import { colors } from "../styles/colors";
import TagChips from "../components/common/TagChips";
import Header from "../components/common/Header";
import CategoryPicker from "../components/common/CategoryPicker";
import MultiSelectToggle from "../components/common/MultiSelectToggle";
import YearMonthPicker from "../components/common/YearMonthPicker";
import { colors as colorOptions, seasons, occasions } from "../data/options";
import { brands as brandSuggestions } from "../data/suggestions";
import { typography } from "../styles/globalStyles";
import { SafeAreaView } from "react-native-safe-area-context";

const ClothingDetailScreen = ({ route, navigation }: Props) => {
  const { id } = route.params;
  const context = useContext(ClothingContext);

  if (!context) {
    return <Text>Loading...</Text>;
  }

  const { getClothingItem, updateClothingItem, deleteClothingItem } = context;

  // Get the initial item from context
  const contextItem = getClothingItem(id);

  // Manage local state for the form
  const [localItem, setLocalItem] = useState<ClothingItem | undefined>(contextItem);
  const [isDirty, setIsDirty] = useState(false);

  // Update local state when context item changes
  useEffect(() => {
    if (contextItem) {
      setLocalItem(contextItem);
    }
  }, [contextItem]);

  if (!localItem) {
    return (
      <View style={styles.container}>
        <Text>Clothing item not found.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert("Delete Item", "Are you sure you want to delete this clothing item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteClothingItem(id);
          navigation.goBack();
        },
      },
    ]);
  };

  const handleSave = () => {
    if (localItem) {
      updateClothingItem(localItem);
      setIsDirty(false);
      Alert.alert("Success", "Clothing item updated successfully");
    }
  };

  const handleFieldChange = (field: keyof ClothingItem, value: any) => {
    setLocalItem((prevItem) => {
      if (!prevItem) return prevItem;
      return { ...prevItem, [field]: value };
    });
    setIsDirty(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        onBack={() => {
          if (isDirty) {
            Alert.alert("Unsaved Changes", "Do you want to save your changes?", [
              {
                text: "Discard",
                style: "destructive",
                onPress: () => navigation.goBack(),
              },
              {
                text: "Save",
                onPress: () => {
                  handleSave();
                  navigation.goBack();
                },
              },
            ]);
          } else {
            navigation.goBack();
          }
        }}
        onDelete={handleDelete}
      />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="always" // Allows tapping on suggestions without dismissing the keyboard
        >
          <Image
            source={{
              uri: localItem.backgroundRemovedImageUri || localItem.imageUri,
            }}
            resizeMode="contain"
            style={styles.image}
          />

          <View style={[styles.section, { paddingTop: 14 }]}>
            <TagChips
              tags={localItem.tags}
              onAddTag={(tag) => {
                handleFieldChange("tags", [...localItem.tags, tag]);
              }}
              onRemoveTag={(tag) => {
                handleFieldChange(
                  "tags",
                  localItem.tags.filter((t) => t !== tag)
                );
              }}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Item Details</Text>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Category</Text>
              <CategoryPicker
                selectedCategory={localItem.category}
                selectedSubcategory={localItem.subcategory}
                onValueChange={(category, subcategory) => {
                  handleFieldChange("category", category);
                  handleFieldChange("subcategory", subcategory);
                }}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Color</Text>
              <TextInput
                style={styles.textInput}
                value={localItem.color.join(", ")}
                placeholder="Enter color(s)"
                onChangeText={(text) =>
                  handleFieldChange(
                    "color",
                    text.split(",").map((s) => s.trim())
                  )
                }
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Season</Text>
              <MultiSelectToggle
                options={seasons}
                selectedValues={localItem.season}
                onValueChange={(selectedSeasons) => handleFieldChange("season", selectedSeasons)}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Occasion</Text>
              <MultiSelectToggle
                options={occasions}
                selectedValues={localItem.occasion}
                onValueChange={(selectedOccasions) => handleFieldChange("occasion", selectedOccasions)}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Brand</Text>
              <TextInput
                style={styles.textInput}
                value={localItem.brand}
                placeholder="Enter brand"
                onChangeText={(text) => handleFieldChange("brand", text)}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Purchase Date</Text>
              <YearMonthPicker
                selectedDate={localItem.purchaseDate}
                onValueChange={(date) => handleFieldChange("purchaseDate", date)}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Price</Text>
              <TextInput
                style={styles.fieldInput}
                value={localItem.price ? localItem.price.toString() : ""}
                keyboardType="numeric"
                onChangeText={(text) => {
                  const numericValue = parseFloat(text);
                  handleFieldChange("price", isNaN(numericValue) ? 0 : numericValue);
                }}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {isDirty && (
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screen_background,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#F8F8F8",
  },
  section: {
    paddingVertical: 8,
  },
  sectionTitle: {
    fontFamily: typography.bold,
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  field: {
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  fieldLabel: {
    fontFamily: typography.medium,
    fontSize: 16,
    marginBottom: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
  },
  saveButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: colors.primary_yellow,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: typography.bold,
    color: colors.text_primary,
  },
});

export default ClothingDetailScreen;

```

styles/colors.ts:
```
export const colors = {
  primary_yellow: "#F4C753",
  light_yellow: "#FFE9B1",
  text_primary: "#1E1E1E",
  text_gray: "#625845",

  icon_stroke: "#1E1E1E",
  screen_background: "#FCFAF7",
  thumbnail_background: "#F2F0E8",

  background_dim: "rgba(0, 0, 0, 0.25)",
  tag_dark: "#2C2C2C",
  tag_light: "#F5F5F5",
  tag_dark_text: "#F5F5F5",
  tag_light_text: "#757575",

  divider_light: "#DDDDDD",
  border_gray: "#D3D3D3",
  // other colors
};

```

styles/globalStyles.ts:
```
import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const typography = {
  regular: "PlusJakartaSans-Regular",
  medium: "PlusJakartaSans-Medium",
  semiBold: "PlusJakartaSans-SemiBold",
  bold: "PlusJakartaSans-Bold",
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screen_background,
  },
  titleText: {
    fontSize: 24,
    fontFamily: typography.bold,
    color: colors.text_gray,
  },
  bodyText: {
    fontFamily: typography.regular,
    fontSize: 16,
    color: colors.text_primary,
  },
});

```

components/clothing/ClothingItemThumbnail.tsx:
```
import React from "react";
import { TouchableOpacity, Image, StyleSheet, View } from "react-native";
import { ClothingItem } from "../../types/ClothingItem";
import { colors } from "../../styles/colors";

type Props = {
  item: ClothingItem;
  onPress: () => void;
};

const ClothingItemThumbnail = ({ item, onPress }: Props) => (
  <TouchableOpacity style={styles.container} onPress={onPress}>
    <View style={styles.card}>
      <Image
        source={{ uri: item.backgroundRemovedImageUri || item.imageUri }}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1 / 3,
    aspectRatio: 1,
    padding: 6,
  },
  card: {
    flex: 1,
    backgroundColor: colors.thumbnail_background,
    borderRadius: 12,
    padding: 4,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default ClothingItemThumbnail;

```

components/common/AnimatedAddButton.tsx:
```
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

```

components/common/YearMonthPicker.tsx:
```
import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, FlatList, Pressable } from "react-native";

type Props = {
  selectedDate: string; // Format: 'YYYY-MM'
  onValueChange: (date: string) => void;
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const YearMonthPicker = ({ selectedDate, onValueChange }: Props) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [tempMonth, setTempMonth] = useState<number>(new Date().getMonth());
  const [tempYear, setTempYear] = useState<number>(new Date().getFullYear());

  const handleConfirm = () => {
    const month = tempMonth + 1; // Months are zero-indexed
    const formattedMonth = month < 10 ? `0${month}` : month;
    onValueChange(`${tempYear}-${formattedMonth}`);
    setModalVisible(false);
  };

  const years = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= 2000; i--) {
    years.push(i);
  }

  return (
    <View>
      <TouchableOpacity style={styles.inputField} onPress={() => setModalVisible(true)}>
        <Text style={styles.inputText}>{selectedDate ? selectedDate : "Select Purchase Date"}</Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            {/* Header Bar */}
            <View style={styles.headerBar}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.headerButton}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Select Purchase Date</Text>
              <TouchableOpacity onPress={handleConfirm}>
                <Text style={styles.headerButton}>Confirm</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.pickerContent}>
              {/* Month Picker */}
              <View style={styles.pickerContainer}>
                <FlatList
                  data={months}
                  keyExtractor={(item) => item}
                  initialScrollIndex={tempMonth}
                  getItemLayout={(data, index) => ({
                    length: 40,
                    offset: 40 * index,
                    index,
                  })}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      style={[styles.pickerItem, tempMonth === index && styles.pickerItemSelected]}
                      onPress={() => setTempMonth(index)}
                    >
                      <Text style={styles.pickerItemText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>

              {/* Year Picker */}
              <View style={styles.pickerContainer}>
                <FlatList
                  data={years}
                  keyExtractor={(item) => item.toString()}
                  initialScrollIndex={0}
                  getItemLayout={(data, index) => ({
                    length: 40,
                    offset: 40 * index,
                    index,
                  })}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[styles.pickerItem, tempYear === item && styles.pickerItemSelected]}
                      onPress={() => setTempYear(item)}
                    >
                      <Text style={styles.pickerItemText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  inputField: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    justifyContent: "center",
  },
  inputText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContainer: {
    height: "40%", // Take half the screen
    backgroundColor: "#fff",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerBar: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerButton: {
    fontSize: 16,
    color: "#007aff",
  },
  pickerContent: {
    flexDirection: "row",
    flex: 1,
  },
  pickerContainer: {
    flex: 1,
  },
  pickerItem: {
    padding: 12,
    alignItems: "center",
  },
  pickerItemSelected: {
    backgroundColor: "#f0f0f0",
  },
  pickerItemText: {
    fontSize: 16,
  },
});

export default YearMonthPicker;

```

components/common/CategoryPicker.tsx:
```
import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, FlatList, Pressable } from "react-native";
import { categories } from "../../data/categories";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  selectedCategory: string;
  selectedSubcategory: string;
  onValueChange: (category: string, subcategory: string) => void;
};

type CategoryKey = keyof typeof categories;

const categoryIcons: { [key in CategoryKey]: React.ComponentProps<typeof MaterialCommunityIcons>["name"] } = {
  Tops: "tshirt-crew",
  Bottoms: "roller-skate-off",
  Dresses: "tshirt-crew",
  Footwear: "shoe-formal",
  Bags: "bag-personal",
  Accessories: "hat-fedora",
  Jewelry: "diamond-stone",
};

const CategoryPicker = ({ selectedCategory, selectedSubcategory, onValueChange }: Props) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [tempCategory, setTempCategory] = useState<CategoryKey>((selectedCategory as CategoryKey) || "");
  const [tempSubcategory, setTempSubcategory] = useState(selectedSubcategory || "");

  useEffect(() => {
    if (isModalVisible) {
      setTempCategory((selectedCategory as CategoryKey) || "");
      setTempSubcategory(selectedSubcategory || "");
    }
  }, [isModalVisible]);

  const handleCategorySelect = (category: CategoryKey) => {
    setTempCategory(category);
    setTempSubcategory(categories[category][0]);
  };

  const handleConfirm = () => {
    onValueChange(tempCategory, tempSubcategory);
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity style={styles.inputField} onPress={() => setModalVisible(true)}>
        <Text style={styles.inputText}>
          {selectedCategory ? `${selectedCategory} - ${selectedSubcategory}` : "Select Category"}
        </Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            {/* Header Bar */}
            <View style={styles.headerBar}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.headerButton}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Select Category</Text>
              <TouchableOpacity onPress={handleConfirm}>
                <Text style={styles.headerButton}>Confirm</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.pickerContent}>
              {/* Category List */}
              <View style={styles.pickerContainer}>
                <FlatList
                  data={Object.keys(categories)}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[styles.pickerItem, tempCategory === item && styles.pickerItemSelected]}
                      onPress={() => handleCategorySelect(item as CategoryKey)}
                    >
                      <MaterialCommunityIcons
                        name={categoryIcons[item as CategoryKey]}
                        size={24}
                        color="black"
                        style={styles.icon}
                      />
                      <Text style={styles.pickerItemText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>

              {/* Subcategory List */}
              <View style={styles.pickerContainer}>
                <FlatList
                  data={categories[tempCategory]}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[styles.pickerItem, tempSubcategory === item && styles.pickerItemSelected]}
                      onPress={() => setTempSubcategory(item)}
                    >
                      <Text style={styles.pickerItemText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  inputField: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    justifyContent: "center",
  },
  inputText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContainer: {
    height: "40%", // Take half the screen
    backgroundColor: "#fff",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerBar: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerButton: {
    fontSize: 16,
    color: "#007aff", // iOS default blue color
  },
  pickerContent: {
    flexDirection: "row",
    flex: 1,
  },
  pickerContainer: {
    flex: 1,
  },
  pickerItem: {
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
  },
  pickerItemSelected: {
    backgroundColor: "#f0f0f0",
  },
  pickerItemText: {
    fontSize: 16,
    marginLeft: 8,
  },
  icon: {
    marginRight: 8,
  },
});

export default CategoryPicker;

```

components/common/MultiSelectToggle.tsx:
```
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";

type Props = {
  options: string[];
  selectedValues: string[];
  onValueChange: (selected: string[]) => void;
};

const MultiSelectToggle = ({ options, selectedValues, onValueChange }: Props) => {
  const toggleValue = (value: string) => {
    let updatedValues = [...selectedValues];
    if (updatedValues.includes(value)) {
      updatedValues = updatedValues.filter((v) => v !== value);
    } else {
      updatedValues.push(value);
    }
    onValueChange(updatedValues);
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {options.map((option) => {
        const isSelected = selectedValues.includes(option);
        return (
          <TouchableOpacity
            key={option}
            style={[styles.button, isSelected && styles.buttonSelected]}
            onPress={() => toggleValue(option)}
          >
            <View style={styles.buttonContent}>
              {isSelected && (
                <MaterialIcons name="check" size={16} color={colors.tag_dark_text} style={styles.checkIcon} />
              )}
              <Text style={[styles.buttonText, isSelected && styles.buttonTextSelected]}>{option}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border_gray,
  },
  buttonSelected: {
    backgroundColor: colors.tag_dark,
    borderColor: colors.tag_dark,
  },
  buttonText: {
    fontSize: 16,
    color: colors.tag_light_text,
  },
  buttonTextSelected: {
    color: colors.tag_dark_text,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkIcon: {
    marginRight: 4,
  },
});

export default MultiSelectToggle;

```

components/common/Header.tsx:
```
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";

type Props = {
  onBack?: () => void;
  onDelete?: () => void;
};

const Header = ({ onBack, onDelete }: Props) => (
  <View style={styles.container}>
    {onBack && (
      <TouchableOpacity onPress={onBack}>
        <MaterialIcons name="arrow-back" size={24} color={colors.icon_stroke} />
      </TouchableOpacity>
    )}
    {onDelete && (
      <TouchableOpacity onPress={onDelete}>
        <MaterialIcons name="delete" size={24} color={colors.icon_stroke} />
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider_light,
  },
});

export default Header;

```

components/common/AddButton.tsx:
```
import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";

const AddButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <MaterialIcons name="add" size={24} color={colors.icon_stroke} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: colors.primary_yellow,
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AddButton;

```

components/common/TagChips.tsx:
```
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";
import { typography } from "../../styles/globalStyles";

type Props = {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
};

const TagChips = ({ tags, onAddTag, onRemoveTag }: Props) => {
  const [newTag, setNewTag] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddTag = () => {
    if (newTag.trim()) {
      onAddTag(newTag.trim());
      setNewTag("");
      setIsAdding(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {tags.map((item) => (
          <View key={item} style={styles.chip}>
            <Text style={styles.chipText}>{item}</Text>
            <TouchableOpacity onPress={() => onRemoveTag(item)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialIcons name="close" size={16} color={colors.text_gray} />
            </TouchableOpacity>
          </View>
        ))}
        {isAdding ? (
          <View style={styles.addChip}>
            <TextInput
              style={styles.input}
              value={newTag}
              onChangeText={setNewTag}
              onSubmitEditing={handleAddTag}
              placeholder="New Tag"
              autoFocus
              placeholderTextColor={colors.text_gray}
            />
            <TouchableOpacity onPress={handleAddTag}>
              <MaterialIcons name="check" size={20} color={colors.primary_yellow} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.addButton} onPress={() => setIsAdding(true)}>
            <MaterialIcons name="add" size={20} color={colors.primary_yellow} />
            <Text style={styles.addButtonText}>Add Tag</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  scrollContent: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  chip: {
    height: 30,
    flexDirection: "row",
    backgroundColor: colors.tag_light,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 8,
  },
  chipText: {
    color: colors.text_primary,
    fontSize: 14,
    marginRight: 4,
    fontFamily: typography.regular,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButtonText: {
    color: colors.primary_yellow,
    fontSize: 14,
    marginLeft: 4,
    fontFamily: typography.regular,
  },
  addChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.primary_yellow,
  },
  input: {
    minWidth: 60,
    fontSize: 14,
    fontFamily: typography.regular,
    color: colors.text_primary,
    padding: 0,
    margin: 0,
    borderColor: colors.primary_yellow,
  },
});

export default TagChips;

```

components/common/FilterButton.tsx:
```

```

data/categories.ts:
```
export const categories = {
  Tops: [
    "T-Shirts",
    "Polo Shirts",
    "Shirts",
    "Sweaters/Knits",
    "Sweatshirts",
    "Jackets & Coats",
    "Sleeveless Tops",
    "Suits",
    "Other Tops",
  ],
  Bottoms: ["Jeans", "Trousers", "Leggings", "Sweatpants", "Shorts", "Skirts", "Other Bottoms"],
  Dresses: ["Casual Dresses", "Formal Dresses", "Sundresses", "Other Dresses"],
  Footwear: ["Sneakers", "Boots", "Heels", "Flats", "Other Shoes"],
  Bags: ["Handbags", "Totes", "Backpacks", "Crossbody Bags", "Other Bags"],
  Accessories: [
    "Hats",
    "Watches",
    "Undergarments",
    "Socks",
    "Belts",
    "Ties/Bowties",
    "Glasses",
    "Hair Accessories",
    "Other Accessories",
  ],
  Jewelry: ["Bracelets/Bangles", "Rings", "Necklaces", "Earrings", "Other Jewelry"],
};

```

data/suggestions.ts:
```
export const brands = [
  "Nike",
  "Adidas",
  "Zara",
  "H&M",
  "Uniqlo",
  "Forever 21",
  "Gap",
  "Levi's",
  "Calvin Klein",
  "Tommy Hilfiger",
  "Ralph Lauren",
  "Champion",
  "Puma",
  "Vans",
];

```

data/options.ts:
```
export const colors = [
  "Black",
  "White",
  "Gray",
  "Blue",
  "Pink",
  "Beige",
  "Brown",
  "Orange",
  "Red",
  "Yellow",
  "Purple",
  "Green",
];

export const seasons = ["Spring/Fall", "Summer", "Winter"];

export const occasions = ["Casual", "Work", "Sports", "Formal", "Party"];

```

services/BackgroundRemoval.ts:
```
...
```

services/ClothingCategorization.ts:
```
...
```

</current-repo>

Now, I want to implement the Virtual Try-On Screen according to the UI/UX requirements in the design doc. Please follow these guidelines:
1. Centralize colors and common styles in `/src/styles` for consistent theming
2. Break down UI elements into reusable components
3. Implement navigation using React Navigation for seamless transitions between screens

Before you give your recommendation, you MUST carefully examine the current design doc and repo content I pasted above to understand the context first. 

This is a complex task and we could implement this step-by-step in multiple conversations.
