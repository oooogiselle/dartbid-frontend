import { useState, useEffect, useCallback } from "react";
import { getListings } from "../api";
import FilterBar from "../components/home/FilterBar";
import ListingGrid from "../components/home/ListingGrid";
import DepositModal from "../components/shared/DepositModal";

export default function HomePage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
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

  useEffect(() => { fetchListings({}); }, []);

  function handleFilterChange(f) {
    setFilters(f);
    fetchListings(f);
  }

  return (
    <main className="page-content">
      {/* Page header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "28px", lineHeight: 1, marginBottom: "4px" }}>
            Active Listings
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
            {loading ? "Loading…" : `${listings.length} listing${listings.length !== 1 ? "s" : ""} · sorted by bid activity`}
          </p>
        </div>
        <button className="btn btn-ghost" onClick={() => setDepositOpen(true)}>
          + Add Funds
        </button>
      </div>

      <FilterBar onChange={handleFilterChange} />
      <ListingGrid listings={listings} loading={loading} />

      {depositOpen && <DepositModal onClose={() => setDepositOpen(false)} />}
    </main>
  );
}
