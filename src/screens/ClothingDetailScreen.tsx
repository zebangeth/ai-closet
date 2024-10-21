import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { ClothingContext } from '../contexts/ClothingContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ClosetStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<ClosetStackParamList, 'ClothingDetail'>;

const ClothingDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const context = useContext(ClothingContext);
  
  if (!context) {
    return <Text>Loading...</Text>;
  }

  const { clothingItems, deleteClothingItem } = context;

  const item = clothingItems.find(ci => ci.id === id);

  if (!item) {
    return (
      <View style={styles.container}>
        <Text>Clothing item not found.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    deleteClothingItem(id);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete}>
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>
      {/* Clothing Image */}
      <Image source={{ uri: item.backgroundRemovedImageUri || item.imageUri }} style={styles.image} />
      {/* Tags and details */}
      {/* ... */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
  image: { width: '100%', height: 300 },
});

export default ClothingDetailScreen;
