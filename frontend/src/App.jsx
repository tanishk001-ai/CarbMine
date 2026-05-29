import React, { useState, useCallback } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line,
} from "recharts";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";
const GREEN = "#2d6a4f";
const LIGHT_GREEN = "#d8f3dc";

// ─── Styles ──────────────────────────────────────────────────────
const s = {
  app: { minHeight: "100vh", background: "#f0f4f1", fontFamily: "Inter, sans-serif" },
  nav: { background: GREEN, color: "#fff", padding: "14px 32px", display: "flex", alignItems: "center", gap: 12, fontSize: 20, fontWeight: 700 },
  main: { maxWidth: 1100, margin: "0 auto", padding: "32px 20px" },
  tabs: { display: "flex", gap: 8, marginBottom: 28 },
  tab: (active) => ({
    padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14,
    background: active ? GREEN : "#fff", color: active ? "#fff" : GREEN,
    boxShadow: active ? "0 2px 8px rgba(45,106,79,0.3)" : "0 1px 4px rgba(0,0,0,0.1)",
  }),
  card: { background: "#fff", borderRadius: 12, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", marginBottom: 20 },
  label: { display: "block", fontWeight: 600, fontSize: 13, color: "#374151", marginBottom: 4 },
  input: { width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #d1fae5", fontSize: 14, outline: "none", marginBottom: 16 },
  btn: { background: GREEN, color: "#fff", border: "none", borderRadius: 8, padding: "11px 28px", fontWeight: 700, fontSize: 14, cursor: "pointer" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  scopeCard: (color) => ({ background: color, borderRadius: 10, padding: "16px 20px", textAlign: "center" }),
  total: { textAlign: "center", margin: "20px 0", padding: 20, background: LIGHT_GREEN, borderRadius: 12 },
};

// ─── Input Form ──────────────────────────────────────────────────
function EmissionForm({ onResult }) {
  const [form, setForm] = useState({
    coal_extracted: "", methane_vented: "", diesel_used: "", explosives_used: "",
    electricity_kwh: "", grid_region: "national",
    coal_transported_tkm: "", coal_combustion_tonnes: "",
  });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async () => {
    setLoading(true);
    try {
      const payload = Object.fromEntries(
        Object.entries(form).map(([k, v]) => [k, isNaN(v) || v === "" ? v : parseFloat(v)])
      );
      const { data } = await axios.post(`${API}/api/calculate`, payload);
      onResult(data);
    } catch (e) {
      alert("Calculation failed: " + (e.response?.data?.error || e.message));
    } finally {
      setLoading(false);
    }
  };

  const F = ({ label, k, placeholder }) => (
    <div>
      <label style={s.label}>{label}</label>
      <input style={s.input} value={form[k]} onChange={set(k)} placeholder={placeholder || "0"} type="number" min="0" />
    </div>
  );

  return (
    <div style={s.card}>
      <h2 style={{ color: GREEN, marginTop: 0 }}>📋 Emission Inputs</h2>
      <h3 style={{ color: "#374151" }}>Scope 1 — Direct</h3>
      <div style={s.grid2}>
        <F label="Coal Extracted (tonnes)" k="coal_extracted" />
        <F label="Methane Vented (m³)" k="methane_vented" />
        <F label="Diesel Used (litres)" k="diesel_used" />
        <F label="Explosives Used — ANFO (kg)" k="explosives_used" />
      </div>
      <h3 style={{ color: "#374151" }}>Scope 2 — Electricity</h3>
      <div style={s.grid2}>
        <F label="Electricity Consumed (kWh)" k="electricity_kwh" />
        <div>
          <label style={s.label}>Grid Region</label>
          <select style={s.input} value={form.grid_region} onChange={set("grid_region")}>
            {["national","northern","southern","eastern","western","northeastern"].map(r => (
              <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>
      <h3 style={{ color: "#374151" }}>Scope 3 — Value Chain</h3>
      <div style={s.grid2}>
        <F label="Coal Transported (tonne-km)" k="coal_transported_tkm" />
        <F label="Coal Combusted Downstream (tonnes)" k="coal_combustion_tonnes" />
      </div>
      <button style={s.btn} onClick={submit} disabled={loading}>
        {loading ? "Calculating…" : "Calculate Emissions →"}
      </button>
    </div>
  );
}

// ─── Results Dashboard ───────────────────────────────────────────
function Dashboard({ result }) {
  if (!result) return null;
  const { scope1, scope2, scope3, total_co2e_tonnes } = result;
  const chartData = [
    { name: "Scope 1", value: scope1.total, fill: "#2d6a4f" },
    { name: "Scope 2", value: scope2.total, fill: "#52b788" },
    { name: "Scope 3", value: scope3.total, fill: "#95d5b2" },
  ];

  const downloadReport = async () => {
    const resp = await axios.post(`${API}/api/report`, result, { responseType: "blob" });
    const url = URL.createObjectURL(new Blob([resp.data]));
    Object.assign(document.createElement("a"), { href: url, download: "CarbMine_Report.pdf" }).click();
  };

  return (
    <div style={s.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ color: GREEN, margin: 0 }}>📊 Emission Results</h2>
        <button style={s.btn} onClick={downloadReport}>⬇ Download PDF Report</button>
      </div>
      <div style={s.total}>
        <div style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>TOTAL EMISSIONS</div>
        <div style={{ fontSize: 36, fontWeight: 800, color: GREEN }}>{total_co2e_tonnes.toLocaleString()}</div>
        <div style={{ fontSize: 12, color: "#6b7280" }}>tonnes CO₂e</div>
      </div>
      <div style={{ ...s.grid2, marginBottom: 20 }}>
        {[["Scope 1 — Direct", scope1.total, "#2d6a4f"], ["Scope 2 — Electricity", scope2.total, "#52b788"], ["Scope 3 — Value Chain", scope3.total, "#95d5b2"]].map(([label, val, color]) => (
          <div key={label} style={s.scopeCard(LIGHT_GREEN)}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color }}>{val?.toLocaleString?.() ?? val}</div>
            <div style={{ fontSize: 11, color: "#6b7280" }}>t CO₂e</div>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(v) => `${v} t CO₂e`} />
          <Bar dataKey="value" fill={GREEN} radius={[6, 6, 0, 0]}>
            {chartData.map((entry, i) => <rect key={i} fill={entry.fill} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── CSV Upload ──────────────────────────────────────────────────
function Uploader() {
  const [rows, setRows] = useState(null);
  const onDrop = useCallback(async (files) => {
    const fd = new FormData();
    fd.append("file", files[0]);
    try {
      const { data } = await axios.post(`${API}/api/upload`, fd);
      setRows(data.data);
    } catch (e) {
      alert("Upload failed: " + (e.response?.data?.error || e.message));
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { "text/csv": [], "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [] } });

  return (
    <div style={s.card}>
      <h2 style={{ color: GREEN, marginTop: 0 }}>📁 Bulk CSV / Excel Upload</h2>
      <div {...getRootProps()} style={{ border: "2.5px dashed #52b788", borderRadius: 10, padding: 40, textAlign: "center", background: isDragActive ? LIGHT_GREEN : "#f9fef9", cursor: "pointer" }}>
        <input {...getInputProps()} />
        <div style={{ fontSize: 32, marginBottom: 8 }}>📂</div>
        <div style={{ color: GREEN, fontWeight: 600 }}>{isDragActive ? "Drop here!" : "Drag & drop CSV/Excel or click to browse"}</div>
        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>Required columns: coal_extracted, electricity_kwh, diesel_used</div>
      </div>
      {rows && (
        <div style={{ marginTop: 20, overflowX: "auto" }}>
          <div style={{ fontWeight: 600, color: GREEN, marginBottom: 8 }}>{rows.length} rows processed</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: GREEN, color: "#fff" }}>
                {["Scope 1", "Scope 2", "Scope 3", "Total CO₂e"].map(h => <th key={h} style={{ padding: "8px 12px", textAlign: "right" }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} style={{ background: i % 2 ? LIGHT_GREEN : "#fff" }}>
                  {["scope1_co2e","scope2_co2e","scope3_co2e","total_co2e"].map(k => (
                    <td key={k} style={{ padding: "7px 12px", textAlign: "right" }}>{r[k]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── App Shell ───────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("calculator");
  const [result, setResult] = useState(null);

  return (
    <div style={s.app}>
      <nav style={s.nav}>
        <span>🌿</span> CarbMine
        <span style={{ fontSize: 13, fontWeight: 400, opacity: 0.8 }}>Carbon Footprint Assessment — Coal Mining</span>
      </nav>
      <main style={s.main}>
        <div style={s.tabs}>
          {[["calculator","📋 Calculator"], ["upload","📁 Bulk Upload"]].map(([id, label]) => (
            <button key={id} style={s.tab(tab === id)} onClick={() => setTab(id)}>{label}</button>
          ))}
        </div>
        {tab === "calculator" && (
          <>
            <EmissionForm onResult={setResult} />
            <Dashboard result={result} />
          </>
        )}
        {tab === "upload" && <Uploader />}
      </main>
    </div>
  );
}
