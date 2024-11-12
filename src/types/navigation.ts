import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

// Root Tab Navigator Types
export type RootTabParamList = {
  Closet: NavigatorScreenParams<ClosetStackParamList>;
  Outfits: NavigatorScreenParams<OutfitStackParamList>;
  "Try-On": undefined; // Single screen, no nested navigation
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

// Screen Props Types - Using CompositeScreenProps for nested navigation
export type RootTabScreenProps<T extends keyof RootTabParamList> = BottomTabScreenProps<RootTabParamList, T>;

export type ClosetStackScreenProps<T extends keyof ClosetStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<ClosetStackParamList, T>,
  BottomTabScreenProps<RootTabParamList>
>;

export type OutfitStackScreenProps<T extends keyof OutfitStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<OutfitStackParamList, T>,
  BottomTabScreenProps<RootTabParamList>
>;
