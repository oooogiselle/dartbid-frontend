import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTicker } from "../../api";

const styles = {
  wrapper: {
    background: "var(--surface)",
    borderBottom: "1px solid var(--border)",
    overflow: "hidden",
    height: "32px",
    display: "flex",
    alignItems: "center",
  },
  track: {
    display: "flex",
    alignItems: "center",
    gap: "0",
    animation: "tickerScroll 28s linear infinite",
    whiteSpace: "nowrap",
  },
  item: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "0 24px",
    borderRight: "1px solid var(--border)",
    cursor: "pointer",
    height: "32px",
    fontSize: "12px",
    fontFamily: "var(--font-mono)",
    transition: "background 0.12s",
  },
  code: { color: "var(--text)", fontWeight: 600, fontSize: "11px" },
  price: { fontWeight: 500 },
  change: { fontSize: "10px" },
};

// Inject keyframes once
if (typeof document !== "undefined" && !document.getElementById("ticker-style")) {
  const s = document.createElement("style");
  s.id = "ticker-style";
  s.textContent = `
    @keyframes tickerScroll {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
  `;
  document.head.appendChild(s);
}

export default function TickerBanner() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getTicker().then(setItems).catch(() => {});
  }, []);

  if (!items.length) return null;

  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  return (
    <div style={styles.wrapper}>
      <div style={styles.track}>
        {doubled.map((item, i) => {
          const up = item.priceChange > 0;
          const down = item.priceChange < 0;
          const price = item.currentPrice ?? item.lastSalePrice;
          return (
            <div
              key={i}
              style={styles.item}
              onClick={() => navigate(`/class/${item.sectionId}`)}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--card-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span style={styles.code}>{item.courseCode}</span>
              <span
                style={{
                  ...styles.price,
                  color: up ? "var(--green)" : down ? "var(--red)" : "var(--text-dim)",
                }}
              >
                ${price?.toFixed(2)}
              </span>
              {item.priceChange != null && item.priceChange !== 0 && (
                <span
                  style={{
                    ...styles.change,
                    color: up ? "var(--green)" : "var(--red)",
                  }}
                >
                  {up ? "▲" : "▼"} ${Math.abs(item.priceChange).toFixed(2)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
