import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { storage } from "../utils/storage";
import { loginApi, registerApi, meApi } from "../api/index";

const AuthContext = createContext(null);

// Normalize backend responses into a single "user object"
function normalizeUser(data) {
  if (!data) return null;

  if (data.user && typeof data.user === "object") return data.user;
  if (data.me && typeof data.me === "object") return data.me;
  if (data.id || data.email || data.role) return data;

  return null;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(storage.getToken());
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // restore session on first load if token exists
  useEffect(() => {
    let cancelled = false;

    async function loadMe() {
      const t = storage.getToken();
      if (!t) {
        if (!cancelled) setAuthLoading(false);
        return;
      }

      try {
        const data = await meApi();
        const u = normalizeUser(data);
        if (!cancelled) setUser(u);
      } catch (err) {
        if (!cancelled) {
          storage.clearToken();
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) setAuthLoading(false);
      }
    }

    loadMe();
    return () => {
      cancelled = true;
    };
  }, []);

  async function login(email, password) {
    const data = await loginApi(email, password);

    const newToken = data?.token ?? null;
    storage.setToken(newToken);
    setToken(newToken);

    const u = normalizeUser(data);
    setUser(u);

    try {
      const meData = await meApi();
      const meUser = normalizeUser(meData);
      if (meUser) setUser(meUser);
    } catch {
    }
  }

  async function register(payload) {
    const data = await registerApi(payload);

    const newToken = data?.token ?? null;
    storage.setToken(newToken);
    setToken(newToken);

    const u = normalizeUser(data);
    setUser(u);

    try {
      const meData = await meApi();
      const meUser = normalizeUser(meData);
      if (meUser) setUser(meUser);
    } catch {
      // ignore
    }
  }

  function logout() {
    storage.clearToken();
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      token,
      user,
      role: user?.role ?? null,
      restaurantId: user?.restaurant_id ?? null,
      authLoading,
      isAuthed: !!token,
      login,
      register,
      logout,
      setUser,
    }),
    [token, user, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}