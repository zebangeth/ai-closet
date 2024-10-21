import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type ClosetStackParamList = {
  ClothingManagement: undefined;
  ClothingDetail: { id: string };
};

export type ClothingDetailScreenProps = NativeStackScreenProps<ClosetStackParamList, 'ClothingDetail'>;
export type ClothingManagementScreenProps = NativeStackScreenProps<ClosetStackParamList, 'ClothingManagement'>;
