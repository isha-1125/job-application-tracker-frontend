import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const BASE_URL = "https://job-application-tracker-backend-ip83.onrender.com";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      window.location.href = "/dashboard";
    }
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/auth/login`,
        { email, password }
      );

      localStorage.setItem("userInfo", JSON.stringify(data));
      window.location.href = "/dashboard";
    } catch (error) {
      alert(error.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <form
        onSubmit={submitHandler}
        className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-96"
      >
        <h2 className="text-white text-2xl font-bold mb-6 text-center">
          🔐 Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-lg bg-black/30 text-white focus:ring-2 focus:ring-indigo-400 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded-lg bg-black/30 text-white focus:ring-2 focus:ring-indigo-400 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 p-3 rounded-lg text-white font-semibold hover:bg-indigo-700 transition"
        >
          Login
        </button>

        <p className="text-center text-gray-300 mt-4 text-sm">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-indigo-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
