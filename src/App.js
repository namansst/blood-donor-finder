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
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: sans-serif; }
  .app { min-height: 100vh; background: #f0f4f8; }

  .header {
    background: #1a365d;
    padding: 0 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 72px;
    color: white;
  }

  .filter-bar {
    background: #fff;
    padding: 14px 32px;
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    border-bottom: 1px solid #e2e8f0;
  }

  .filter-select, .btn-search, .btn-clear {
    padding: 8px 14px;
    border-radius: 6px;
    border: 1px solid #ccc;
  }

  .btn-search { background:#2b6cb0; color:white; border:none; }
  .btn-clear { background:white; }

  .content { padding: 28px 32px; }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }

  .card {
    background: white;
    border-radius: 12px;
    border:1px solid #e2e8f0;
    overflow:hidden;
  }

  .card-top {
    padding:16px;
    display:flex;
    align-items:center;
    gap:12px;
    border-bottom:1px solid #eee;
  }

  .avatar {
    width:56px;
    height:56px;
    border-radius:50%;
  }

  .blood-badge{
    margin-left:auto;
    width:42px;
    height:42px;
    border-radius:50%;
    display:flex;
    align-items:center;
    justify-content:center;
    color:white;
    font-weight:bold;
  }

  .card-bottom{
    padding:14px;
    display:flex;
    justify-content:space-between;
    align-items:center;
  }

  .btn-request{
    padding:6px 14px;
    border-radius:6px;
    border:none;
    font-weight:600;
    cursor:pointer;
  }

  .divider { width:1px; height:20px; background:#ccc; }
`;

export default function App() {

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedGroup, setSelectedGroup] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [sortByAvail, setSortByAvail] = useState(false);

  const [searched, setSearched] = useState(false);
  const [appliedGroup, setAppliedGroup] = useState("All");
  const [appliedCity, setAppliedCity] = useState("All");

  /* ---------- REQUEST STORAGE ---------- */
  const [requests, setRequests] = useState(() => {
    return JSON.parse(localStorage.getItem("requests") || "[]");
  });

  const sendRequest = (donor) => {
    const newReq = {
      id: Date.now(),
      donorId: donor.id,
      name: donor.name,
      bloodGroup: donor.bloodGroup,
      city: donor.city,
      status: "pending",
      date: new Date().toLocaleString()
    };

    const updated = [...requests, newReq];
    setRequests(updated);
    localStorage.setItem("requests", JSON.stringify(updated));
  };

  /* ---------- FETCH USERS ---------- */
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(r => r.json())
      .then(data => { setDonors(assignDonorMeta(data)); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  /* ---------- SEARCH ---------- */
  const handleSearch = () => {
    setAppliedGroup(selectedGroup);
    setAppliedCity(selectedCity);
    setSearched(true);
  };

  const handleReset = () => {
    setSelectedGroup("All");
    setSelectedCity("All");
    setAppliedGroup("All");
    setAppliedCity("All");
    setSearched(false);
  };

  /* ---------- FILTER + SORT ---------- */
  const displayDonors = useMemo(() => {
    let list = [...donors];

    if (searched) {
      if (appliedGroup !== "All") list = list.filter(d => d.bloodGroup === appliedGroup);
      if (appliedCity !== "All") list = list.filter(d => d.city === appliedCity);
    }

    if (sortByAvail)
      list = [...list].sort((a, b) => b.available - a.available);

    return list;
  }, [donors, appliedGroup, appliedCity, sortByAvail, searched]);

  const availableCount = displayDonors.filter(d => d.available).length;

  return (
    <>
      <style>{styles}</style>
      <div className="app">

        {/* HEADER */}
        <div className="header">
          <h2>Blood Donor Finder</h2>
          <div>Available: {availableCount}</div>
        </div>

        {/* FILTER BAR */}
        <div className="filter-bar">

          <select className="filter-select" value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)}>
            {BLOOD_GROUPS.map(g => <option key={g}>{g}</option>)}
          </select>

          <select className="filter-select" value={selectedCity} onChange={e => setSelectedCity(e.target.value)}>
            {CITIES.map(c => <option key={c}>{c}</option>)}
          </select>

          <button className="btn-search" onClick={handleSearch}>Search</button>

          {searched && <button className="btn-clear" onClick={handleReset}>Clear</button>}

          <div className="divider"/>

          <label>
            <input type="checkbox"
              checked={sortByAvail}
              onChange={e => setSortByAvail(e.target.checked)} />
            Sort by availability
          </label>

          <span>{displayDonors.length} donors</span>
        </div>

        {/* DONOR LIST */}
        <div className="content">

          {loading ? (
            <p>Loading donors...</p>
          ) : displayDonors.length === 0 ? (
            <p>No donors found</p>
          ) : (
            <div className="grid">
              {displayDonors.map(donor => {

                const alreadySent = requests.some(r => r.donorId === donor.id);

                return (
                  <div className="card" key={donor.id}>
                    <div className="card-top">
                      <img className="avatar" src={donor.avatarUrl} alt="" />

                      <div>
                        <div>{donor.name}</div>
                        <div>📍 {donor.city}</div>
                      </div>

                      <div
                        className="blood-badge"
                        style={{ background: BG_COLORS[donor.bloodGroup] }}
                      >
                        {donor.bloodGroup}
                      </div>
                    </div>

                    <div className="card-bottom">

                      <span style={{color: donor.available ? "green" : "red"}}>
                        {donor.available ? "Available" : "Unavailable"}
                      </span>

                      <button
                        className="btn-request"
                        disabled={!donor.available || alreadySent}
                        onClick={() => sendRequest(donor)}
                        style={{
                          background: alreadySent ? "#c6f6d5" : donor.available ? "#2b6cb0" : "#eee",
                          color: alreadySent ? "green" : donor.available ? "white" : "#aaa"
                        }}
                      >
                        {alreadySent ? "Request Sent ✅" : "Request Help"}
                      </button>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ---------- MY REQUESTS PANEL ---------- */}
          <hr style={{margin:"50px 0"}} />

          <h2>My Requests</h2>

          {requests.length === 0 ? (
            <p>No requests sent yet</p>
          ) : (
            <div className="grid">
              {requests.map(req => (
                <div className="card" key={req.id}>
                  <div className="card-top">
                    <div>
                      <div>{req.name}</div>
                      <div>📍 {req.city}</div>
                    </div>

                    <div
                      className="blood-badge"
                      style={{ background: BG_COLORS[req.bloodGroup] }}
                    >
                      {req.bloodGroup}
                    </div>
                  </div>

                  <div className="card-bottom">

                    <small>{req.date}</small>

                    <span style={{
                      padding:"6px 12px",
                      borderRadius:8,
                      color:"white",
                      fontWeight:600,
                      background:
                        req.status==="accepted" ? "green" :
                        req.status==="rejected" ? "red" :
                        "orange"
                    }}>
                      {req.status}
                    </span>

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
