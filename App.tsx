import 'react-native-get-random-values';
import React from 'react';
import AppNavigator from './src/navigation';
import { ClothingProvider } from './src/contexts/ClothingContext';

export default function App() {
  return (
    <ClothingProvider>
      <AppNavigator />
    </ClothingProvider>
  );
}
