import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from "recharts";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border-bright)", borderRadius: "6px", padding: "10px 14px" }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "18px", color: "var(--green)", fontWeight: 600 }}>
        ${payload[0].value.toFixed(2)}
      </div>
      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{label}</div>
    </div>
  );
}

export default function PriceChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="empty-state" style={{ padding: "48px 24px" }}>
        <div className="empty-state-icon">📈</div>
        <div className="empty-state-title">No price history yet</div>
        <div className="empty-state-sub">Price data will appear once transactions complete.</div>
      </div>
    );
  }

  const prices = data.map((d) => d.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const trend = prices[prices.length - 1] - prices[0];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "16px" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "32px", fontWeight: 600, color: "var(--green)" }}>
          ${prices[prices.length - 1].toFixed(2)}
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "14px", color: trend >= 0 ? "var(--green)" : "var(--red)" }}>
          {trend >= 0 ? "▲" : "▼"} ${Math.abs(trend).toFixed(2)} all-time
        </span>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="label"
            tick={{ fontFamily: "var(--font-mono)", fontSize: 10, fill: "var(--text-muted)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontFamily: "var(--font-mono)", fontSize: 10, fill: "var(--text-muted)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v}`}
            domain={[Math.floor(min * 0.85), Math.ceil(max * 1.1)]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="price"
            stroke="var(--green)"
            strokeWidth={2}
            dot={{ r: 3, fill: "var(--green)", strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "var(--green)", stroke: "var(--bg)", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
