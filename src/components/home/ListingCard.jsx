import { useNavigate } from "react-router-dom";

function timeRemaining(expiresAt) {
  const diff = new Date(expiresAt) - Date.now();
  if (diff <= 0) return "Expired";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h > 48) return `${Math.floor(h / 24)}d remaining`;
  return `${h}h ${m}m remaining`;
}

export default function ListingCard({ listing }) {
  const navigate = useNavigate();
  const s = listing.section;
  const hasBids = listing.bidCount > 0;
  const displayPrice = listing.currentHighestBid ?? listing.minPrice;
  const isHot = listing.bidCount >= 3;

  return (
    <div
      onClick={() => navigate(`/class/${listing.sectionId}`)}
      style={{
        background: "var(--card)",
        border: `1px solid ${isHot ? "rgba(74,222,128,0.25)" : "var(--border)"}`,
        borderRadius: "var(--radius-lg)",
        padding: "18px",
        cursor: "pointer",
        transition: "all 0.15s",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--border-bright)";
        e.currentTarget.style.background = "var(--card-hover)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = isHot ? "rgba(74,222,128,0.25)" : "var(--border)";
        e.currentTarget.style.background = "var(--card)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Hot badge */}
      {isHot && (
        <div style={{ position: "absolute", top: "12px", right: "12px" }}>
          <span className="badge badge-green">🔥 Hot</span>
        </div>
      )}

      {/* Dept tag */}
      <div style={{ marginBottom: "10px" }}>
        <span className="badge badge-muted">{s?.deptCode}</span>
        {s?.distributive && (
          <span className="badge badge-muted" style={{ marginLeft: "4px" }}>{s.distributive}</span>
        )}
      </div>

      {/* Course code */}
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "22px", lineHeight: 1, marginBottom: "4px" }}>
        {s?.courseCode}
      </div>

      {/* Title */}
      <div style={{ fontSize: "12px", color: "var(--text-dim)", marginBottom: "6px", lineHeight: 1.4, minHeight: "32px" }}>
        {s?.title}
      </div>

      {/* Professor */}
      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "16px" }}>
        {s?.professor} · {s?.meetingTime}
      </div>

      <hr className="divider" />

      {/* Price row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: "2px" }}>
            {hasBids ? "Top Bid" : "Min Ask"}
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "24px", fontWeight: 600, color: hasBids ? "var(--green)" : "var(--text-dim)" }}>
            ${displayPrice.toFixed(2)}
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "2px" }}>
            {listing.bidCount} bid{listing.bidCount !== 1 ? "s" : ""}
          </div>
          <div style={{ fontSize: "11px", color: hasBids ? "var(--amber)" : "var(--text-muted)" }}>
            {timeRemaining(listing.expiresAt)}
          </div>
        </div>
      </div>
    </div>
  );
}
