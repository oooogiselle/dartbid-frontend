import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser, HARDCODED_STUDENTS } from "../../context/UserContext";
import NotificationDrawer from "./NotificationDrawer";
import DepositModal from "./DepositModal";

const styles = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 32px",
    height: "56px",
    borderBottom: "1px solid var(--border)",
    background: "rgba(6,16,10,0.95)",
    backdropFilter: "blur(8px)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontFamily: "var(--font-display)",
    fontWeight: 800,
    fontSize: "20px",
    color: "var(--green)",
    textDecoration: "none",
    letterSpacing: "-0.02em",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  logoAccent: {
    color: "var(--text-muted)",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  balance: {
    fontFamily: "var(--font-mono)",
    fontSize: "13px",
    color: "var(--green)",
    background: "rgba(74,222,128,0.08)",
    border: "1px solid rgba(74,222,128,0.2)",
    borderRadius: "6px",
    padding: "5px 12px",
    cursor: "pointer",
    transition: "all 0.15s",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  switcher: {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    color: "var(--text)",
    fontFamily: "var(--font-body)",
    fontSize: "13px",
    padding: "5px 28px 5px 10px",
    outline: "none",
    cursor: "pointer",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%237aaa80' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 8px center",
  },
  bellBtn: {
    background: "none",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    color: "var(--text-dim)",
    padding: "5px 10px",
    cursor: "pointer",
    position: "relative",
    fontSize: "15px",
    display: "flex",
    alignItems: "center",
    transition: "all 0.15s",
  },
  badge: {
    position: "absolute",
    top: "-4px",
    right: "-4px",
    background: "var(--green)",
    color: "#06100A",
    borderRadius: "10px",
    fontSize: "9px",
    fontWeight: 700,
    padding: "1px 5px",
    fontFamily: "var(--font-mono)",
  },
  dashLink: {
    textDecoration: "none",
    color: "var(--text-dim)",
    fontSize: "13px",
    fontWeight: 600,
    padding: "5px 12px",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    transition: "all 0.15s",
  },
};

export default function Navbar() {
  const { currentUser, unreadCount, switchUser } = useUser();
  const [notifOpen, setNotifOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(currentUser.email ?? HARDCODED_STUDENTS[0].email);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser.email) setSelectedEmail(currentUser.email);
  }, [currentUser.email]);

  function handleSwitch(e) {
    setSelectedEmail(e.target.value);
    switchUser(e.target.value);
  }

  return (
    <>
      <nav style={styles.nav}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <span>DART</span><span style={styles.logoAccent}>BID</span>
        </Link>

        <div style={styles.right}>
          {/* Dashboard link */}
          <Link to="/dashboard" style={styles.dashLink}>Dashboard</Link>

          {/* Balance — click to deposit */}
          <div
            style={styles.balance}
            onClick={() => setDepositOpen(true)}
            title="Click to deposit funds"
          >
            <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>BAL</span>
            ${parseFloat(currentUser.accountBalance ?? 0).toFixed(2)}
          </div>

          {/* Student switcher */}
          <select
            style={styles.switcher}
            value={selectedEmail}
            onChange={handleSwitch}
          >
            {HARDCODED_STUDENTS.map((s) => (
              <option key={s.email} value={s.email}>
                {s.name}
              </option>
            ))}
          </select>

          {/* Notification bell */}
          <button
            style={styles.bellBtn}
            onClick={() => setNotifOpen(true)}
            title="Notifications"
          >
            🔔
            {unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}
          </button>
        </div>
      </nav>

      {notifOpen && <NotificationDrawer onClose={() => setNotifOpen(false)} />}
      {depositOpen && <DepositModal onClose={() => setDepositOpen(false)} />}
    </>
  );
}
