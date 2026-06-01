import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function LoginPage() {
  const { loginWithCredentials } = useUser();
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginWithCredentials(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error ?? "Invalid email or password.");
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
            course marketplace
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="input"
              type="email"
              placeholder="you@dartmouth.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "var(--text-muted)" }}>
          No account?{" "}
          <Link to="/register" style={{ color: "var(--green)", textDecoration: "none" }}>
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}
