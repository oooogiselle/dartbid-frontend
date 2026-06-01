import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { login, register, getMe, getNotifications, setToken } from "../api";

const TOKEN_KEY = "dartbid_token";
const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser]   = useState(null);
  const [authLoading, setAuthLoading]   = useState(true);
  const [authError, setAuthError]       = useState(null);
  const [unreadCount, setUnreadCount]   = useState(0);

  const refreshNotificationCount = useCallback(async () => {
    try {
      const notifs = await getNotifications();
      setUnreadCount((notifs ?? []).filter((n) => !n.isRead).length);
    } catch {
      setUnreadCount(0);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const me = await getMe();
      setCurrentUser(me);
    } catch {/* ignore */}
  }, []);

  // Restore session from localStorage on boot
  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) {
      setAuthLoading(false);
      return;
    }
    setToken(stored);
    getMe()
      .then((me) => {
        setCurrentUser(me);
        refreshNotificationCount();
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      })
      .finally(() => setAuthLoading(false));
  }, []);

  async function loginWithCredentials(email, password) {
    setAuthError(null);
    const { token } = await login(email, password);
    localStorage.setItem(TOKEN_KEY, token);
    setToken(token);
    const me = await getMe();
    setCurrentUser(me);
    await refreshNotificationCount();
  }

  async function registerAndLogin({ name, email, password, yearStanding, major }) {
    setAuthError(null);
    const { token } = await register({ name, email, password, yearStanding, major });
    localStorage.setItem(TOKEN_KEY, token);
    setToken(token);
    const me = await getMe();
    setCurrentUser(me);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setCurrentUser(null);
    setUnreadCount(0);
  }

  function updateBalance(newBalance) {
    setCurrentUser((prev) => ({ ...prev, accountBalance: newBalance }));
  }

  if (authLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "IBM Plex Mono, monospace", color: "#4ade80", background: "#06100A", fontSize: "13px" }}>
        connecting to dartbid...
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ currentUser, authLoading, authError, unreadCount, loginWithCredentials, registerAndLogin, logout, updateBalance, refreshUser, refreshNotificationCount }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
}
