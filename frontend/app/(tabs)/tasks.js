import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../src/context/AuthContext";
import { api, API_BASE_URL } from "../../src/api/client";
import TopBar from "../../src/components/TopBar";
import { colors, fonts, spacing, radii } from "../../src/theme";

export default function TasksTab() {
  const { session } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [newTask, setNewTask] = useState("");
  const [adding, setAdding] = useState(false);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await api.listTasks(session.token);
      setTasks([...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    } catch (err) {
      setLoadError(err.message || "Couldn't reach your backend.");
    } finally {
      setLoading(false);
    }
  }, [session.token]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const addTask = async () => {
    const title = newTask.trim();
    if (!title) return;
    setAdding(true);
    try {
      await api.createTask(session.token, { Task: title, note: "", is_done: false });
      setNewTask("");
      loadTasks();
    } catch (err) {
      setLoadError(err.message || "Couldn't add that task.");
    } finally {
      setAdding(false);
    }
  };

  const toggleDone = async (task) => {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, is_done: !t.is_done } : t)));
    try {
      await api.updateTask(session.token, task.id, { is_done: !task.is_done });
    } catch {
      loadTasks();
    }
  };

  const removeTask = async (task) => {
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
    try {
      await api.deleteTask(session.token, task.id);
    } catch {
      loadTasks();
    }
  };

  const open = tasks.filter((t) => !t.is_done);
  const done = tasks.filter((t) => t.is_done);

  return (
    <SafeAreaView style={styles.safe}>
      <TopBar />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>Today's list</Text>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Add a task"
            placeholderTextColor={colors.muted}
            value={newTask}
            onChangeText={setNewTask}
            onSubmitEditing={addTask}
            returnKeyType="done"
          />
          <Pressable
            style={[styles.addButton, (!newTask.trim() || adding) && styles.addButtonDisabled]}
            onPress={addTask}
            disabled={!newTask.trim() || adding}
          >
            <Ionicons name="add" size={20} color={colors.surface} />
          </Pressable>
        </View>

        {loading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.muted}>Loading your tasks…</Text>
          </View>
        )}

        {!!loadError && (
          <View style={styles.errorCard}>
            <Text style={styles.error}>Couldn't reach your task list — {loadError}</Text>
            <Text style={styles.mutedSmall}>
              (Check that {API_BASE_URL} is reachable from your device.)
            </Text>
          </View>
        )}

        {!loading && !loadError && (
          <>
            <View style={styles.taskList}>
              {open.length === 0 && <Text style={styles.muted}>Nothing open. Add something above.</Text>}
              {open.map((t) => (
                <TaskRow key={t.id} task={t} onToggle={() => toggleDone(t)} onDelete={() => removeTask(t)} />
              ))}
            </View>

            {done.length > 0 && (
              <>
                <View style={styles.divider} />
                <Text style={styles.subheading}>Done</Text>
                <View style={styles.taskList}>
                  {done.map((t) => (
                    <TaskRow
                      key={t.id}
                      task={t}
                      onToggle={() => toggleDone(t)}
                      onDelete={() => removeTask(t)}
                    />
                  ))}
                </View>
              </>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function TaskRow({ task, onToggle, onDelete }) {
  return (
    <View style={styles.taskRow}>
      <Pressable
        style={[styles.checkbox, task.is_done && styles.checkboxDone]}
        onPress={onToggle}
      >
        {task.is_done && <Ionicons name="checkmark" size={13} color={colors.surface} />}
      </Pressable>
      <View style={styles.taskTextWrap}>
        <Text style={[styles.taskTitle, task.is_done && styles.taskTitleDone]}>{task.Task}</Text>
        {!!task.note && <Text style={styles.taskNote}>{task.note}</Text>}
      </View>
      <Pressable onPress={onDelete} hitSlop={8}>
        <Ionicons name="trash-outline" size={16} color={colors.muted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl, gap: spacing.lg },
  heading: { fontFamily: fonts.bodyMedium, fontSize: 17, color: colors.ink },
  subheading: { fontFamily: fonts.body, fontSize: 12, color: colors.muted },

  inputRow: { flexDirection: "row", gap: spacing.sm },
  input: {
    flex: 1,
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
  addButton: {
    width: 42,
    borderRadius: radii.md,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonDisabled: { opacity: 0.5 },

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

  divider: { height: 1, backgroundColor: colors.hairline },

  taskList: { gap: spacing.sm },
  taskRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radii.lg,
    padding: spacing.md,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.hairline,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  checkboxDone: { backgroundColor: colors.primary, borderColor: colors.primary },
  taskTextWrap: { flex: 1, gap: 2 },
  taskTitle: { fontFamily: fonts.body, fontSize: 14, color: colors.ink },
  taskTitleDone: { color: colors.muted, textDecorationLine: "line-through" },
  taskNote: { fontFamily: fonts.body, fontSize: 11, color: colors.muted },
});
