import { useState, useEffect } from "react";
import { getMyEnrollments, createListing, getMyListings } from "../../api";

export default function CreateListingModal({ onClose, onSuccess }) {
  const [enrollments, setEnrollments] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [sectionId, setSectionId] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getMyEnrollments(), getMyListings()]).then(([enr, lst]) => {
      setEnrollments(enr);
      setMyListings(lst);
      setFetchLoading(false);
    });
  }, []);

  // Filter out sections that already have an active listing
  const activeListedIds = new Set(
    myListings.filter((l) => l.status === "active").map((l) => l.sectionId)
  );
  const available = enrollments.filter((s) => !activeListedIds.has(s.sectionId));

  async function handleSubmit() {
    if (!sectionId) return setError("Select a section.");
    const price = parseFloat(minPrice);
    if (!price || price <= 0) return setError("Enter a valid minimum price.");
    setError(null);
    setLoading(true);
    try {
      await createListing({ sectionId: parseInt(sectionId), minPrice: price });
      onSuccess?.();
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">Create Listing</div>

        <div className="form-group">
          <label className="form-label">Section to Sell</label>
          {fetchLoading ? (
            <div style={{ color: "var(--text-muted)", fontSize: "13px", padding: "8px 0" }}>Loading enrollments...</div>
          ) : available.length === 0 ? (
            <div style={{ color: "var(--text-muted)", fontSize: "13px", padding: "8px 0" }}>
              No eligible sections — you must be enrolled and not already have an active listing.
            </div>
          ) : (
            <select className="input" value={sectionId} onChange={(e) => setSectionId(e.target.value)}>
              <option value="">Select a section…</option>
              {available.map((s) => (
                <option key={s.sectionId} value={s.sectionId}>
                  {s.courseCode} — {s.title}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Minimum Ask Price</label>
          <input
            className="input"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            style={{ fontFamily: "var(--font-mono)", fontSize: "15px" }}
          />
          <div className="form-hint">
            The first bid must meet or exceed this price. Bidding window closes May 30, 2026.
          </div>
        </div>

        {error && <div style={{ color: "var(--red)", fontSize: "12px", marginBottom: "8px" }}>{error}</div>}

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading || !sectionId || !minPrice || available.length === 0}
          >
            {loading ? "Creating..." : "List Section"}
          </button>
        </div>
      </div>
    </div>
  );
}
