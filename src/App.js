import { useState, useEffect, useMemo } from "react";

const BLOOD_GROUPS = ["All","A+","A-","B+","B-","O+","O-","AB+","AB-"];
const CITIES = ["All","Mumbai","Delhi","Bangalore","Chennai","Hyderabad"];

const BG_LIST = BLOOD_GROUPS.filter(g=>g!=="All");
const CITY_LIST = CITIES.filter(c=>c!=="All");

const BG_COLORS={
"A+":"#e53e3e","A-":"#c05621","B+":"#2b6cb0","B-":"#553c9a",
"O+":"#276749","O-":"#285e61","AB+":"#6b46c1","AB-":"#97266d"
};

function assignDonorMeta(users){
return users.map((u,i)=>({
...u,
bloodGroup:BG_LIST[i%BG_LIST.length],
city:CITY_LIST[(i*7+3)%CITY_LIST.length],
available:i%3!==2,
avatar:`https://api.dicebear.com/7.x/personas/svg?seed=${u.name}`
}));
}

export default function App(){

const [donors,setDonors]=useState([]);
const [loading,setLoading]=useState(true);

const [selectedGroup,setSelectedGroup]=useState("All");
const [selectedCity,setSelectedCity]=useState("All");

const [appliedGroup,setAppliedGroup]=useState("All");
const [appliedCity,setAppliedCity]=useState("All");
const [searched,setSearched]=useState(false);

const [requests,setRequests]=useState(()=>{
return JSON.parse(localStorage.getItem("requests")||"[]");
});

useEffect(()=>{
fetch("https://jsonplaceholder.typicode.com/users")
.then(r=>r.json())
.then(d=>{
setDonors(assignDonorMeta(d));
setLoading(false);
});
},[]);

const sendRequest=(donor)=>{
const req={
id:Date.now(),
donorId:donor.id,
name:donor.name,
bloodGroup:donor.bloodGroup,
city:donor.city,
status:"pending",
date:new Date().toLocaleString()
};

const updated=[...requests,req];
setRequests(updated);
localStorage.setItem("requests",JSON.stringify(updated));
};

const cancelRequest=(id)=>{
const updated=requests.filter(r=>r.id!==id);
setRequests(updated);
localStorage.setItem("requests",JSON.stringify(updated));
};

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

const displayDonors=useMemo(()=>{
let list=[...donors];
if(searched){
if(appliedGroup!=="All") list=list.filter(d=>d.bloodGroup===appliedGroup);
if(appliedCity!=="All") list=list.filter(d=>d.city===appliedCity);
}
return list;
},[donors,appliedGroup,appliedCity,searched]);

return(
<div style={{padding:30,fontFamily:"sans-serif"}}>

<h1>Blood Donor Finder</h1>

<div style={{marginBottom:20}}>

<select value={selectedGroup} onChange={e=>setSelectedGroup(e.target.value)}>
{BLOOD_GROUPS.map(g=><option key={g}>{g}</option>)}
</select>

<select value={selectedCity} onChange={e=>setSelectedCity(e.target.value)}>
{CITIES.map(c=><option key={c}>{c}</option>)}
</select>

<button onClick={handleSearch}>Search</button>
<button onClick={handleReset}>Clear</button>

</div>

{loading? <p>Loading...</p> : (

<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:15}}>

{displayDonors.map(donor=>{

const sent=requests.some(r=>r.donorId===donor.id);

return(
<div key={donor.id} style={{border:"1px solid #ddd",padding:15,borderRadius:10}}>

<img src={donor.avatar} width={50} />

<h3>{donor.name}</h3>
<p>{donor.city}</p>

<div style={{color:"white",background:BG_COLORS[donor.bloodGroup],display:"inline-block",padding:"4px 10px",borderRadius:6}}>
{donor.bloodGroup}
</div>

<p style={{color:donor.available?"green":"red"}}>
{donor.available?"Available":"Unavailable"}
</p>

<button
disabled={!donor.available||sent}
onClick={()=>sendRequest(donor)}
>
{sent?"Request Sent":"Request"}
</button>

</div>
);
})}

</div>
)}

<hr style={{margin:"40px 0"}}/>

<h2>My Requests</h2>

{requests.length===0 && <p>No requests yet</p>}

{requests.map(r=>(
<div key={r.id} style={{border:"1px solid #ddd",padding:10,marginBottom:10}}>

<b>{r.name}</b> — {r.city} — {r.bloodGroup}

<div>Status: {r.status}</div>

<button onClick={()=>cancelRequest(r.id)}>
Cancel Request
</button>

</div>
))}

</div>
);
}
