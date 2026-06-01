import { useState } from "react";
import { cancelListing, acceptBid } from "../../api";
import { useUser } from "../../context/UserContext";

// ── AccountSummary ────────────────────────────────────────────────────────────
export function AccountSummary({ transactions, onDeposit }) {
  const { currentUser } = useUser();
  const spent  = transactions.filter(t => t.role === "bought").reduce((s, t) => s + t.finalPrice, 0);
  const earned = transactions.filter(t => t.role === "sold").reduce((s, t) => s + t.finalPrice, 0);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
      {[
        { label: "Available Balance", value: `$${parseFloat(currentUser.accountBalance ?? 0).toFixed(2)}`, color: "var(--green)", action: onDeposit, actionLabel: "+ Deposit" },
        { label: "Total Spent",       value: `$${spent.toFixed(2)}`,                       color: "var(--text)" },
        { label: "Total Earned",      value: `$${earned.toFixed(2)}`,                      color: "var(--green)" },
        { label: "Year",              value: currentUser.yearStanding,                      color: "var(--text)", sub: currentUser.major },
      ].map(stat => (
        <div key={stat.label} className="card" style={{ padding: "16px" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: "6px" }}>
            {stat.label}
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "20px", color: stat.color, fontWeight: 600 }}>{stat.value}</div>
          {stat.sub && <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{stat.sub}</div>}
          {stat.action && (
            <button className="btn btn-ghost btn-xs" style={{ marginTop: "8px" }} onClick={stat.action}>{stat.actionLabel}</button>
          )}
        </div>
      ))}
    </div>
  );
}

// ── ActiveListings (seller view) ─────────────────────────────────────────────
export function ActiveListings({ listings, onRefresh }) {
  const [cancelling, setCancelling] = useState(null);

  async function handleCancel(listingId) {
    setCancelling(listingId);
    try {
      await cancelListing(listingId);
      onRefresh?.();
    } catch (e) {
      alert(e.message);
    } finally {
      setCancelling(null);
    }
  }

  const active = listings.filter(l => l.status === "active");

  if (active.length === 0) {
    return <div className="empty-state"><div className="empty-state-icon">📋</div><div className="empty-state-title">No active listings</div><div className="empty-state-sub">Create a listing to sell a course spot.</div></div>;
  }

  return (
    <table className="table">
      <thead>
        <tr><th>Section</th><th>Min Ask</th><th>Top Bid</th><th>Bids</th><th>Expires</th><th></th></tr>
      </thead>
      <tbody>
        {active.map(l => (
          <tr key={l.listingId}>
            <td>
              <div style={{ fontWeight: 600, color: "var(--text)" }}>{l.section?.courseCode}</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{l.section?.title}</div>
            </td>
            <td style={{ fontFamily: "var(--font-mono)" }}>${l.minPrice.toFixed(2)}</td>
            <td style={{ fontFamily: "var(--font-mono)", color: l.currentHighestBid ? "var(--green)" : "var(--text-muted)" }}>
              {l.currentHighestBid ? `$${l.currentHighestBid.toFixed(2)}` : "—"}
            </td>
            <td style={{ fontFamily: "var(--font-mono)" }}>{l.bidCount}</td>
            <td style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}>
              {new Date(l.expiresAt).toLocaleDateString()}
            </td>
            <td>
              <button className="btn btn-danger btn-xs" onClick={() => handleCancel(l.listingId)} disabled={cancelling === l.listingId}>
                {cancelling === l.listingId ? "…" : "Cancel"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ── BidsReceived (seller accepts incoming bids) ───────────────────────────────
export function BidsReceived({ listings, onRefresh }) {
  const [accepting, setAccepting] = useState(null);

  async function handleAccept(bidId) {
    if (!window.confirm("Accept this bid? This will complete the transaction and transfer enrollment.")) return;
    setAccepting(bidId);
    try {
      await acceptBid(bidId);
      onRefresh?.();
    } catch (e) {
      alert(e.message);
    } finally {
      setAccepting(null);
    }
  }

  const activeBids = listings
    .filter(l => l.status === "active")
    .flatMap(l =>
      (l.bids || []).map(b => ({ ...b, listing: l, section: l.section }))
    )
    .sort((a, b) => b.amount - a.amount);

  if (activeBids.length === 0) {
    return <div className="empty-state"><div className="empty-state-icon">📬</div><div className="empty-state-title">No bids received</div><div className="empty-state-sub">Incoming bids on your listings will appear here.</div></div>;
  }

  return (
    <table className="table">
      <thead>
        <tr><th>Section</th><th>Bid Amount</th><th>Status</th><th>Received</th><th></th></tr>
      </thead>
      <tbody>
        {activeBids.map(b => (
          <tr key={b.bidId}>
            <td>
              <div style={{ fontWeight: 600, color: "var(--text)" }}>{b.section?.courseCode}</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{b.section?.title}</div>
            </td>
            <td style={{ fontFamily: "var(--font-mono)", color: b.status === "pending" ? "var(--green)" : "var(--text-muted)", fontSize: "15px", fontWeight: 600 }}>
              ${b.amount.toFixed(2)}
            </td>
            <td>
              <span className={`badge ${b.status === "pending" ? "badge-green" : b.status === "outbid" ? "badge-muted" : "badge-amber"}`}>
                {b.status}
              </span>
            </td>
            <td style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}>
              {new Date(b.createdAt).toLocaleDateString()}
            </td>
            <td>
              {b.status === "pending" && (
                <button className="btn btn-primary btn-xs" onClick={() => handleAccept(b.bidId)} disabled={accepting === b.bidId}>
                  {accepting === b.bidId ? "…" : "Accept"}
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ── BidsPlaced (buyer view) ───────────────────────────────────────────────────
export function BidsPlaced({ bids }) {
  if (!bids || bids.length === 0) {
    return <div className="empty-state"><div className="empty-state-icon">🏷️</div><div className="empty-state-title">No bids placed</div><div className="empty-state-sub">Bids you place on listings will appear here.</div></div>;
  }

  return (
    <table className="table">
      <thead>
        <tr><th>Section</th><th>Your Bid</th><th>Status</th><th>Placed</th></tr>
      </thead>
      <tbody>
        {bids.map(b => (
          <tr key={b.bidId} style={{ background: b.status === "outbid" ? "rgba(248,113,113,0.04)" : "transparent" }}>
            <td>
              <div style={{ fontWeight: 600, color: "var(--text)" }}>{b.section?.courseCode}</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{b.section?.title}</div>
            </td>
            <td style={{ fontFamily: "var(--font-mono)", fontSize: "15px", fontWeight: 600, color: b.status === "accepted" ? "var(--green)" : b.status === "outbid" ? "var(--red)" : "var(--text-dim)" }}>
              ${b.amount.toFixed(2)}
            </td>
            <td>
              <span className={`badge ${
                b.status === "accepted" ? "badge-green" :
                b.status === "outbid"   ? "badge-red"   :
                b.status === "pending"  ? "badge-amber"  : "badge-muted"
              }`}>
                {b.status}
              </span>
            </td>
            <td style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}>
              {new Date(b.createdAt).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ── TransactionHistory ────────────────────────────────────────────────────────
export function TransactionHistory({ transactions }) {
  if (!transactions || transactions.length === 0) {
    return <div className="empty-state"><div className="empty-state-icon">🧾</div><div className="empty-state-title">No completed transactions</div><div className="empty-state-sub">Completed buys and sells will appear here.</div></div>;
  }

  return (
    <table className="table">
      <thead>
        <tr><th>Section</th><th>Role</th><th>Final Price</th><th>Date</th></tr>
      </thead>
      <tbody>
        {transactions.map(t => (
          <tr key={t.transactionId}>
            <td>
              <div style={{ fontWeight: 600, color: "var(--text)" }}>{t.section?.courseCode}</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{t.section?.title}</div>
            </td>
            <td>
              <span className={`badge ${t.role === "bought" ? "badge-amber" : "badge-green"}`}>
                {t.role}
              </span>
            </td>
            <td style={{ fontFamily: "var(--font-mono)", fontSize: "15px", fontWeight: 600, color: t.role === "sold" ? "var(--green)" : "var(--text)" }}>
              ${t.finalPrice.toFixed(2)}
            </td>
            <td style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}>
              {new Date(t.createdAt).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
