import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../api/client";

const STORAGE_KEY = "moodling.session";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null); // { token, username }
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setSession(JSON.parse(raw));
      } catch {
        // corrupt/missing storage, just start signed out
      } finally {
        setIsRestoring(false);
      }
    })();
  }, []);

  const persist = useCallback(async (next) => {
    setSession(next);
    if (next) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const signIn = useCallback(
    async (username, password) => {
      const { access } = await api.login(username, password);
      await persist({ token: access, username });
    },
    [persist]
  );

  const signUp = useCallback(
    async (username, email, password) => {
      await api.register(username, email, password);
      await signIn(username, password);
    },
    [signIn]
  );

  const signOut = useCallback(() => persist(null), [persist]);

  return (
    <AuthContext.Provider value={{ session, isRestoring, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
