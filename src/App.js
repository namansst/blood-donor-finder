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
    avatarUrl: `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(user.name)}`
  }));
}

const styles = `
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:sans-serif}
.app{background:#f0f4f8;min-height:100vh}
.header{background:#1a365d;color:white;padding:16px 32px;display:flex;justify-content:space-between}
.filter-bar{background:white;padding:14px 32px;display:flex;gap:10px;flex-wrap:wrap}
.content{padding:30px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:18px}
.card{background:white;border-radius:12px;border:1px solid #e2e8f0}
.card-top{padding:14px;display:flex;gap:12px;align-items:center;border-bottom:1px solid #eee}
.card-bottom{padding:14px;display:flex;justify-content:space-between;align-items:center}
.avatar{width:52px;height:52px;border-radius:50%}
.blood-badge{margin-left:auto;width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold}
button{cursor:pointer;border:none;border-radius:6px;padding:6px 14px;font-weight:600}
`;

export default function App(){

const [donors,setDonors]=useState([]);
const [loading,setLoading]=useState(true);

const [selectedGroup,setSelectedGroup]=useState("All");
const [selectedCity,setSelectedCity]=useState("All");
const [searched,setSearched]=useState(false);
const [appliedGroup,setAppliedGroup]=useState("All");
const [appliedCity,setAppliedCity]=useState("All");

/* REQUEST STORAGE */
const [requests,setRequests]=useState(()=>{
return JSON.parse(localStorage.getItem("requests")||"[]")
});

/* SEND REQUEST */
const sendRequest=(donor)=>{
const newReq={
id:Date.now(),
donorId:donor.id,
name:donor.name,
bloodGroup:donor.bloodGroup,
city:donor.city,
status:"pending",
date:new Date().toLocaleString()
};
const updated=[...requests,newReq];
setRequests(updated);
localStorage.setItem("requests",JSON.stringify(updated));
};

/* CANCEL REQUEST */
const cancelRequest=(id)=>{
const updated=requests.filter(r=>r.id!==id);
setRequests(updated);
localStorage.setItem("requests",JSON.stringify(updated));
};

/* FETCH USERS */
useEffect(()=>{
fetch("https://jsonplaceholder.typicode.com/users")
.then(r=>r.json())
.then(data=>{
setDonors(assignDonorMeta(data));
setLoading(false);
})
.catch(()=>setLoading(false));
},[]);

/* SEARCH */
const handleSearch=()=>{
setAppliedGroup(selectedGroup);
setAppliedCity(selectedCity);
setSearched(true);
};

const handleReset=()=>{
setSelectedGroup("All");
setSelectedCity("All");
setAppliedGroup("All");
setAppliedCity("All");
setSearched(false);
};

/* FILTER */
const displayDonors=useMemo(()=>{
let list=[...donors];
if(searched){
if(appliedGroup!=="All") list=list.filter(d=>d.bloodGroup===appliedGroup);
if(appliedCity!=="All") list=list.filter(d=>d.city===appliedCity);
}
return list;
},[donors,appliedGroup,appliedCity,searched]);

const availableCount=displayDonors.filter(d=>d.available).length;

return(
<>
<style>{styles}</style>
<div className="app">

{/* HEADER */}
<div className="header">
<h2>Blood Donor Finder</h2>
<div>Available: {availableCount}</div>
</div>

{/* FILTER */}
<div className="filter-bar">

<select value={selectedGroup} onChange={e=>setSelectedGroup(e.target.value)}>
{BLOOD_GROUPS.map(g=><option key={g}>{g}</option>)}
</select>

<select value={selectedCity} onChange={e=>setSelectedCity(e.target.value)}>
{CITIES.map(c=><option key={c}>{c}</option>)}
</select>

<button onClick={handleSearch}>Search</button>
{searched && <button onClick={handleReset}>Clear</button>}

<span>{displayDonors.length} donors</span>
</div>

{/* DONORS */}
<div className="content">

{loading? <p>Loading...</p> : (
<div className="grid">
{displayDonors.map(donor=>{

const alreadySent=requests.some(r=>r.donorId===donor.id);

return(
<div className="card" key={donor.id}>
<div className="card-top">
<img className="avatar" src={donor.avatarUrl}/>
<div>
<div>{donor.name}</div>
<div>📍 {donor.city}</div>
</div>

<div className="blood-badge" style={{background:BG_COLORS[donor.bloodGroup]}}>
{donor.bloodGroup}
</div>
</div>

<div className="card-bottom">

<span style={{color:donor.available?"green":"red"}}>
{donor.available?"Available":"Unavailable"}
</span>

<button
disabled={!donor.available||alreadySent}
onClick={()=>sendRequest(donor)}
style={{
background:alreadySent?"#c6f6d5":donor.available?"#2b6cb0":"#ddd",
color:alreadySent?"green":"white"
}}
>
{alreadySent?"Request Sent":"Request"}
</button>

</div>
</div>
);
})}
</div>
)}

{/* REQUEST HISTORY */}
<hr style={{margin:"50px 0"}}/>
<h2>My Requests</h2>

{requests.length===0 ? <p>No requests yet</p> : (

<div className="grid">
{requests.map(req=>(
<div className="card" key={req.id}>

<div className="card-top">
<div>
<div>{req.name}</div>
<div>📍 {req.city}</div>
</div>

<div className="blood-badge" style={{background:BG_COLORS[req.bloodGroup]}}>
{req.bloodGroup}
</div>
</div>

<div className="card-bottom">

<small>{req.date}</small>

<div style={{display:"flex",gap:8}}>

<span style={{
background:req.status==="accepted"?"green":req.status==="rejected"?"red":"orange",
color:"white",
padding:"6px 10px",
borderRadius:6,
fontSize:12
}}>
{req.status}
</span>

<button
onClick={()=>cancelRequest(req.id)}
style={{background:"#e53e3e",color:"white"}}
>
Cancel
</button>

</div>
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
