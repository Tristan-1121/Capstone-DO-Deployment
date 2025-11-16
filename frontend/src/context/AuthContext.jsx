import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/http";
import { login as apiLogin, register as apiRegister, me as apiMe } from "../api/auth";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // { id, email, fullName, role, ... }
  const [ready, setReady] = useState(false); // true when initial auth check is done

  // Hydrate auth state from localStorage on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const cachedUser = localStorage.getItem("user");

    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;

      // Use cached user immediately for UI, if present
      if (cachedUser) {
        try {
          setUser(JSON.parse(cachedUser));
        } catch {
          // ignore parse errors and fall back to /me
        }
      }

      // Refresh user from backend (/me) to stay in sync
      (async () => {
        try {
          const profile = await apiMe().catch(() => null);
          if (profile) {
            const normalized = buildUserFromFlat(profile);
            setUser(normalized);
            localStorage.setItem("user", JSON.stringify(normalized));
          }
        } finally {
          setReady(true);
        }
      })();
    } else {
      setReady(true);
    }
  }, []);

// Converts backend responses into a consistent user object
function buildUserFromFlat(data) {
  return {
    // Normalize id so it works whether the server sends id or _id
    id: data.id ?? data._id ?? null,

    // Use provided username or fall back to the email prefix
    username: data.username ?? (data.email ? data.email.split("@")[0] : null),

    // Always include the email if provided
    email: data.email ?? null,

    // Use fullName from the server or build it from first and last name
    fullName:
      data.fullName ??
      (`${data.firstName ?? ""} ${data.lastName ?? ""}`.trim() || null),

    // Default the role to patient if the server does not provide one
    role: data.role ?? "patient",
  };
}


  // Login and store token + normalized user (including role)
  async function login(email, password) {
    const data = await apiLogin(email, password);
    const token = data.token;
    if (!token) throw new Error("Missing token from server");

    const userObj = data.user ? buildUserFromFlat(data.user) : buildUserFromFlat(data);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userObj));
    api.defaults.headers.Authorization = `Bearer ${token}`;
    setUser(userObj);
    return userObj;
  }

  // Register and immediately treat the new user as logged in
  async function register(fullName, email, password) {
    const data = await apiRegister(fullName, email, password);
    const token = data.token;
    if (!token) throw new Error("Missing token from server");

    const userObj = data.user ? buildUserFromFlat(data.user) : buildUserFromFlat(data);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userObj));
    api.defaults.headers.Authorization = `Bearer ${token}`;
    setUser(userObj);
    return userObj;
  }

  // Clear auth state everywhere
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.Authorization;
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      role: user?.role ?? null, // convenient shortcut for role-based logic
      ready,
      login,
      register,
      logout,
    }),
    [user, ready]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
