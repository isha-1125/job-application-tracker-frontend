import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Route */}
        <Route
          path="/dashboard"
          element={userInfo ? <Dashboard /> : <Navigate to="/login" />}
        />

        {/* Default Redirect */}
        <Route
          path="*"
          element={<Navigate to={userInfo ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </Router>
  );
}
