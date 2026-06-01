import { useEffect, useState } from "react";
import { getNotifications, markNotificationsRead } from "../../api";
import { useUser } from "../../context/UserContext";

const TYPE_CONFIG = {
  bid_received: { icon: "💰", label: "Bid Received",  color: "var(--green)" },
  bid_accepted: { icon: "✅", label: "Bid Accepted",  color: "var(--green)" },
  outbid:       { icon: "⚡", label: "Outbid",        color: "var(--amber)" },
  listing_expired:{ icon: "⏰", label: "Listing Expired", color: "var(--text-muted)" },
  payout:       { icon: "💸", label: "Payout",        color: "var(--green)" },
};

function timeAgo(ts) {
  const diff = (Date.now() - new Date(ts)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function NotificationDrawer({ onClose }) {
  const { refreshNotificationCount } = useUser();
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications().then((data) => {
      setNotifs(data);
      setLoading(false);
      markNotificationsRead().then(refreshNotificationCount);
    });
  }, []);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.4)" }}
      />
      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "360px",
          background: "var(--surface)",
          borderLeft: "1px solid var(--border-bright)",
          zIndex: 201,
          display: "flex",
          flexDirection: "column",
          animation: "slideIn 0.2s ease",
        }}
      >
        <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>

        {/* Header */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "16px" }}>Notifications</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", fontSize: "18px", lineHeight: 1 }}>×</button>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {loading ? (
            <div style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "12px" }}>loading...</div>
          ) : notifs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔔</div>
              <div className="empty-state-title">No notifications</div>
            </div>
          ) : notifs.map((n) => {
            const cfg = TYPE_CONFIG[n.type] || { icon: "•", label: n.type, color: "var(--text-dim)" };
            return (
              <div
                key={n.notificationId}
                style={{
                  padding: "14px 20px",
                  borderBottom: "1px solid var(--border)",
                  background: n.isRead ? "transparent" : "rgba(74,222,128,0.04)",
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ fontSize: "18px", lineHeight: 1.4 }}>{cfg.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: cfg.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{cfg.label}</span>
                    <span style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{timeAgo(n.createdAt)}</span>
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--text-dim)", lineHeight: 1.4 }}>
                    {n.type === "bid_received" && <>New bid of <span style={{ color: "var(--green)", fontFamily: "var(--font-mono)" }}>${n.payload.amount?.toFixed(2)}</span> on <strong style={{ color: "var(--text)" }}>{n.payload.courseCode}</strong></>}
                    {n.type === "bid_accepted" && <>Your bid of <span style={{ color: "var(--green)", fontFamily: "var(--font-mono)" }}>${n.payload.amount?.toFixed(2)}</span> was accepted for <strong style={{ color: "var(--text)" }}>{n.payload.courseCode}</strong></>}
                    {n.type === "outbid" && <>You were outbid on <strong style={{ color: "var(--text)" }}>{n.payload.courseCode}</strong> — current bid is <span style={{ color: "var(--amber)", fontFamily: "var(--font-mono)" }}>${n.payload.amount?.toFixed(2)}</span></>}
                    {n.type === "listing_expired" && <>{n.payload.courseCode} listing expired</>}
                    {n.type === "payout" && <>You received a payout of <span style={{ color: "var(--green)", fontFamily: "var(--font-mono)" }}>${n.payload.amount?.toFixed(2)}</span></>}
                  </div>
                </div>
                {!n.isRead && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--green)", marginTop: "6px", flexShrink: 0 }} />}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
