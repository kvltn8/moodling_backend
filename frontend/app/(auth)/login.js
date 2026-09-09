import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import PrimaryButton from "../../src/components/PrimaryButton";
import { colors, fonts, spacing, radii } from "../../src/theme";
import { API_BASE_URL } from "../../src/api/client";

export default function Login() {
  const { signIn } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    setBusy(true);
    try {
      await signIn(username, password);
      router.replace("/(tabs)/mood");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrap}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.wordmark}>Moodling</Text>
        <Text style={styles.subtitle}>Welcome back.</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="e.g. juno"
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={colors.muted}
            secureTextEntry
          />
        </View>

        {!!error && <Text style={styles.error}>{error}</Text>}

        <PrimaryButton label="Sign in" onPress={submit} loading={busy} disabled={!username || !password} />
      </View>

      <Pressable onPress={() => router.push("/(auth)/register")}>
        <Text style={styles.link}>New here? Create an account</Text>
      </Pressable>

      <Text style={styles.footnote}>Connecting to {API_BASE_URL}</Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg, justifyContent: "center", padding: spacing.xl, gap: spacing.xl },
  header: { gap: spacing.xs },
  wordmark: { fontFamily: fonts.display, fontSize: 32, color: colors.primary },
  subtitle: { fontFamily: fonts.body, fontSize: 14, color: colors.inkSoft },
  form: { gap: spacing.md },
  field: { gap: spacing.xs },
  label: { fontFamily: fonts.body, fontSize: 12, color: colors.inkSoft },
  input: {
    borderWidth: 1,
    borderColor: colors.hairline,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    paddingVertical: 11,
    paddingHorizontal: 13,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.ink,
  },
  error: { fontFamily: fonts.body, fontSize: 12, color: colors.danger },
  link: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.gold, textAlign: "center" },
  footnote: { fontFamily: fonts.body, fontSize: 11, color: colors.muted, textAlign: "center" },
});
