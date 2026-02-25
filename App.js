import { useState, useEffect, useMemo } from "react";

const BLOOD_GROUPS = ["All", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const CITIES = ["All", "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad"];

const BG_LIST = BLOOD_GROUPS.filter(g => g !== "All");
const CITY_LIST = CITIES.filter(c => c !== "All");

// Map API users to donor objects with blood group, city, availability
function assignDonorMeta(users) {
  return users.map((user, i) => ({
    ...user,
    bloodGroup: BG_LIST[i % BG_LIST.length],
    city: CITY_LIST[(i * 7 + 3) % CITY_LIST.length],
    available: i % 3 !== 2,
  }));
}

export default function App() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [sortByAvail, setSortByAvail] = useState(false);
  const [requested, setRequested] = useState({});
  const [searched, setSearched] = useState(false);
  const [appliedGroup, setAppliedGroup] = useState("All");
  const [appliedCity, setAppliedCity] = useState("All");

  // Fetch donor data from API on mount
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(r => r.json())
      .then(data => {
        setDonors(assignDonorMeta(data));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Apply filters only when Search is clicked
  const handleSearch = () => {
    setAppliedGroup(selectedGroup);
    setAppliedCity(selectedCity);
    setSearched(true);
  };

  // Reset all filters and show all donors
  const handleReset = () => {
    setSelectedGroup("All");
    setSelectedCity("All");
    setAppliedGroup("All");
    setAppliedCity("All");
    setSearched(false);
  };

  // Derived state: filtered + sorted donor list
  const displayDonors = useMemo(() => {
    let list = [...donors];
    if (searched) {
      if (appliedGroup !== "All") list = list.filter(d => d.bloodGroup === appliedGroup);
      if (appliedCity !== "All") list = list.filter(d => d.city === appliedCity);
    }
    if (sortByAvail) list = [...list].sort((a, b) => b.available - a.available);
    return list;
  }, [donors, appliedGroup, appliedCity, sortByAvail, searched]);

  const availableCount = displayDonors.filter(d => d.available).length;

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", fontFamily: "sans-serif", color: "#222" }}>

      {/* Header */}
      <div style={{ background: "#c0392b", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "1.5rem" }}>🩸</span>
          <div>
            <div style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 700 }}>Blood Donor Finder</div>
            <div style={{ color: "#f5a5a5", fontSize: "0.75rem" }}>Community Donor Network</div>
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: "8px", padding: "8px 16px", textAlign: "center" }}>
          <div style={{ color: "#c0392b", fontSize: "1.4rem", fontWeight: 700, lineHeight: 1 }}>{availableCount}</div>
          <div style={{ color: "#888", fontSize: "0.7rem" }}>Available</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ background: "#fff", padding: "12px 24px", display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center", borderBottom: "1px solid #e0e0e0" }}>

        {/* Blood Group Dropdown */}
        <select
          value={selectedGroup}
          onChange={e => setSelectedGroup(e.target.value)}
          style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "0.85rem", background: "#fff" }}
        >
          {BLOOD_GROUPS.map(g => (
            <option key={g} value={g}>{g === "All" ? "All Blood Groups" : g}</option>
          ))}
        </select>

        {/* City Dropdown */}
        <select
          value={selectedCity}
          onChange={e => setSelectedCity(e.target.value)}
          style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "0.85rem", background: "#fff" }}
        >
          {CITIES.map(c => (
            <option key={c} value={c}>{c === "All" ? "All Cities" : c}</option>
          ))}
        </select>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          style={{ padding: "8px 18px", background: "#c0392b", color: "#fff", border: "none", borderRadius: "6px", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}
        >
          Search
        </button>

        {/* Clear Button — only visible after search */}
        {searched && (
          <button
            onClick={handleReset}
            style={{ padding: "8px 14px", background: "#f0f0f0", color: "#555", border: "1px solid #ccc", borderRadius: "6px", fontSize: "0.85rem", cursor: "pointer" }}
          >
            Clear
          </button>
        )}

        {/* Sort Toggle */}
        <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "#555", cursor: "pointer" }}>
          <input type="checkbox" checked={sortByAvail} onChange={e => setSortByAvail(e.target.checked)} />
          Sort by availability
        </label>

        <span style={{ marginLeft: "auto", fontSize: "0.8rem", color: "#888" }}>
          {displayDonors.length} donor{displayDonors.length !== 1 ? "s" : ""} found
        </span>
      </div>

      {/* Donor Cards */}
      <div style={{ padding: "20px 24px" }}>

        {/* Loading State */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>⏳</div>
            <div>Loading donors...</div>
          </div>

        /* Empty State */
        ) : displayDonors.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>🔍</div>
            <div>No donors found for the selected filters.</div>
            <button
              onClick={handleReset}
              style={{ marginTop: "12px", padding: "8px 16px", background: "#c0392b", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem" }}
            >
              Show All Donors
            </button>
          </div>

        /* Donor Grid */
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
            {displayDonors.map(donor => (
              <div key={donor.id} style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: "10px", padding: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>

                {/* Donor Info */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "1rem", marginBottom: "2px" }}>{donor.name}</div>
                    <div style={{ color: "#666", fontSize: "0.82rem" }}>📍 {donor.city}</div>
                  </div>
                  <span style={{ background: "#c0392b", color: "#fff", fontWeight: 700, fontSize: "0.8rem", padding: "3px 10px", borderRadius: "20px" }}>
                    {donor.bloodGroup}
                  </span>
                </div>

                {/* Availability + Request Button */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
                  <span style={{ fontSize: "0.78rem", color: donor.available ? "#27ae60" : "#e74c3c", fontWeight: 500 }}>
                    {donor.available ? "● Available" : "○ Unavailable"}
                  </span>
                  <button
                    onClick={() => donor.available && !requested[donor.id] && setRequested(p => ({ ...p, [donor.id]: true }))}
                    disabled={!donor.available || requested[donor.id]}
                    style={{
                      background: requested[donor.id] ? "#eafaf1" : donor.available ? "#c0392b" : "#f0f0f0",
                      color: requested[donor.id] ? "#27ae60" : donor.available ? "#fff" : "#aaa",
                      border: "none", borderRadius: "6px", padding: "6px 14px",
                      fontSize: "0.78rem", fontWeight: 600,
                      cursor: donor.available && !requested[donor.id] ? "pointer" : "default",
                    }}
                  >
                    {requested[donor.id] ? "Request Sent ✅" : "Request Help"}
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
