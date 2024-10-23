import { useEffect } from "react";
import { useFonts } from "expo-font";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from "@expo-google-fonts/plus-jakarta-sans";
import AppNavigator from "./src/navigation";
import { ClothingProvider } from "./src/contexts/ClothingContext";

export default function App() {
  const [fontsLoaded] = useFonts({
    "PlusJakartaSans-Regular": PlusJakartaSans_400Regular,
    "PlusJakartaSans-Medium": PlusJakartaSans_500Medium,
    "PlusJakartaSans-SemiBold": PlusJakartaSans_600SemiBold,
    "PlusJakartaSans-Bold": PlusJakartaSans_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ClothingProvider>
      <AppNavigator />
    </ClothingProvider>
  );
}
