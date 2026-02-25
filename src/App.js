import { useState, useEffect, useMemo } from "react";

const BLOOD_GROUPS = ["All", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const CITIES = ["All", "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad"];

const BG_LIST = BLOOD_GROUPS.filter(g => g !== "All");
const CITY_LIST = CITIES.filter(c => c !== "All");

const BG_COLORS = {
  "A+": "#e53e3e", "A-": "#c05621", "B+": "#2b6cb0", "B-": "#553c9a",
  "O+": "#276749", "O-": "#285e61", "AB+": "#6b46c1", "AB-": "#97266d",
};

function assignDonorMeta(users) {
  return users.map((user, i) => ({
    ...user,
    bloodGroup: BG_LIST[i % BG_LIST.length],
    city: CITY_LIST[(i * 7 + 3) % CITY_LIST.length],
    available: i % 3 !== 2,
    avatarUrl: `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(user.name)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`,
  }));
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=Source+Sans+3:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body { font-family: 'Source Sans 3', sans-serif; }

  .app { min-height: 100vh; background: #f0f4f8; }

  .header {
    background: linear-gradient(135deg, #1a365d 0%, #2a4a7f 100%);
    padding: 0 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 72px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.15);
  }

  .header-left { display: flex; align-items: center; gap: 14px; }

  .header-logo {
    width: 44px; height: 44px;
    background: rgba(255,255,255,0.12);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem;
    border: 1px solid rgba(255,255,255,0.2);
  }

  .header-title {
    font-family: 'Lora', serif;
    font-size: 1.25rem;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.01em;
  }

  .header-subtitle { color: #90cdf4; font-size: 0.72rem; font-weight: 300; letter-spacing: 0.08em; text-transform: uppercase; }

  .header-stat {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 10px;
    padding: 8px 20px;
    text-align: center;
    backdrop-filter: blur(8px);
  }

  .stat-num { color: #fff; font-size: 1.5rem; font-weight: 700; font-family: 'Lora', serif; line-height: 1; }
  .stat-label { color: #90cdf4; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 2px; }

  .filter-bar {
    background: #fff;
    padding: 14px 32px;
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
    border-bottom: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }

  .filter-label { font-size: 0.75rem; font-weight: 600; color: #718096; text-transform: uppercase; letter-spacing: 0.06em; }

  .filter-select {
    padding: 9px 14px;
    border: 1.5px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.85rem;
    font-family: 'Source Sans 3', sans-serif;
    color: #2d3748;
    background: #f7fafc;
    cursor: pointer;
    outline: none;
    transition: border-color 0.2s;
  }
  .filter-select:focus { border-color: #3182ce; background: #fff; }

  .btn-search {
    padding: 9px 22px;
    background: #2b6cb0;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    font-family: 'Source Sans 3', sans-serif;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
    letter-spacing: 0.02em;
  }
  .btn-search:hover { background: #2c5282; transform: translateY(-1px); }
  .btn-search:active { transform: translateY(0); }

  .btn-clear {
    padding: 9px 16px;
    background: #fff;
    color: #718096;
    border: 1.5px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.85rem;
    font-family: 'Source Sans 3', sans-serif;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-clear:hover { border-color: #cbd5e0; color: #4a5568; }

  .sort-label {
    display: flex; align-items: center; gap: 7px;
    font-size: 0.82rem; color: #4a5568; cursor: pointer;
    user-select: none;
  }
  .sort-label input { accent-color: #2b6cb0; width: 15px; height: 15px; cursor: pointer; }

  .result-count { margin-left: auto; font-size: 0.8rem; color: #a0aec0; font-weight: 500; }

  .content { padding: 28px 32px; }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }

  .card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 1px 6px rgba(0,0,0,0.06);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }

  .card-top {
    padding: 20px 20px 16px;
    display: flex;
    align-items: center;
    gap: 14px;
    border-bottom: 1px solid #f0f4f8;
  }

  .avatar {
    width: 56px; height: 56px;
    border-radius: 50%;
    border: 2px solid #e2e8f0;
    object-fit: cover;
    background: #edf2f7;
    flex-shrink: 0;
  }

  .card-name { font-family: 'Lora', serif; font-size: 1rem; font-weight: 600; color: #1a202c; margin-bottom: 3px; }
  .card-city { font-size: 0.8rem; color: #718096; }

  .blood-badge {
    margin-left: auto;
    width: 42px; height: 42px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 0.75rem;
    color: #fff;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    font-family: 'Lora', serif;
  }

  .card-bottom {
    padding: 14px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .avail-dot {
    display: flex; align-items: center; gap: 6px;
    font-size: 0.78rem; font-weight: 500;
  }
  .dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

  .btn-request {
    padding: 7px 16px;
    border: none;
    border-radius: 7px;
    font-size: 0.78rem;
    font-weight: 600;
    font-family: 'Source Sans 3', sans-serif;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.01em;
  }

  .center-msg { text-align: center; padding: 72px 24px; color: #a0aec0; }
  .center-icon { font-size: 2.5rem; margin-bottom: 12px; }
  .center-title { font-family: 'Lora', serif; font-size: 1.1rem; color: #4a5568; margin-bottom: 6px; }
  .center-sub { font-size: 0.85rem; }

  .divider { width: 1px; height: 20px; background: #e2e8f0; }
`;

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

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(r => r.json())
      .then(data => { setDonors(assignDonorMeta(data)); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSearch = () => {
    setAppliedGroup(selectedGroup);
    setAppliedCity(selectedCity);
    setSearched(true);
  };

  const handleReset = () => {
    setSelectedGroup("All"); setSelectedCity("All");
    setAppliedGroup("All"); setAppliedCity("All");
    setSearched(false);
  };

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
    <>
      <style>{styles}</style>
      <div className="app">

        {/* Header */}
        <div className="header">
          <div className="header-left">
            <div className="header-logo">🩸</div>
            <div>
              <div className="header-title">Blood Donor Finder</div>
              <div className="header-subtitle">Community Donor Network</div>
            </div>
          </div>
          <div className="header-stat">
            <div className="stat-num">{availableCount}</div>
            <div className="stat-label">Available Now</div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          <span className="filter-label">Filter</span>
          <div className="divider" />

          <select className="filter-select" value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)}>
            {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g === "All" ? "All Blood Groups" : g}</option>)}
          </select>

          <select className="filter-select" value={selectedCity} onChange={e => setSelectedCity(e.target.value)}>
            {CITIES.map(c => <option key={c} value={c}>{c === "All" ? "All Cities" : c}</option>)}
          </select>

          <button className="btn-search" onClick={handleSearch}>Search</button>

          {searched && <button className="btn-clear" onClick={handleReset}>Clear</button>}

          <div className="divider" />

          <label className="sort-label">
            <input type="checkbox" checked={sortByAvail} onChange={e => setSortByAvail(e.target.checked)} />
            Sort by availability
          </label>

          <span className="result-count">{displayDonors.length} donor{displayDonors.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Content */}
        <div className="content">
          {loading ? (
            <div className="center-msg">
              <div className="center-icon">⏳</div>
              <div className="center-title">Loading donors...</div>
              <div className="center-sub">Fetching from network</div>
            </div>
          ) : displayDonors.length === 0 ? (
            <div className="center-msg">
              <div className="center-icon">🔍</div>
              <div className="center-title">No donors found</div>
              <div className="center-sub" style={{ marginBottom: 16 }}>Try adjusting your filters</div>
              <button className="btn-search" onClick={handleReset}>Show All Donors</button>
            </div>
          ) : (
            <div className="grid">
              {displayDonors.map(donor => (
                <div className="card" key={donor.id}>
                  <div className="card-top">
                    <img className="avatar" src={donor.avatarUrl} alt={donor.name} />
                    <div>
                      <div className="card-name">{donor.name}</div>
                      <div className="card-city">📍 {donor.city}</div>
                    </div>
                    <div
                      className="blood-badge"
                      style={{ background: BG_COLORS[donor.bloodGroup] || "#2b6cb0" }}
                    >
                      {donor.bloodGroup}
                    </div>
                  </div>

                  <div className="card-bottom">
                    <div className="avail-dot">
                      <div className="dot" style={{ background: donor.available ? "#38a169" : "#e53e3e" }} />
                      <span style={{ color: donor.available ? "#38a169" : "#e53e3e" }}>
                        {donor.available ? "Available" : "Unavailable"}
                      </span>
                    </div>

                    <button
                      className="btn-request"
                      onClick={() => donor.available && !requested[donor.id] && setRequested(p => ({ ...p, [donor.id]: true }))}
                      disabled={!donor.available || requested[donor.id]}
                      style={{
                        background: requested[donor.id] ? "#f0fff4" : donor.available ? "#2b6cb0" : "#f7fafc",
                        color: requested[donor.id] ? "#38a169" : donor.available ? "#fff" : "#a0aec0",
                        border: requested[donor.id] ? "1.5px solid #9ae6b4" : donor.available ? "none" : "1.5px solid #e2e8f0",
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
    </>
  );
}
