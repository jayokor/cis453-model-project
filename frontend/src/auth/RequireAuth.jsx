import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RequireAuth() {
  const { isAuthed, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) return <div style={{ padding: 16 }}>Loading...</div>;
  if (!isAuthed) return <Navigate to="/login" replace state={{ from: location }} />;

  return <Outlet />;
}