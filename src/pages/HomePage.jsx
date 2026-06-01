import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getListings, getSections } from "../api";
import FilterBar from "../components/home/FilterBar";
import ListingGrid from "../components/home/ListingGrid";
import DepositModal from "../components/shared/DepositModal";

export default function HomePage() {
  const navigate = useNavigate();
  const [view, setView]           = useState("listings");
  const [listings, setListings]   = useState([]);
  const [sections, setSections]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filters, setFilters]     = useState({});
  const [depositOpen, setDepositOpen] = useState(false);

  const fetchListings = useCallback(async (f = filters) => {
    setLoading(true);
    try {
      const data = await getListings(f);
      setListings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSections = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSections();
      setSections(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchListings({}); }, []);

  function handleViewSwitch(v) {
    setView(v);
    if (v === "listings") fetchListings(filters);
    else fetchSections();
  }

  function handleFilterChange(f) {
    setFilters(f);
    fetchListings(f);
  }

  const isFull = (s) => s.currentEnrollment >= s.enrollmentCap;

  return (
    <main className="page-content">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "28px", lineHeight: 1, marginBottom: "4px" }}>
            {view === "listings" ? "Active Listings" : "All Classes"}
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
            {loading ? "Loading…" : view === "listings"
              ? `${listings.length} listing${listings.length !== 1 ? "s" : ""} · sorted by bid activity`
              : `${sections.length} sections · Spring 2026`}
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ display: "flex", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
            {["listings", "all"].map((v) => (
              <button
                key={v}
                onClick={() => handleViewSwitch(v)}
                style={{
                  padding: "6px 16px",
                  fontSize: "12px",
                  fontWeight: 600,
                  fontFamily: "var(--font-body)",
                  cursor: "pointer",
                  border: "none",
                  background: view === v ? "var(--green)" : "var(--card)",
                  color: view === v ? "#06100A" : "var(--text-dim)",
                  transition: "all 0.15s",
                }}
              >
                {v === "listings" ? "Listings" : "All Classes"}
              </button>
            ))}
          </div>
          <button className="btn btn-ghost" onClick={() => setDepositOpen(true)}>+ Add Funds</button>
        </div>
      </div>

      {view === "listings" ? (
        <>
          <FilterBar onChange={handleFilterChange} />
          <ListingGrid listings={listings} loading={loading} />
        </>
      ) : (
        <div className="grid-3" style={{ gap: "16px" }}>
          {loading
            ? [1,2,3,4,5,6].map(i => <div key={i} className="card loading" style={{ height: "140px" }} />)
            : sections.map(s => (
              <div
                key={s.sectionId}
                className="card"
                style={{ cursor: "pointer", transition: "background 0.15s" }}
                onClick={() => navigate(`/class/${s.sectionId}`)}
                onMouseEnter={e => e.currentTarget.style.background = "var(--card-hover)"}
                onMouseLeave={e => e.currentTarget.style.background = ""}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    <span className="badge badge-muted">{s.departmentCode}</span>
                    {s.distributiveCode && <span className="badge badge-muted">{s.distributiveCode}</span>}
                  </div>
                  {isFull(s) && <span className="badge badge-red">FULL</span>}
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "17px", color: "var(--text)", marginBottom: "2px", letterSpacing: "-0.01em" }}>
                  {s.courseCode}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-dim)", marginBottom: "8px" }}>{s.title}</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "2px", fontFamily: "var(--font-mono)" }}>
                  {s.meetingTime && <span>· {s.meetingTime}</span>}
                  {s.professorName && <span>· {s.professorName}</span>}
                  <span style={{ color: isFull(s) ? "var(--red)" : "var(--text-muted)" }}>
                    · {s.currentEnrollment}/{s.enrollmentCap} enrolled
                  </span>
                </div>
              </div>
            ))
          }
        </div>
      )}

      {depositOpen && <DepositModal onClose={() => setDepositOpen(false)} />}
    </main>
  );
}
