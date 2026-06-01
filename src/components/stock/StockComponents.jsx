// CourseHeader
export function CourseHeader({ section }) {
  if (!section) return null;
  return (
    <div style={{ marginBottom: "24px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
            <span className="badge badge-muted">{section.deptCode}</span>
            {section.distributive && <span className="badge badge-green">{section.distributive}</span>}
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "32px", lineHeight: 1, marginBottom: "6px" }}>
            {section.courseCode}
          </h1>
          <div style={{ fontSize: "15px", color: "var(--text-dim)", marginBottom: "6px" }}>{section.title}</div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <span>{section.professor}</span>
            <span>{section.meetingTime}</span>
            <span>{section.location}</span>
            <span style={{ color: section.currentEnrollment >= section.enrollmentCap ? "var(--red)" : "var(--text-muted)" }}>
              {section.currentEnrollment}/{section.enrollmentCap} enrolled
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// StatsBar
export function StatsBar({ history }) {
  if (!history || history.length === 0) return null;
  const prices = history.map((h) => h.price);
  const high = Math.max(...prices);
  const low  = Math.min(...prices);
  const last = prices[prices.length - 1];
  const count = prices.length;

  const stats = [
    { label: "Last Sale",    value: `$${last.toFixed(2)}`,  color: "var(--green)" },
    { label: "All-Time High",value: `$${high.toFixed(2)}`,  color: "var(--green)" },
    { label: "All-Time Low", value: `$${low.toFixed(2)}`,   color: "var(--red)"   },
    { label: "Transactions", value: count,                   color: "var(--text)"  },
  ];

  return (
    <div className="grid-4" style={{ marginBottom: "24px" }}>
      {stats.map((s) => (
        <div key={s.label} className="card" style={{ padding: "16px" }}>
          <div className="stat-label">{s.label}</div>
          <div className="stat-value" style={{ color: s.color, fontSize: "20px", marginTop: "4px" }}>{s.value}</div>
        </div>
      ))}
    </div>
  );
}

// ActiveListingsTable — anonymized bids for a section
export function ActiveListingsTable({ listing }) {
  if (!listing) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📋</div>
        <div className="empty-state-title">No active listing</div>
        <div className="empty-state-sub">There's no active listing for this section right now.</div>
      </div>
    );
  }

  const bids = listing.bids || [];
  const sortedBids = [...bids].sort((a, b) => b.amount - a.amount);

  return (
    <div>
      <div className="card-header">
        <span className="card-title">Current Listing</span>
        <span className="badge badge-green">Active</span>
      </div>

      <div style={{ display: "flex", gap: "24px", marginBottom: "16px", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Min Ask</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "18px", color: "var(--text-dim)", marginTop: "2px" }}>${listing.minPrice.toFixed(2)}</div>
        </div>
        <div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Top Bid</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "18px", color: "var(--green)", marginTop: "2px" }}>
            {listing.currentHighestBid ? `$${listing.currentHighestBid.toFixed(2)}` : "—"}
          </div>
        </div>
        <div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Bids</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "18px", color: "var(--text)", marginTop: "2px" }}>{listing.bidCount}</div>
        </div>
      </div>

      {sortedBids.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {sortedBids.map((bid, i) => (
              <tr key={bid.bidId}>
                <td style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{i + 1}</td>
                <td style={{ fontFamily: "var(--font-mono)", color: i === 0 ? "var(--green)" : "var(--text-dim)", fontWeight: i === 0 ? 600 : 400 }}>
                  ${bid.amount.toFixed(2)}
                </td>
                <td>
                  <span className={`badge ${bid.status === "pending" ? "badge-green" : "badge-muted"}`}>
                    {bid.status}
                  </span>
                </td>
                <td style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted)" }}>
                  {new Date(bid.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
