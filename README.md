# 🌊 Ocean Search
### AI-Powered Deep Ocean Pollution & Biodiversity Monitoring

**OceanSearch** is an interactive frontend platform designed for the **HackOcean Frontend Hackathon**. It bridges the gap between complex marine AI monitoring systems and public engagement through immersive storytelling, real-time data visualization, and gamified conservation experiences.

---

## 🚀 Problem Statement

Ocean conservation faces two major challenges:

- **Public Disconnect**
  - Environmental data is often too technical and overwhelming.
  - Low public engagement leads to fewer donations and volunteers.

- **Complex Data Monitoring**
  - Marine researchers need an intuitive interface to monitor AI, IoT, sonar, and environmental data in real time.

Our goal is to create a unified frontend that makes ocean conservation both **engaging for the public** and **powerful for researchers**.

---

# ✨ Features

## 🌊 Scroll-to-Dive Experience
A storytelling interface where the webpage transitions from the ocean surface into the deep sea as users scroll.
- Dynamic background transitions
- Immersive animations
- Interactive storytelling

---

## 🌞 Public Portal (Surface)
Designed to encourage public participation and awareness.
- 💙 Donation impact slider
- 🎮 Gamified volunteer registration
- 📈 Ocean conservation statistics
- 📸 Beautiful immersive UI

---

## 🌑 Command Center (Abyss)
A professional, high-tech dark mode dashboard for marine monitoring.
- 🤖 **Simulated AI Video Detection**: Real-time bounding boxes detecting species and plastics.
- 🗺️ **Live Pollution Heatmaps**: Spatial data visualization of ocean health.
- 🚁 **Fleet Command Center**: An interactive roster to monitor and control autonomous underwater drones (`RX-7A`, `NX-2B`, etc.). Features GSAP-animated telemetry dials (Battery, Storage) and live mission terminal logs.
- 🧪 **Digital Twin Simulation**: A sandbox environment where policymakers can adjust environmental levers (Gov Enforcement Budget, Fishing Penalties, Temperature) and instantly view the simulated impact on Ecological Tipping Points and the Blue Economy (Revenue & ROI in Indian Rupees).

---

# 🌟 Unique Selling Points

### 🧪 Interactive Digital Twin
Dynamic state-driven simulation engine that calculates biomass recovery and financial outcomes (Carbon Credits, Eco-Tourism) based on user-adjusted policy sliders.

### 🚁 Fleet Telemetry Dials
GSAP-powered SVG circle gauges that smoothly spool up or down when switching between active and offline drone units.

### 🤖 Simulated AI UI
CSS animations and DOM overlays simulate real-time AI detections without requiring backend inference.

### ♿ Accessibility First
- Fully responsive App Router architecture
- SEO optimized
- High-contrast premium dark mode UI

---

# 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14+ (App Router) / React |
| Styling | Tailwind CSS |
| UI Components | Phosphor Icons, Custom Glassmorphism |
| Animations | Framer Motion & GSAP (`@gsap/react`) |
| Data Vis | Native SVG Animations & CSS Gradients |

---

# 📂 Project Structure

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

# ⚙️ Installation

To run this frontend locally:

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

For production build:

```bash
npm run build
npm start
```

---

# 🎯 Future Improvements

- Backend AI integration for real-time video feed inference
- Live IoT sensor connectivity for physical drones
- Donation payment gateway integration (Stripe/Razorpay)
- Multi-language support for global NGOs

---

# 🌍 Vision

> Making ocean conservation engaging for everyone while empowering researchers with an immersive AI-driven monitoring platform.
