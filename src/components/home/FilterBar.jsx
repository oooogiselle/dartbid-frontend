import { useState, useEffect } from "react";
import { getDepartments, getDistributives } from "../../api";

const styles = {
  bar: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: "24px",
    padding: "16px",
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
  },
  searchWrap: { position: "relative", flex: "1", minWidth: "200px" },
  searchIcon: { position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "13px", pointerEvents: "none" },
  searchInput: { paddingLeft: "30px" },
};

export default function FilterBar({ onChange }) {
  const [departments, setDepartments] = useState([]);
  const [distributives, setDistributives] = useState([]);
  const [filters, setFilters] = useState({ department: "", distributive: "", minPrice: "", maxPrice: "", search: "" });

  useEffect(() => {
    getDepartments().then(setDepartments);
    getDistributives().then(setDistributives);
  }, []);

  function update(key, value) {
    const next = { ...filters, [key]: value };
    setFilters(next);
    onChange(next);
  }

  function reset() {
    const blank = { department: "", distributive: "", minPrice: "", maxPrice: "", search: "" };
    setFilters(blank);
    onChange(blank);
  }

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div style={styles.bar}>
      {/* Search */}
      <div style={styles.searchWrap}>
        <span style={styles.searchIcon}>⌕</span>
        <input
          className="input"
          style={styles.searchInput}
          placeholder="Search courses, professors…"
          value={filters.search}
          onChange={(e) => update("search", e.target.value)}
        />
      </div>

      {/* Department */}
      <select
        className="input"
        style={{ width: "160px" }}
        value={filters.department}
        onChange={(e) => update("department", e.target.value)}
      >
        <option value="">All Depts</option>
        {departments.map((d) => (
          <option key={d.departmentId} value={d.code}>{d.code}</option>
        ))}
      </select>

      {/* Distributive */}
      <select
        className="input"
        style={{ width: "140px" }}
        value={filters.distributive}
        onChange={(e) => update("distributive", e.target.value)}
      >
        <option value="">All Distribs</option>
        {distributives.map((d) => (
          <option key={d.distributiveId} value={d.code}>{d.code}</option>
        ))}
      </select>

      {/* Price range */}
      <input
        className="input"
        style={{ width: "100px", fontFamily: "var(--font-mono)" }}
        type="number"
        min="0"
        placeholder="Min $"
        value={filters.minPrice}
        onChange={(e) => update("minPrice", e.target.value)}
      />
      <input
        className="input"
        style={{ width: "100px", fontFamily: "var(--font-mono)" }}
        type="number"
        min="0"
        placeholder="Max $"
        value={filters.maxPrice}
        onChange={(e) => update("maxPrice", e.target.value)}
      />

      {hasFilters && (
        <button className="btn btn-ghost btn-sm" onClick={reset}>
          Clear
        </button>
      )}
    </div>
  );
}
