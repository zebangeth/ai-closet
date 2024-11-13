import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

// Root Stack Navigator Types
export type RootStackParamList = {
  MainTabs: undefined;
  ClothingDetailModal: { id: string };
};

// Root Tab Navigator Types
export type MainTabParamList = {
  Closet: NavigatorScreenParams<ClosetStackParamList>;
  Outfits: NavigatorScreenParams<OutfitStackParamList>;
  "Try-On": undefined;
  Profile: undefined;
};

// Stack Navigator Types
export type ClosetStackParamList = {
  ClothingManagement: undefined;
  ClothingDetail: { id: string };
};

export type OutfitStackParamList = {
  OutfitManagement: undefined;
  OutfitCanvas: { id?: string };
  OutfitDetail: { id: string };
};

// Screen Props Types
export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;

export type ClosetStackScreenProps<T extends keyof ClosetStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<ClosetStackParamList, T>,
  CompositeScreenProps<BottomTabScreenProps<MainTabParamList>, NativeStackScreenProps<RootStackParamList>>
>;

export type OutfitStackScreenProps<T extends keyof OutfitStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<OutfitStackParamList, T>,
  CompositeScreenProps<BottomTabScreenProps<MainTabParamList>, NativeStackScreenProps<RootStackParamList>>
>;
