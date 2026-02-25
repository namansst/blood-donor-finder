import { useEffect, useState } from "react";
import { getMyRequests } from "../services/requestService";

export default function MyRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const data = getMyRequests("user@email.com");
    setRequests(data);
  }, []);

  return (
    <div className="container">
      <h2>My Requests</h2>

      {requests.length === 0 && <p>No requests sent yet.</p>}

      {requests.map(req => (
        <div key={req.id} className="card">
          <p><b>Blood:</b> {req.bloodGroup}</p>
          <p><b>City:</b> {req.city}</p>
          <p><b>Date:</b> {new Date(req.date).toLocaleDateString()}</p>

          <span className={`status ${req.status}`}>
            {req.status}
          </span>
        </div>
      ))}
    </div>
  );
}
