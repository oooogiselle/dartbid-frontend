import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
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
  userName: {
    fontFamily: "var(--font-body)",
    fontSize: "13px",
    color: "var(--text-dim)",
    padding: "5px 10px",
    border: "1px solid var(--border)",
    borderRadius: "6px",
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
  const { currentUser, unreadCount, logout } = useUser();
  const [notifOpen, setNotifOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  if (!currentUser) return null;

  return (
    <>
      <nav style={styles.nav}>
        <Link to="/" style={styles.logo}>
          <span>DART</span><span style={styles.logoAccent}>BID</span>
        </Link>

        <div style={styles.right}>
          <Link to="/" style={styles.dashLink}>Listings</Link>
          <Link to="/dashboard" style={styles.dashLink}>Dashboard</Link>

          <div
            style={styles.balance}
            onClick={() => setDepositOpen(true)}
            title="Click to deposit funds"
          >
            <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>BAL</span>
            ${parseFloat(currentUser.accountBalance ?? 0).toFixed(2)}
          </div>

          <div style={styles.userName}>{currentUser.name}</div>

          <button
            style={styles.bellBtn}
            onClick={() => setNotifOpen(true)}
            title="Notifications"
          >
            🔔
            {unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}
          </button>

          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {notifOpen  && <NotificationDrawer onClose={() => setNotifOpen(false)} />}
      {depositOpen && <DepositModal onClose={() => setDepositOpen(false)} />}
    </>
  );
}
