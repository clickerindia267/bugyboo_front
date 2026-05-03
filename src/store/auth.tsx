import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  [key: string]: any;
};

type AuthCtx = {
  isLoggedIn: boolean;
  user: AuthUser | null;
  accessToken: string | null;
  /** Call after successful API login — stores tokens + user and flips state */
  setAuth: (accessToken: string, refreshToken: string, user: AuthUser) => void;
  /** Clears all auth data from memory + localStorage */
  clearAuth: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [accessToken, setAccessToken] = useState<string | null>(
    () => localStorage.getItem("accessToken"),
  );

  const isLoggedIn = !!accessToken && !!user;

  const setAuth: AuthCtx["setAuth"] = useCallback((token, refreshToken, userData) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setAccessToken(token);
    setUser(userData);
  }, []);

  const clearAuth: AuthCtx["clearAuth"] = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setAccessToken(null);
    setUser(null);
  }, []);

  // Listen for storage changes in other tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "accessToken" && !e.newValue) {
        setAccessToken(null);
        setUser(null);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <Ctx.Provider value={{ isLoggedIn, user, accessToken, setAuth, clearAuth }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
