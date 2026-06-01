import { useState } from "react";
import { placeBid } from "../../api";
import { useUser } from "../../context/UserContext";

export default function BidForm({ listing, currentUserId, onBidPlaced }) {
  const { currentUser, updateBalance } = useUser();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!listing) return null;

  const minBid = listing.minNextBid ?? listing.minPrice;
  const balance = currentUser.accountBalance;

  // Check if user can bid
  const isOwnListing = listing.sellerId === currentUserId; // sellerId stripped from public; always false on stock page
  const myActiveBid = listing.bids?.find(
    (b) => b.buyerId === currentUserId && b.status === "pending"
  );

  async function handleBid() {
    const amt = parseFloat(amount);
    if (!amt || isNaN(amt)) return setError("Enter a valid bid amount.");
    if (amt < minBid) return setError(`Bid must be at least $${minBid.toFixed(2)}.`);
    if (amt > balance) return setError(`Insufficient balance. You have $${balance.toFixed(2)}.`);

    setError(null);
    setLoading(true);
    try {
      await placeBid({ listingId: listing.listingId, amount: amt });
      updateBalance(parseFloat((balance - amt).toFixed(2)));
      setSuccess(true);
      setAmount("");
      onBidPlaced?.();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div style={{ padding: "20px", background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: "var(--radius-lg)", textAlign: "center" }}>
        <div style={{ fontSize: "24px", marginBottom: "8px" }}>✓</div>
        <div style={{ fontWeight: 600, color: "var(--green)", marginBottom: "4px" }}>Bid Placed!</div>
        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Funds are held. You'll be notified if outbid.</div>
        <button className="btn btn-ghost btn-sm" style={{ marginTop: "12px" }} onClick={() => { setSuccess(false); onBidPlaced?.(); }}>
          Place Another
        </button>
      </div>
    );
  }

  if (myActiveBid) {
    return (
      <div style={{ padding: "20px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)" }}>
        <div className="card-title" style={{ marginBottom: "12px" }}>Your Active Bid</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "28px", color: "var(--amber)", fontWeight: 600 }}>
          ${myActiveBid.amount.toFixed(2)}
        </div>
        <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
          Funds held · {myActiveBid.status}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", background: "var(--card)", border: "1px solid var(--border-bright)", borderRadius: "var(--radius-lg)" }}>
      <div className="card-title" style={{ marginBottom: "16px" }}>Place a Bid</div>

      <div style={{ marginBottom: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
          <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>
            Min Bid
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "14px", color: "var(--green)" }}>
            ${minBid.toFixed(2)}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>
            Balance
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "14px", color: balance > minBid ? "var(--text-dim)" : "var(--red)" }}>
            ${balance.toFixed(2)}
          </span>
        </div>
      </div>

      <hr className="divider" />

      <div className="form-group">
        <input
          className="input"
          type="number"
          min={minBid}
          max={balance}
          step="0.01"
          placeholder={`$${minBid.toFixed(2)} or more`}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ fontFamily: "var(--font-mono)", fontSize: "18px", textAlign: "center", padding: "12px" }}
        />
      </div>

      {/* Quick bid buttons */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
        {[minBid, minBid + 5, minBid + 15, minBid + 30].filter(v => v <= balance).map((v) => (
          <button
            key={v}
            className="btn btn-ghost btn-xs"
            style={{ flex: 1, fontFamily: "var(--font-mono)" }}
            onClick={() => setAmount(v.toFixed(2))}
          >
            ${v.toFixed(0)}
          </button>
        ))}
      </div>

      {error && <div style={{ color: "var(--red)", fontSize: "12px", marginBottom: "10px" }}>{error}</div>}

      <button
        className="btn btn-primary"
        style={{ width: "100%", justifyContent: "center", padding: "12px" }}
        onClick={handleBid}
        disabled={loading || !amount || parseFloat(amount) < minBid || parseFloat(amount) > balance}
      >
        {loading ? "Placing Bid…" : `Bid ${amount ? `$${parseFloat(amount).toFixed(2)}` : ""}`}
      </button>

      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "8px", textAlign: "center" }}>
        Funds are held immediately. Refunded if outbid.
      </div>
    </div>
  );
}
