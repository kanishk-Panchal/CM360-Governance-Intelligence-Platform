<div align="center">

# 🏛️ CM360 — Governance Intelligence Platform

**CM360 is a real-time, closed-loop grievance monitoring and accountability system designed for Chief Ministers, government officials and everyday citizens. It bridges the gap between public reporting and bureaucratic action through automated routing, live analytics, and strict evidence-based verification.**

[![Live Demo](https://img.shields.io/badge/Demo-Live_Site-blue?style=for-the-badge)](https://cm360-orpin.vercel.app/)
[![Frontend](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)]()
[![Backend](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)]()
[![Database](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)]()
[![Status](https://img.shields.io/badge/Status-Deployed-success?style=for-the-badge)]()

### 🚨 [CLICK HERE TO VIEW THE LIVE PROJECT](https://cm360-orpin.vercel.app/) 🚨

</div>

---

## 📸 Product Preview

<div align="center">
<img src="./assets/cm-dashboard.png" alt="CM360 Command Center Dashboard" width="850"/>
<p><em>The CM Command Center — live district hotspots, citizen trust index, and critical alert monitoring.</em></p>
</div>

>

---

## 🎯 The Problem

Traditional grievance systems suffer from **"black hole" reporting** — citizens file complaints and never hear back, while top officials have no real oversight into which departments are actually resolving issues versus quietly closing tickets without action.

This isn't a tooling gap. It's an **accountability gap**, and most systems are built in a way that lets it persist.

## 💡 The Solution

CM360 closes the loop structurally, not procedurally — the system makes false closures and silent stalling difficult, rather than just discouraging them as policy.

| Mechanism | What It Does |
|---|---|
| 🧭 **Automated Magic Routing** | Every grievance is auto-assigned to the exact officer responsible for that district + department — no manual sorting, no bounced tickets. |
| 📷 **Anti-Corruption Verification** | Officers cannot mark a ticket "Resolved" by clicking a button. They are structurally required to upload photographic evidence of the fix. |
| ✅ **Citizen Trust Loop** | A ticket is only permanently closed once the citizen verifies the resolution. Rejected fixes reopen automatically and impact the department's accountability score. |
| 📊 **Live Department Scoreboard** | Every department (PWD, DJB, BSES) is ranked on real, verified closures — not self-reported numbers. |

---

## ✨ Key Features

- **CM Command Center** — A high-level analytics dashboard with live sync, critical alert monitoring, and a real-time Citizen Trust Index.
- **District Hotspot Mapping** — Live visual distribution of grievances across jurisdictions, built with Recharts.
- **Department Accountability Scoreboard** — Algorithmic performance scoring based on verified closures, not self-reported status.
- **Secure Evidence Vault** — Cloudinary-backed, immutable photo storage for both citizen-filed and officer-resolved evidence.
- **Role-Based Access Control (RBAC)** — Strict JWT-driven middleware enforcing data isolation between Citizens, Officers, and Admins.

---

## 🚀 Live Demo & Test Access

The platform is fully deployed and ready for review — no setup required.

**🔗 Live Link:** [https://cm360-orpin.vercel.app/](https://cm360-orpin.vercel.app/)

> 💡 **Recommended for reviewers:** Open two browser windows side-by-side — one logged in as **Citizen**, one as **Officer** — and watch a grievance move through the full lifecycle in real time.

### 🔑 Demo Accounts

| Role | Email | Password | Access Level |
|---|---|---|---|
| 🏛️ **Chief Minister / Admin** | `cm@delhi.gov.in` | `12345` | CM Command Center, live district hotspots, departmental accountability scores |
| 👮 **Department Officer** | `sanjay@gmail.com` | `12345` | Assigned district tickets; must upload photo evidence to resolve grievances |
| 👤 **Citizen** | `kanishk@gmail.com` | `12345` | File grievances, track live status, verify or reject officer resolutions |
| 👤 **Admin** | `admin@gmail` | `12345` | Admin portal, add and manage department officers |


---

## 🛠️ Technical Architecture

Built on the **MERN** stack with a fully decoupled, independently scalable frontend and backend.

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   React.js       │ ───▶ │   Node.js /        │ ───▶ │   MongoDB Atlas   │
│   Tailwind CSS    │      │   Express.js       │      │   Mongoose ODM    │
│   Recharts         │      │   JWT Auth Layer   │      │   Schema Validation│
│   (Vercel)          │      │   (Render)           │      │                     │
└─────────────────┘      └──────────────────┘      └─────────────────┘
                                    │
                                    ▼
                          ┌──────────────────┐
                          │   Cloudinary API   │
                          │   Evidence Storage  │
                          └──────────────────┘
```

| Layer | Technology | Notes |
|---|---|---|
| **Frontend** | React.js, Tailwind CSS, Lucide Icons, Recharts | Hosted on Vercel |
| **Backend** | Node.js, Express.js, JWT Authentication | Hosted on Render |
| **Database** | MongoDB Atlas + Mongoose ODM | Strict enum schema validation |
| **Storage** | Cloudinary API | Multipart/form-data image handling for evidence uploads |

---

## 💻 Local Setup & Installation

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account
- Cloudinary account

### 1. Clone the repository
```bash
git clone https://github.com/YourUsername/YourRepoName.git
cd YourRepoName
```

### 2. Install dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 3. Configure environment variables

Create a `.env` file inside `/server`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```


### 4. Run the application
```bash
# Terminal 1 — start backend
cd backend
npm run dev

# Terminal 2 — start frontend
cd frontend
npm run dev
```

The app will be running at `http://localhost:5173` (frontend) and `http://localhost:5000` (backend API).

---

## 🗺️ Roadmap

- [ ] WhatsApp Business API integration for grievance filing
- [ ] MCD311 API sync with graceful fallback
- [ ] AI-based auto-categorization and duplicate detection
- [ ] Officer fraud-score analytics dashboard
- [ ] Multi-language support (Hindi, Punjabi, Urdu)

---

## 👥 Team zerolatency

---

## 📄 License

This project was built for submission to the Delhi Government Hackathon initiative. All rights reserved unless otherwise specified.

---

<div align="center">

**Built to close the loop between citizens and government.**

[Live Demo](https://cm360-orpin.vercel.app/) · Made with ❤️ for Delhi

</div>

