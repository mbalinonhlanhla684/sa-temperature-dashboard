import { useState, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Thermometer, TrendingUp, Sun, Wind } from "lucide-react";

export default function App() {
  const [stats, setStats] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [yearly, setYearly] = useState([]);

  useEffect(() => {
    fetch("https://south-africa-temperature-etl.onrender.com/api/stats")
      .then(r => r.json()).then(setStats);
    fetch("https://south-africa-temperature-etl.onrender.com/api/temperature")
      .then(r => r.json()).then(setMonthly);
    fetch("https://south-africa-temperature-etl.onrender.com/api/yearly-trend")
      .then(r => r.json()).then(setYearly);
  }, []);

  return (
    <div style={{ background: "#0a1628", minHeight: "100vh", padding: "24px", fontFamily: "Inter, sans-serif", color: "white" }}>
      
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#4ade80", margin: 0 }}>🌡️ South Africa</h1>
        <p style={{ color: "#94a3b8", margin: "4px 0 0", fontSize: 14 }}>Temperature Change Dashboard • FAO Dataset 1961–2019</p>
      </div>

      {/* KPI Cards */}
      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
          <KPICard icon={<Sun size={20} />} label="Hottest Month" value={stats.hottest_month} sub={`+${stats.hottest_value}°C in 2019`} color="#f97316" />
          <KPICard icon={<Wind size={20} />} label="Coldest Month" value={stats.coldest_month} sub={`+${stats.coldest_value}°C in 2019`} color="#38bdf8" />
          <KPICard icon={<Thermometer size={20} />} label="Average Change" value={`+${stats.average_change}°C`} sub="Annual average 2019" color="#4ade80" />
          <KPICard icon={<TrendingUp size={20} />} label="Country" value="South Africa" sub="12 months tracked" color="#a78bfa" />
        </div>
      )}

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        
        {/* Bar Chart */}
        <div style={{ background: "#0f2744", borderRadius: 16, padding: 24, border: "1px solid #1e3a5f" }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 16, color: "#e2e8f0" }}>📊 Monthly Temperature Change (2019)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 10 }} tickFormatter={m => m.slice(0,3)} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid #4ade80", borderRadius: 8, color: "white" }} />
              <Bar dataKey="Y2019" fill="#4ade80" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div style={{ background: "#0f2744", borderRadius: 16, padding: 24, border: "1px solid #1e3a5f" }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 16, color: "#e2e8f0" }}>📈 Yearly Trend (2000–2019)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={yearly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
              <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid #38bdf8", borderRadius: 8, color: "white" }} />
              <Line type="monotone" dataKey="change" stroke="#38bdf8" strokeWidth={3} dot={{ fill: "#38bdf8", r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#0f2744", borderRadius: 16, padding: 24, border: "1px solid #1e3a5f" }}>
        <h3 style={{ margin: "0 0 20px", fontSize: 16, color: "#e2e8f0" }}>🗂️ Monthly Data Table</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1e3a5f" }}>
              {["Month", "2000", "2010", "2015", "2017", "2018", "2019"].map(h => (
                <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: "#64748b", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {monthly.map((row, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #0a1628" }}>
                <td style={{ padding: "8px 12px", color: "#4ade80", fontWeight: 600 }}>{row.month}</td>
                <td style={{ padding: "8px 12px", color: "#e2e8f0" }}>{row.Y2000}</td>
                <td style={{ padding: "8px 12px", color: "#e2e8f0" }}>{row.Y2010}</td>
                <td style={{ padding: "8px 12px", color: "#e2e8f0" }}>{row.Y2015}</td>
                <td style={{ padding: "8px 12px", color: "#e2e8f0" }}>{row.Y2017}</td>
                <td style={{ padding: "8px 12px", color: "#e2e8f0" }}>{row.Y2018}</td>
                <td style={{ padding: "8px 12px", color: "#4ade80", fontWeight: 700 }}>{row.Y2019}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KPICard({ icon, label, value, sub, color }) {
  return (
    <div style={{ background: "#0f2744", borderRadius: 16, padding: 20, border: `1px solid ${color}33` }}>
      <div style={{ color, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{sub}</div>
    </div>
  );
}