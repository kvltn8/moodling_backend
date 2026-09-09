import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useAuth } from "../../src/context/AuthContext";
import { api } from "../../src/api/client";
import { MOODS, moodByKey, moodForEntry, scoreToColor, trailingAverage } from "../../src/data/moods";
import MoodIllustration from "../../src/components/MoodIllustration";
import PrimaryButton from "../../src/components/PrimaryButton";
import TopBar from "../../src/components/TopBar";
import { colors, fonts, spacing, radii } from "../../src/theme";
import { API_BASE_URL } from "../../src/api/client";

export default function MoodTab() {
  const { session } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [savedFlash, setSavedFlash] = useState(false);

  const loadEntries = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await api.listMoods(session.token);
      setEntries([...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    } catch (err) {
      setLoadError(err.message || "Couldn't reach your backend.");
    } finally {
      setLoading(false);
    }
  }, [session.token]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const saveMood = async () => {
    if (!selected) return;
    setSaving(true);
    setSaveError("");
    try {
      const mood = moodByKey(selected);
      await api.createMood(session.token, {
        mood: mood.label,
        animations: mood.key,
        description: note.trim(),
      });
      setNote("");
      setSelected(null);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1800);
      loadEntries();
    } catch (err) {
      setSaveError(err.message || "Couldn't save that entry.");
    } finally {
      setSaving(false);
    }
  };

  const trailing = trailingAverage(entries);
  const history = entries.slice(0, 7).reverse();

  return (
    <SafeAreaView style={styles.safe}>
      <TopBar />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>How are you, right now?</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.illoRow}>
          {MOODS.map((m) => {
            const active = selected === m.key;
            return (
              <Pressable
                key={m.key}
                onPress={() => setSelected(m.key)}
                style={[styles.illoCard, active && styles.illoCardActive]}
              >
                <MoodIllustration uri={m.illo} size={48} active={active} />
                <Text style={[styles.illoLabel, active && styles.illoLabelActive]}>{m.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {selected && (
          <View style={styles.selectedCard}>
            <Text style={styles.selectedBlurb}>{moodByKey(selected).blurb}</Text>
            <TextInput
              style={styles.textarea}
              placeholder="Add a note (optional)"
              placeholderTextColor={colors.muted}
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={3}
            />
            {!!saveError && <Text style={styles.error}>{saveError}</Text>}
            <PrimaryButton label="Save entry" onPress={saveMood} loading={saving} />
          </View>
        )}

        {savedFlash && <Text style={styles.toast}>Logged. Thank you for checking in.</Text>}

        <View style={styles.divider} />

        <View style={styles.rowBetween}>
          <Text style={styles.subheading}>Last 7 days</Text>
          {trailing != null && <Text style={styles.trailingBadge}>avg {trailing.toFixed(1)}/7</Text>}
        </View>

        {loading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.muted}>Loading your history…</Text>
          </View>
        )}

        {!!loadError && (
          <View style={styles.errorCard}>
            <Text style={styles.error}>Couldn't load entries yet — {loadError}</Text>
            <Text style={styles.mutedSmall}>
              (Check that {API_BASE_URL} is reachable from your device.)
            </Text>
          </View>
        )}

        {!loading && !loadError && (
          <View style={styles.historyStrip}>
            {history.length === 0 && (
              <Text style={styles.muted}>No entries yet. Log your first mood above.</Text>
            )}
            {history.map((e, i) => {
              const m = moodForEntry(e);
              return (
                <View key={i} style={styles.historyDotWrap}>
                  <View
                    style={[
                      styles.historyDot,
                      { backgroundColor: m ? scoreToColor(m.score) : colors.hairline },
                    ]}
                  />
                  <Text style={styles.historyDate}>
                    {new Date(e.created_at).toLocaleDateString(undefined, { weekday: "short" }).slice(0, 2)}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl, gap: spacing.lg },
  heading: { fontFamily: fonts.bodyMedium, fontSize: 17, color: colors.ink },
  subheading: { fontFamily: fonts.body, fontSize: 12, color: colors.muted },

  illoRow: { gap: spacing.md, paddingVertical: spacing.xs },
  illoCard: {
    width: 84,
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.hairline,
    backgroundColor: colors.surface,
  },
  illoCardActive: { borderColor: colors.gold, backgroundColor: colors.goldSoft },
  illoLabel: { fontFamily: fonts.body, fontSize: 11, color: colors.inkSoft },
  illoLabelActive: { color: colors.primary, fontFamily: fonts.bodyMedium },

  selectedCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  selectedBlurb: { fontFamily: fonts.script, fontSize: 18, color: colors.primary },
  textarea: {
    borderWidth: 1,
    borderColor: colors.hairline,
    backgroundColor: colors.surfaceSoft,
    borderRadius: radii.md,
    padding: spacing.md,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.ink,
    minHeight: 72,
    textAlignVertical: "top",
  },
  toast: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.primary,
    backgroundColor: colors.goldSoft,
    borderRadius: radii.sm,
    padding: spacing.sm,
    textAlign: "center",
  },

  divider: { height: 1, backgroundColor: colors.hairline },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  trailingBadge: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    color: colors.primary,
    backgroundColor: colors.goldSoft,
    borderRadius: radii.pill,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },

  loadingRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  muted: { fontFamily: fonts.body, fontSize: 12, color: colors.muted, paddingVertical: spacing.xs },
  mutedSmall: { fontFamily: fonts.body, fontSize: 10, color: colors.muted, marginTop: 4 },
  error: { fontFamily: fonts.body, fontSize: 12, color: colors.danger },
  errorCard: {
    backgroundColor: colors.dangerSoft,
    borderWidth: 1,
    borderColor: "#E9CFC6",
    borderRadius: radii.md,
    padding: spacing.md,
  },

  historyStrip: { flexDirection: "row", justifyContent: "space-between" },
  historyDotWrap: { alignItems: "center", gap: spacing.xs },
  historyDot: { width: 14, height: 14, borderRadius: 999 },
  historyDate: { fontFamily: fonts.body, fontSize: 10, color: colors.muted },
});
