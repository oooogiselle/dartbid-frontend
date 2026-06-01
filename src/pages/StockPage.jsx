import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSection } from "../api";
import { useUser } from "../context/UserContext";
import PriceChart from "../components/stock/PriceChart";
import BidForm from "../components/stock/BidForm";
import { CourseHeader, StatsBar, ActiveListingsTable } from "../components/stock/StockComponents";

export default function StockPage() {
  const { sectionId } = useParams();
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSection = useCallback(async () => {
    try {
      const res = await getSection(sectionId);
      setData(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [sectionId]);

  useEffect(() => {
    setLoading(true);
    fetchSection();
  }, [sectionId]);

  if (loading) {
    return (
      <main className="page-content">
        <div className="card loading" style={{ height: "80px", marginBottom: "16px" }} />
        <div className="grid-4" style={{ marginBottom: "24px" }}>
          {[1,2,3,4].map(i => <div key={i} className="card loading" style={{ height: "72px" }} />)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px" }}>
          <div className="card loading" style={{ height: "320px" }} />
          <div className="card loading" style={{ height: "320px" }} />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-content">
        <div className="empty-state">
          <div className="empty-state-icon">⚠️</div>
          <div className="empty-state-title">Section not found</div>
          <div className="empty-state-sub">{error}</div>
          <button className="btn btn-ghost" style={{ marginTop: "16px" }} onClick={() => navigate("/")}>
            Back to Listings
          </button>
        </div>
      </main>
    );
  }

  const listing = data?.activeListing;
  const history = data?.priceHistory || [];

  return (
    <main className="page-content">
      {/* Back */}
      <button
        className="btn btn-ghost btn-sm"
        style={{ marginBottom: "20px" }}
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <CourseHeader section={data} />
      <StatsBar history={history} />

      {/* Main content: chart left, bid form right */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px", alignItems: "start" }}>
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Price chart */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Price History</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted)" }}>
                {history.length} transaction{history.length !== 1 ? "s" : ""}
              </span>
            </div>
            <PriceChart data={history} />
          </div>

          {/* Active listing + bid table */}
          <div className="card">
            <ActiveListingsTable listing={listing} />
          </div>
        </div>

        {/* Right column — bid form */}
        <div>
          <BidForm
            listing={listing}
            currentUserId={currentUser.studentId}
            onBidPlaced={fetchSection}
          />
        </div>
      </div>
    </main>
  );
}
