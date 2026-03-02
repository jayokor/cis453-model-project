import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import logo from "../assets/MavericksLogo.png";

export default function NavBar() {
  const { user, role, isAuthed, logout } = useAuth();

  return (
    <div
      style={{
        padding: "10px 20px",
        backgroundColor: "#282c34",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
          }}
        >
          <img src={logo} alt="Mavericks Logo" style={{ height: 36, width: 36, objectFit: "contain" }} />
          <span style={{ fontWeight: 800, fontSize: "1.1em", color: "white" }}>
            Mavericks Food Delivery
          </span>
        </Link>

        {isAuthed && role === "CUSTOMER" ? (
          <>
            <Link to="/" style={{ color: "rgba(255,255,255,0.85)" }}>Restaurants</Link>
            <Link to="/cart" style={{ color: "rgba(255,255,255,0.85)" }}>Cart</Link>
            <Link to="/orders" style={{ color: "rgba(255,255,255,0.85)" }}>My Orders</Link>
          </>
        ) : null}

        {isAuthed && role === "RESTAURANT" ? (
          <Link to="/restaurant" style={{ color: "rgba(255,255,255,0.85)" }}>Dashboard</Link>
        ) : null}

        {isAuthed && role === "ADMIN" ? (
          <Link to="/admin" style={{ color: "rgba(255,255,255,0.85)" }}>Admin</Link>
        ) : null}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {isAuthed ? (
          <>
            <span style={{ opacity: 0.75, color: "white", fontSize: "0.9em" }}>
              {user?.email ?? "User"}{" "}
              {role ? <span style={{ opacity: 0.7 }}>({role})</span> : null}
            </span>
            <button
              onClick={logout}
              style={{
                padding: "6px 12px",
                backgroundColor: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "white",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: "rgba(255,255,255,0.85)" }}>Login</Link>
            <Link to="/register" style={{ color: "rgba(255,255,255,0.85)" }}>Register</Link>
          </>
        )}
      </div>
    </div>
  );
}