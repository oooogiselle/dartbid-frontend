import ListingCard from "./ListingCard";

export default function ListingGrid({ listings, loading }) {
  if (loading) {
    return (
      <div className="grid-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card loading" style={{ height: "220px" }} />
        ))}
      </div>
    );
  }

  if (!listings || listings.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📋</div>
        <div className="empty-state-title">No active listings</div>
        <div className="empty-state-sub">Try adjusting your filters, or check back later.</div>
      </div>
    );
  }

  return (
    <div className="grid-3">
      {listings.map((l) => (
        <ListingCard key={l.listingId} listing={l} />
      ))}
    </div>
  );
}
