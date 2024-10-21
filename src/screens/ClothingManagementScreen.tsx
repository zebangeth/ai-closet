import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { ClothingContext } from '../contexts/ClothingContext';
import ClothingItemThumbnail from '../components/clothing/ClothingItemThumbnail';
import AnimatedAddButton from '../components/common/AnimatedAddButton';
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

  const handleChoosePhoto = () => {
    navigation.navigate('AddClothingItemScreen', { source: 'gallery' });
  };

  const handleTakePhoto = () => {
    navigation.navigate('AddClothingItemScreen', { source: 'camera' });
  };

  return (
    <View style={styles.container}>
      {/* Header and category tabs can be added here */}
      <FlatList
        data={clothingItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={3}
        contentContainerStyle={styles.listContent}
      />
      <AnimatedAddButton
        onChoosePhoto={handleChoosePhoto}
        onTakePhoto={handleTakePhoto}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  listContent: {
    paddingBottom: 80, // To ensure content is above the add button
  },
});

export default ClothingManagementScreen;
