import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const BASE_URL =
  "https://job-application-tracker-backend-ip83.onrender.com";

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) window.location.href = "/login";
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const response = await fetch(`${BASE_URL}/api/jobs`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    window.location.href = "/login";
  };

  const addOrUpdateJob = async () => {
    if (!company || !role) return;

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      const url = editId
        ? `${BASE_URL}/api/jobs/${editId}`
        : `${BASE_URL}/api/jobs`;

      const method = editId ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ company, role, status }),
      });

      fetchJobs();
      setCompany("");
      setRole("");
      setStatus("Applied");
      setEditId(null);
    } catch (error) {
      console.error("Error saving job:", error);
    }
  };

  const deleteJob = async (id) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      await fetch(`${BASE_URL}/api/jobs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      fetchJobs();
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const filteredJobs = jobs
    .filter((job) => (filter === "All" ? true : job.status === filter))
    .filter((job) =>
      job.company.toLowerCase().includes(search.toLowerCase())
    );

  // Stats
  const total = jobs.length;
  const applied = jobs.filter(j => j.status === "Applied").length;
  const interview = jobs.filter(j => j.status === "Interview").length;
  const offer = jobs.filter(j => j.status === "Offer").length;
  const rejected = jobs.filter(j => j.status === "Rejected").length;

  const chartData = [
    { name: "Applied", value: applied },
    { name: "Interview", value: interview },
    { name: "Offer", value: offer },
    { name: "Rejected", value: rejected },
  ];

  const COLORS = ["#3B82F6", "#F59E0B", "#10B981", "#EF4444"];

  const getStatusColor = (status) => {
    switch (status) {
      case "Applied":
        return "bg-blue-500/80";
      case "Interview":
        return "bg-amber-500/80";
      case "Offer":
        return "bg-emerald-500/80";
      case "Rejected":
        return "bg-rose-500/80";
      default:
        return "bg-gray-500/80";
    }
  };

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white"
          : "bg-gray-100 text-gray-800"
      }`}
    >
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-5 backdrop-blur-md bg-black/10 shadow-md">
        <h1 className="text-2xl font-bold tracking-wide">
          🚀 Job Tracker Pro
        </h1>

        <div className="flex gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            {darkMode ? "☀ Light" : "🌙 Dark"}
          </button>

          <button
            onClick={logoutHandler}
            className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 transition focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="p-8 max-w-7xl mx-auto">

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {[["Total", total],
            ["Applied", applied],
            ["Interview", interview],
            ["Offer", offer],
            ["Rejected", rejected]
          ].map(([label, value]) => (
            <div
              key={label}
              className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg text-center hover:scale-105 transition"
            >
              <h2 className="text-sm opacity-70">{label}</h2>
              <p className="text-3xl font-bold mt-2">{value}</p>
            </div>
          ))}
        </div>

        {/* ANALYTICS */}
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg mb-10">
          <h2 className="text-xl font-semibold mb-6 text-center">
            📊 Application Analytics
          </h2>

          {total === 0 ? (
            <p className="text-center opacity-60">No data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  dataKey="value"
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* ADD JOB */}
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <input
              className="p-3 rounded-lg bg-black/20 focus:ring-2 focus:ring-indigo-400 outline-none"
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <input
              className="p-3 rounded-lg bg-black/20 focus:ring-2 focus:ring-indigo-400 outline-none"
              placeholder="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
            <select
              className="p-3 rounded-lg bg-black/20 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option>Applied</option>
              <option>Interview</option>
              <option>Offer</option>
              <option>Rejected</option>
            </select>

            <button
              onClick={addOrUpdateJob}
              className="rounded-lg bg-indigo-600 hover:bg-indigo-700 transition focus:ring-2 focus:ring-indigo-400"
            >
              {editId ? "Update" : "Add"}
            </button>
          </div>
        </div>

        {/* SEARCH + FILTER */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            className="p-3 rounded-lg bg-black/20 w-full md:w-1/2 focus:ring-2 focus:ring-indigo-400 outline-none"
            placeholder="Search company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="p-3 rounded-lg bg-black/20 focus:ring-2 focus:ring-indigo-400 outline-none"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>All</option>
            <option>Applied</option>
            <option>Interview</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>
        </div>

        {/* JOB CARDS */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-20 opacity-60">
            <h2 className="text-xl font-semibold">No jobs found 🚫</h2>
            <p className="mt-2">Start tracking your applications.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-md hover:scale-105 transition"
              >
                <h2 className="text-xl font-bold">{job.company}</h2>
                <p className="opacity-80">{job.role}</p>

                <span
                  className={`inline-block mt-3 px-4 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                    job.status
                  )}`}
                >
                  {job.status}
                </span>

                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => {
                      setCompany(job.company);
                      setRole(job.role);
                      setStatus(job.status);
                      setEditId(job._id);
                    }}
                    className="flex-1 bg-indigo-500 hover:bg-indigo-600 rounded-lg py-2 transition focus:ring-2 focus:ring-indigo-300"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteJob(job._id)}
                    className="flex-1 bg-rose-500 hover:bg-rose-600 rounded-lg py-2 transition focus:ring-2 focus:ring-rose-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
