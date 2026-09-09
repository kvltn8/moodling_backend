import { Stack, Redirect } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";

export default function AuthLayout() {
  const { session, isRestoring } = useAuth();

  if (!isRestoring && session) {
    return <Redirect href="/(tabs)/mood" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
