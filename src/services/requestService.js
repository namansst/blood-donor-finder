const KEY = "blood_requests";

export const saveRequest = (request) => {
  const existing = JSON.parse(localStorage.getItem(KEY)) || [];
  existing.push(request);
  localStorage.setItem(KEY, JSON.stringify(existing));
};

export const getMyRequests = (email) => {
  const all = JSON.parse(localStorage.getItem(KEY)) || [];
  return all.filter(r => r.requesterEmail === email);
};

export const updateRequestStatus = (id, status) => {
  const all = JSON.parse(localStorage.getItem(KEY)) || [];
  const updated = all.map(r =>
    r.id === id ? { ...r, status } : r
  );
  localStorage.setItem(KEY, JSON.stringify(updated));
};
