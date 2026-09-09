import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { colors, fonts, spacing, radii } from "../theme";

export default function TopBar() {
  const { session, signOut } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/login");
  };

  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.greeting}>{greeting},</Text>
        <Text style={styles.name}>{session?.username}</Text>
      </View>
      <Pressable style={styles.iconButton} onPress={handleSignOut}>
        <Ionicons name="log-out-outline" size={18} color={colors.inkSoft} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  greeting: { fontFamily: fonts.body, fontSize: 12, color: colors.muted },
  name: { fontFamily: fonts.display, fontSize: 22, color: colors.primary },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.hairline,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
});
