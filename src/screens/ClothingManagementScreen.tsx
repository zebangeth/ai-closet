// screens/ClothingManagementScreen.tsx
import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { ClothingContext } from '../contexts/ClothingContext';
import ClothingItemThumbnail from '../components/clothing/ClothingItemThumbnail';
import AddButton from '../components/common/AddButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ClothingItem } from '../types/ClothingItem';
import { ClosetStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<ClosetStackParamList, 'ClothingManagement'>;

const ClothingManagementScreen: React.FC<Props> = ({ navigation }) => {
  const context = useContext(ClothingContext);
  
  if (!context) {
    return <Text>Loading...</Text>;
  }

  const { clothingItems } = context;

  const renderItem = ({ item }: { item: ClothingItem }) => (
    <ClothingItemThumbnail
      item={item}
      onPress={() => navigation.navigate('ClothingDetail', { id: item.id })}
    />
  );

  return (
    <View style={styles.container}>
      {/* Header and category tabs */}
      <FlatList
        data={clothingItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={3}
      />
      <AddButton onPress={() => navigation.navigate('AddClothingItemScreen')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default ClothingManagementScreen;
