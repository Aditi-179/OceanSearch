<div align="center">
  <h1>🌊 OceanSearch</h1>
  <p><b>AI-Powered Deep Ocean Pollution & Biodiversity Monitoring</b></p>

  [![Live Demo](https://img.shields.io/badge/Live-Demo-00F0FF?style=for-the-badge&logo=vercel&logoColor=black)](https://oceansearch-opal.vercel.app/)
  [![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/Aditi-179/OceanSearch)
</div>

---

## 📋 Project Overview

- **Event Name:** HackOcean 2026 - Round 2
- **Team Name:** CodeSib
- **Team Leader:** Yukta Chaudhari (8007384911)
- **Problem Statement:** PS03

### 📝 Summary
OceanSearch is a highly interactive, scrollytelling web application that takes users on a visual descent through the ocean's depth zones. It blends a breathtaking 3D WebGL underwater ecosystem with real-time UI overlays that simulate AI-driven marine tracking, environmental IoT telemetry, and marine life discovery to create a next-generation educational platform.

### 🚀 The Problem Being Solved
Traditional environmental data (such as coral bleaching, microplastic accumulation, and overfishing) is often presented in static, dry reports that fail to emotionally engage the general public. This project bridges that gap by visualizing ocean health crises and marine biology in a highly immersive, game-like digital experience, fostering empathy, deep education, and conservation action.

---

## 🌟 Unique Selling Points (USP)

1. **Gamified Environmental Empathy:** Data visualization via immersive gameplay.
2. **3D Canvas & DOM UI Integration:** Screen-space UI dynamically locked to 3D WebGL objects.
3. **Dual-Persona Interface:** A public narrative portal combined with a professional scientific admin dashboard.
4. **Procedural Living Ecosystems:** Boids AI swarms & dynamic custom shaders generating a living ocean.

---

## ✨ Key Features

1. **Interactive 3D Depth Scrollytelling:** Procedural WebGL ocean descent utilizing smooth scrolling.
2. **AI Benthic Vision Scanner:** Real-time 3D marine life identification and classification.
3. **Deep-Sea Drone Fleet Dashboard:** Command center for AUV telemetry, battery/storage tracking, and live simulated camera feeds.
4. **Predictive AI Risk Map:** Time-lapse pollution and threat simulation mapping.
5. **Live Incident Logging:** Real-time localized marine threat alerts.
6. **IoT Telemetry Overlay:** Real-time tracking of depth, temperature, pH, and coral stress levels.
7. **Policy & Environment Simulation (Digital Twin):** An interactive sandbox to simulate ecological outcomes and economic ROI (Blue Economy).
8. **Ecosystem "Healing" Mechanics:** Interactive 3D environment restoration based on user actions.

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Core Framework** | Next.js 14+ (App Router), React 19 |
| **3D / WebGL** | React Three Fiber, `@react-three/drei`, Three.js |
| **Styling** | Tailwind CSS v4 |
| **Animations & Scrolling** | GSAP (`@gsap/react`), Lenis (smooth scrolling), Framer Motion |
| **Data Visualization & Mapping** | Recharts, Mapbox GL, React-Map-GL |
| **Icons** | Lucide React, Phosphor Icons |
| **Real-time Comms** | `socket.io-client` |

---

## 📂 Project Structure

```text
OceanSearch/
│
├── frontend_2/
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/       # Main command center
│   │   │   │   ├── fleet/       # Drone fleet management
│   │   │   │   └── settings/    # Generic settings
│   │   │   └── simulation/      # Digital Twin ecosystem
│   │   ├── components/          # Reusable UI (Sidebar, Navbar)
│   │   └── lib/
│   │
│   ├── package.json
│   ├── tailwind.config.ts
│   └── next.config.mjs
└── README.md
```

---

## ⚙️ Installation & Setup

To run the OceanSearch frontend locally:

```bash
# Clone the repository
git clone https://github.com/Aditi-179/OceanSearch.git

# Navigate to the frontend directory
cd OceanSearch/frontend_2

# Install dependencies
npm install

# Start the development server
npm run dev
```

For a production build:

```bash
npm run build
npm start
```

---

## 🎯 Future Scope

1. Backend AI integration for real-time video feed inference
2. Live underwater drone feeds
3. Real-time IoT sensor connectivity
4. AI-powered marine species detection
5. Donation payment gateway integration (Stripe/Razorpay)
6. Multi-language support for global NGOs
7. Progressive Web App (PWA) deployment
