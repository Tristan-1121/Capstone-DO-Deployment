import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; }
  });

  // persist token; clearing removes it
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  // persist user so refresh keeps the name on the navbar
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user || {}));
  }, [user]);

  const logout = () => { setToken(""); setUser({}); };

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser, isAuthenticated: !!token, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
