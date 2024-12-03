import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  ClothingDetailModal: { id: string };
  OutfitDetailModal: { id: string };
  SelectOutfitModal: undefined;
};

export type MainTabParamList = {
  Closet: NavigatorScreenParams<ClosetStackParamList>;
  Outfits: NavigatorScreenParams<OutfitStackParamList>;
  TryOn: NavigatorScreenParams<TryOnStackParamList>;
  Profile: undefined;
};

export type ClosetStackParamList = {
  ClothingManagement: undefined;
  ClothingDetail: { id: string };
};

export type OutfitStackParamList = {
  OutfitManagement: undefined;
  OutfitCanvas: { id?: string };
  OutfitDetail: { id: string };
};

export type TryOnStackParamList = {
  VirtualTryOn: undefined;
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

export type TryOnStackScreenProps<T extends keyof TryOnStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<TryOnStackParamList, T>,
  CompositeScreenProps<BottomTabScreenProps<MainTabParamList>, NativeStackScreenProps<RootStackParamList>>
>;

export type OutfitDetailScreenProps =
  | OutfitStackScreenProps<"OutfitDetail">
  | RootStackScreenProps<"OutfitDetailModal">;
