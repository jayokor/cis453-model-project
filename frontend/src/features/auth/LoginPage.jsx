import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Login failed";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={logoRowStyle}>
          <span style={{ fontSize: "1.5em", fontWeight: 800 }}>Mavericks Food Delivery</span>
        </div>
        <h2 style={{ marginTop: 0, marginBottom: 16 }}>Sign In</h2>

        {error ? (
          <div style={{ marginBottom: 12, color: "#ff6b6b", fontSize: "0.95em" }}>{error}</div>
        ) : null}

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <label style={labelStyle}>
            <span>Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              autoComplete="email"
              required
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            <span>Password</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
              required
              style={inputStyle}
            />
          </label>

          <button disabled={submitting} style={btnStyle}>
            {submitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <div style={{ marginTop: 14, textAlign: "center", opacity: 0.8, fontSize: "0.9em" }}>
          No account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "calc(100vh - 60px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
};

const cardStyle = {
  backgroundColor: "#282c34",
  borderRadius: 12,
  padding: "32px 28px",
  width: "100%",
  maxWidth: 420,
  boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
};

const logoRowStyle = {
  textAlign: "center",
  marginBottom: 20,
  color: "white",
};

const labelStyle = {
  display: "grid",
  gap: 6,
  fontSize: "0.95em",
};

const inputStyle = {
  padding: "9px 10px",
  borderRadius: 6,
  border: "1px solid rgba(255,255,255,0.2)",
  backgroundColor: "rgba(255,255,255,0.07)",
  color: "white",
  fontSize: "1em",
};

const btnStyle = {
  marginTop: 4,
  padding: "10px 12px",
  backgroundColor: "#61dafb",
  color: "#282c34",
  border: "none",
  borderRadius: 8,
  fontWeight: 700,
  fontSize: "1em",
  cursor: "pointer",
};