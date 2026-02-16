import React, { useState } from "react";
import axios from "axios";

const BASE_URL = "https://job-application-tracker-backend-ip83.onrender.com";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/auth/register`,
        { name, email, password }
      );

      localStorage.setItem("userInfo", JSON.stringify(data));
      window.location.href = "/dashboard";
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form
        onSubmit={submitHandler}
        className="bg-slate-800 p-8 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-white text-2xl font-bold mb-6 text-center">
          Create Account
        </h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full p-3 mb-4 rounded bg-slate-700 text-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-slate-700 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded bg-slate-700 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-indigo-600 p-3 rounded text-white font-semibold hover:bg-indigo-700">
          Sign Up
        </button>

        <p className="text-gray-400 text-sm mt-4 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-400">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
