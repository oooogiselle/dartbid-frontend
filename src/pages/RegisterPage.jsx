import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const YEARS = ["freshman", "sophomore", "junior", "senior"];

export default function RegisterPage() {
  const { registerAndLogin } = useUser();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", yearStanding: "", major: "" });
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(false);

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await registerAndLogin(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error ?? "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 88px)", padding: "24px" }}>
      <div className="card" style={{ width: "100%", maxWidth: "400px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "28px", letterSpacing: "-0.02em" }}>
            <span style={{ color: "var(--green)" }}>DART</span>
            <span style={{ color: "var(--text-muted)" }}>BID</span>
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: "12px", fontFamily: "var(--font-mono)", marginTop: "4px" }}>
            create account
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="input" type="text" placeholder="Alice Chen" value={form.name}
              onChange={(e) => update("name", e.target.value)} required autoFocus />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="input" type="email" placeholder="you@dartmouth.edu" value={form.email}
              onChange={(e) => update("email", e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="input" type="password" placeholder="••••••••" value={form.password}
              onChange={(e) => update("password", e.target.value)} required />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="form-group">
              <label className="form-label">Year</label>
              <select className="input" value={form.yearStanding}
                onChange={(e) => update("yearStanding", e.target.value)} required>
                <option value="" disabled>Select…</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y.charAt(0).toUpperCase() + y.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Major</label>
              <input className="input" type="text" placeholder="e.g. CS" value={form.major}
                onChange={(e) => update("major", e.target.value)} />
            </div>
          </div>

          {error && (
            <div style={{ color: "var(--red)", fontSize: "13px", marginBottom: "16px", fontFamily: "var(--font-mono)" }}>
              {error}
            </div>
          )}

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
            style={{ width: "100%", justifyContent: "center" }}
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--green)", textDecoration: "none" }}>
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
