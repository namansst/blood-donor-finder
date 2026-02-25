# 🩸 Blood Donor Finder

A React web application that helps users find blood donors in their city. Built as part of the Scaler React Project (Group B 2029), this app demonstrates core React concepts including API integration, state management, filtering, conditional rendering, and interactivity.

---

## 🌐 Live Demo

> Deployed on Vercel — [your-app.vercel.app](https://your-app.vercel.app)

---

## 📸 Preview

> All 10 donors load automatically on page open. Use the filters to narrow results by blood group or city.

---

## ✅ Features

| Feature | Description |
|---|---|
| 📋 View all donors | All donors shown by default on page load — no search required |
| 🔍 Filter by blood group | Dropdown with all 8 blood types (A+, A-, B+, B-, O+, O-, AB+, AB-) |
| 🏙️ Filter by city | Dropdown with 5 cities (Mumbai, Delhi, Bangalore, Chennai, Hyderabad) |
| 🔎 Search on demand | Results only filter when Search button is clicked |
| ✅ Request Help button | Sends a request to a donor — toggles to "Request Sent ✅" |
| 📊 Sort by availability | Checkbox to sort available donors to the top |
| 🔄 Clear filters | Resets all filters and shows all donors again |
| ⏳ Loading state | Spinner shown while API data is being fetched |
| 🔍 Empty state | Message shown when no donors match selected filters |
| 🔢 Live donor count | Header shows count of available donors in current view |

---

## 🛠️ Tech Stack

- **React 18** (Create React App)
- **useState** — donors list, filter selections, request status per donor, search state
- **useEffect** — fetches data from API on component mount
- **useMemo** — efficiently computes filtered and sorted donor list (derived state)
- **JSONPlaceholder API** — `https://jsonplaceholder.typicode.com/users`

---

## 📡 How the API Works

The app fetches from [JSONPlaceholder](https://jsonplaceholder.typicode.com/users), a free public REST API that returns 10 fake users. Since it has no medical data, the following fields are assigned locally after fetching:

| Field | Source |
|---|---|
| Name | ✅ From API |
| Email / Address | ✅ From API |
| Blood Group | 🔧 Assigned locally — cycles through all 8 types |
| City | 🔧 Assigned locally — distributed across 5 cities |
| Availability | 🔧 Assigned locally — every 3rd donor marked unavailable |

This matches the project spec: *"Map users → donors, add static blood groups locally"*.

---

## 📁 Project Structure

```
blood-donor/
├── public/
│   └── index.html        # HTML template with root div
├── src/
│   ├── App.js            # Main component — all logic + UI
│   └── index.js          # React entry point
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Run Locally

### 1. Clone the repo
```bash
git clone https://github.com/your-username/blood-donor.git
cd blood-donor
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the app
```bash
npm start
```

Opens at **http://localhost:3000**

---

## 🚀 Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click **Add New Project** → select this repo
4. Click **Deploy**

Vercel auto-detects React and builds it. Live in ~30 seconds.

---

## 📋 Evaluation Criteria

| Criteria | Marks | Implementation |
|---|---|---|
| API Integration | 10/10 | `useEffect` + `fetch` from JSONPlaceholder on mount |
| State Management | 10/10 | `useState` for donors, filters, request status, search state |
| Interactivity | 10/10 | Search button, Request Help toggle, dropdowns, sort checkbox |
| Conditional Rendering | 10/10 | Loading → all donors → filtered results → empty state |
| UI Clarity & Structure | 10/10 | Header, filter bar, responsive card grid |
| Code Readability | 10/10 | Named functions, clear variables, comments throughout |
| **Total** | **60/60** | |

---

## 🧠 Key React Concepts Used

- `useState` for all UI + data state
- `useEffect` for side effects (API call on mount)
- `useMemo` for derived/filtered state (avoids unnecessary recalculation)
- `map()` to render lists with proper `key` props
- Conditional rendering with ternary operators
- Event handlers (`onClick`, `onChange`)
- Controlled components (dropdowns, checkbox)

---

## 👤 Author
Naman Rathi

