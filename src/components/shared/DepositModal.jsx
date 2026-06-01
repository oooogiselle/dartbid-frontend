import { useState } from "react";
import { deposit } from "../../api";
import { useUser } from "../../context/UserContext";

const PRESETS = [25, 50, 100, 200];

export default function DepositModal({ onClose }) {
  const { currentUser, updateBalance } = useUser();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function handleDeposit() {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return setError("Enter a valid amount.");
    if (amt > 10000) return setError("Max deposit is $10,000.");
    setError(null);
    setLoading(true);
    try {
      const res = await deposit(amt);
      updateBalance(res.accountBalance);
      setSuccess(true);
      setTimeout(onClose, 1200);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">Add Funds</div>

        <div style={{ marginBottom: "16px", padding: "12px", background: "var(--bg)", borderRadius: "6px", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Current Balance</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "18px", color: "var(--green)", fontWeight: 600 }}>${parseFloat(currentUser.accountBalance ?? 0).toFixed(2)}</span>
        </div>

        {/* Preset buttons */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          {PRESETS.map((p) => (
            <button
              key={p}
              className="btn btn-ghost btn-sm"
              style={{ flex: 1, fontFamily: "var(--font-mono)" }}
              onClick={() => setAmount(String(p))}
            >
              ${p}
            </button>
          ))}
        </div>

        <div className="form-group">
          <label className="form-label">Custom Amount</label>
          <input
            className="input"
            type="number"
            min="1"
            max="10000"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ fontFamily: "var(--font-mono)", fontSize: "16px" }}
          />
        </div>

        {error && <div style={{ color: "var(--red)", fontSize: "12px", marginBottom: "8px" }}>{error}</div>}

        {success && (
          <div style={{ color: "var(--green)", fontSize: "13px", marginBottom: "8px", fontWeight: 600 }}>
            ✓ Deposited ${parseFloat(amount).toFixed(2)} successfully
          </div>
        )}

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={handleDeposit}
            disabled={loading || !amount || parseFloat(amount) <= 0}
          >
            {loading ? "Processing..." : `Deposit $${parseFloat(amount) > 0 ? parseFloat(amount).toFixed(2) : "0.00"}`}
          </button>
        </div>
      </div>
    </div>
  );
}
