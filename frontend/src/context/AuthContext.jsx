import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/http";
import { login as apiLogin, register as apiRegister, me as apiMe } from "../api/auth";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // hydrate from localStorage on boot
  useEffect(() => {
    const token = localStorage.getItem("token");
    const cachedUser = localStorage.getItem("user");
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
      if (cachedUser) {
        try { setUser(JSON.parse(cachedUser)); } catch {}
      }
      (async () => {
        try {
          const profile = await apiMe().catch(() => null);
          if (profile) {
            setUser(profile);
            localStorage.setItem("user", JSON.stringify(profile));
          }
        } finally {
          setReady(true);
        }
      })();
    } else {
      setReady(true);
    }
  }, []);

  // Normalize a flat backend response to a user object
  function buildUserFromFlat(data) {
    // backend login: { id, username, email, fullName, role, token }
    // backend register: { email, fullName, role, token } (may not include id/username)
    return {
      id: data.id ?? data._id ?? null,
      username: data.username ?? (data.email ? data.email.split("@")[0] : null),
      email: data.email ?? null,
      fullName: data.fullName ?? null,
      role: data.role ?? "patient",
    };
  }

  async function login(email, password) {
    const data = await apiLogin(email, password);
    const token = data.token;
    if (!token) throw new Error("Missing token from server");
    const userObj = data.user ? data.user : buildUserFromFlat(data);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userObj));
    api.defaults.headers.Authorization = `Bearer ${token}`;
    setUser(userObj);
    return userObj;
  }

  async function register(fullName, email, password) {
    const data = await apiRegister(fullName, email, password);
    const token = data.token;
    if (!token) throw new Error("Missing token from server");
    const userObj = data.user ? data.user : buildUserFromFlat(data);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userObj));
    api.defaults.headers.Authorization = `Bearer ${token}`;
    setUser(userObj);
    return userObj;
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.Authorization;
    setUser(null);
  }

  const value = useMemo(() => ({ user, ready, login, register, logout }), [user, ready]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
