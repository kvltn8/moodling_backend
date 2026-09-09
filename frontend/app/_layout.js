import { useEffect, useCallback } from "react";
import { Stack } from "expo-router";
import { View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, LobsterTwo_400Regular, LobsterTwo_700Bold } from "@expo-google-fonts/lobster-two";
import { DancingScript_600SemiBold, DancingScript_700Bold } from "@expo-google-fonts/dancing-script";
import {
  Outfit_300Light,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
} from "@expo-google-fonts/outfit";
import { AuthProvider } from "../src/context/AuthContext";
import { colors } from "../src/theme";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    LobsterTwo_400Regular,
    LobsterTwo_700Bold,
    DancingScript_600SemiBold,
    DancingScript_700Bold,
    Outfit_300Light,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </AuthProvider>
    </View>
  );
}
