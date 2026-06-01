import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { login, getMe, getNotifications, setToken } from "../api";
import { HARDCODED_STUDENTS } from "./students";

export { HARDCODED_STUDENTS };

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(HARDCODED_STUDENTS[0]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError]     = useState(null);
  // Incremented on every loginAs call; lets async callbacks detect they're stale.
  const loginVersionRef = useRef(0);

  // Login a student by email/password, set their token, load their profile
  const loginAs = useCallback(async (student) => {
    const myVersion = ++loginVersionRef.current;
    setAuthError(null);
    try {
      const { token } = await login(student.email, student.password);
      if (loginVersionRef.current !== myVersion) return;
      setToken(token);
      const me = await getMe();
      if (loginVersionRef.current !== myVersion) return;
      setCurrentUser(me);
      await refreshNotificationCount();
    } catch (e) {
      if (loginVersionRef.current !== myVersion) return;
      setAuthError(`Login failed for ${student.name}: ${e.response?.data?.error ?? e.message}`);
      // Fall back to local stub so UI still renders
      setCurrentUser(student);
    }
  }, []);

  // Boot: login as first student
  useEffect(() => {
    loginAs(HARDCODED_STUDENTS[0]).finally(() => setAuthLoading(false));
  }, []);

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

  async function switchUser(email) {
    const s = HARDCODED_STUDENTS.find((x) => x.email === email);
    if (s) await loginAs(s);
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
    <UserContext.Provider value={{ currentUser, unreadCount, authError, switchUser, updateBalance, refreshUser, refreshNotificationCount }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
}
