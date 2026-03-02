import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

function homeForRole(role) {
  if (role === "ADMIN") return "/admin";
  if (role === "RESTAURANT") return "/restaurant";
  return "/"; // customer or unknown
}

export default function RequireRole({ role, allowed }) {
  const { authLoading, role: myRole } = useAuth();

  if (authLoading) return <div style={{ padding: 16 }}>Loading...</div>;

  const allowedRoles = allowed ?? (role ? [role] : []);
  const ok = allowedRoles.length === 0 ? true : allowedRoles.includes(myRole);

  if (!ok) return <Navigate to={homeForRole(myRole)} replace />;

  return <Outlet />;
}