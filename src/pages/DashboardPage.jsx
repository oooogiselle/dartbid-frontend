import { useState, useEffect, useCallback } from "react";
import { getMyListings, getMyBids, getMyTransactions } from "../api";
import { useUser } from "../context/UserContext";
import CreateListingModal from "../components/shared/CreateListingModal";
import DepositModal from "../components/shared/DepositModal";
import {
  AccountSummary,
  ActiveListings,
  BidsReceived,
  BidsPlaced,
  TransactionHistory,
} from "../components/dashboard/DashComponents";

const TABS = [
  { key: "listings",     label: "My Listings"  },
  { key: "received",     label: "Bids Received" },
  { key: "placed",       label: "Bids Placed"   },
  { key: "transactions", label: "History"       },
];

export default function DashboardPage() {
  const { currentUser } = useUser();
  const [tab, setTab] = useState("listings");
  const [listings, setListings]       = useState([]);
  const [bids, setBids]               = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [createOpen, setCreateOpen]   = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [l, b, t] = await Promise.all([getMyListings(), getMyBids(), getMyTransactions()]);
      setListings(l);
      setBids(b);
      setTransactions(t);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [currentUser.studentId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Badge counts for tabs
  const activeBidsReceived = listings.filter(l => l.status === "active").flatMap(l => (l.bids || []).filter(b => b.status === "pending")).length;
  const activeBidsPlaced   = bids.filter(b => b.status === "pending").length;

  function tabLabel(t) {
    if (t.key === "received" && activeBidsReceived > 0) return `${t.label} (${activeBidsReceived})`;
    if (t.key === "placed"   && activeBidsPlaced   > 0) return `${t.label} (${activeBidsPlaced})`;
    return t.label;
  }

  return (
    <main className="page-content">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "28px", lineHeight: 1, marginBottom: "4px" }}>
            Dashboard
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>{currentUser.name} · {currentUser.yearStanding}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setCreateOpen(true)}>
          + Create Listing
        </button>
      </div>

      {/* Account summary */}
      <AccountSummary transactions={transactions} onDeposit={() => setDepositOpen(true)} />

      {/* Tabs */}
      <div className="tabs">
        {TABS.map(t => (
          <button
            key={t.key}
            className={`tab ${tab === t.key ? "active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {tabLabel(t)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="card">
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-muted)" }}>
            loading...
          </div>
        ) : (
          <>
            {tab === "listings"     && <ActiveListings     listings={listings}         onRefresh={fetchAll} />}
            {tab === "received"     && <BidsReceived        listings={listings}         onRefresh={fetchAll} />}
            {tab === "placed"       && <BidsPlaced          bids={bids} />}
            {tab === "transactions" && <TransactionHistory  transactions={transactions} />}
          </>
        )}
      </div>

      {createOpen  && <CreateListingModal onClose={() => setCreateOpen(false)} onSuccess={fetchAll} />}
      {depositOpen && <DepositModal        onClose={() => setDepositOpen(false)} />}
    </main>
  );
}
