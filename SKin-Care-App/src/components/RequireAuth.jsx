import React from "react";
import { Navigate } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default RequireAuth;
