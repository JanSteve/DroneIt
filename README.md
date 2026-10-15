# 🚁 Droneit — Autonomous 3–5 Min Aerial Quick-Commerce & GreenLoop Platform

> **Premier BBA Business Project • 2026**  
> *"Why travel through traffic when your delivery can take flight?"*  
> **Contact**: +91 8438110297 | [@drone.it](https://instagram.com/drone.it) | [Droneiteco@gmail.com](mailto:Droneiteco@gmail.com)

---

## 🌟 Executive Overview

**Droneit** is an autonomous drone-powered quick-commerce platform delivering everyday essentials, hot meals, licensed emergency medicines, beauty products, campus print jobs, and small electronics in **under 5 minutes** via rooftop and verified community drop pads.

Integrated with our proprietary **GreenLoop** circular packaging initiative, every delivery uses biodegradable paper packaging with **plantable seed tags** and a verified bag-return credit system, making Droneit faster, smarter, and greener than traditional road-congested quick-commerce fleets.

---

## ⚡ Core Platform Capabilities

### 1. Dual-Mode Architecture (Zero-CLS Instant Toggle)
- **Consumer Quick-Commerce Store**: High-speed shopping experience featuring a 32-item catalog across 6 vital categories with instant sub-10ms search, category filtering, and drawer checkout.
- **Judges & Investor Pitch Deck Room**: Dedicated interactive investor portal containing real-time unit economics simulators, DGCA Digital Sky regulatory matrix, competitor defense grid (vs. Blinkit, Zepto, Instamart), and pilot launch milestones.

### 2. Intelligent Drone-Safe Cart & Payload Physics
- **Avionics Payload Gauge**: Real-time weight tracking down to the gram against a strict **2.50 kg DGCA safe payload limit**.
- **First-Fit Decreasing (FFD) Bin-Packing**: Overweight carts automatically offer greedy partitioning into **Sortie Alpha** and **Sortie Bravo** (dual-drone launch for ₹79) or seamless routing to a **Partner Ground Electric Vehicle (EV) Courier** (₹29, up to 15 kg).
- **DGCA Verified Safe Drop-Zones**: Pre-cleared landing zones (Campus Rooftop Pad, Tech Park Pad, Society Lawn, Verified Tether Point) with safety buffers and precise instructions.

### 3. Live 3–5 Min Flight Radar & Telemetry HUD
- **Real-Time Vector Radar**: 360° rotating sweep beam, Koramangala dark hub to drop-zone Bézier flight corridor, and live aircraft banking roll.
- **Avionics Telemetry HUD**: Monospace countdown timer (`03:00` → `00:00`), 45m cruise altitude tape gauge, 40 km/h airspeed indicator, battery discharge curve, and 5G BVLOS mesh link status.
- **Tether Winch Release Animation**: 15m station-keeping hover with Dyneema tether unspooling, belly camera feed, and ground touchdown decoupling.
- **Pitch Demo Speed Controls**: 1x, 5x, and 15x multipliers with instant stage jumping to execute a full 3-minute delivery demonstration in 15 seconds for judges.
- **4-Digit Secure OTP**: Automated delivery receipt with security pickup PIN and earned GreenLoop seed-tag credits.

### 4. Interactive Unit Economics & Regulatory Defense
- **Interactive Financial Viability Simulator**: Real-time sliders for daily orders, average order value (AOV), delivery fee (₹49 base, ₹79 priority), and battery replacement cycle costs.
- **DGCA & Digital Sky Matrix**: Explicit compliance with India Drone Rules 2021 & 2022 amendments, Green Zone 400 ft AGL permission-free operations, Beyond Visual Line of Sight (BVLOS) failsafes, and bad-weather automatic ground fallback.
- **GreenLoop Impact Metrics**: Live counters of single-use plastic bags eliminated, seed tags germinated, and customer circular packaging credits distributed.

---

## 🛠 Tech Stack

- **Framework**: React 18 with TypeScript
- **Bundler**: Vite 5
- **Styling**: Tailwind CSS with custom avionics & glow aesthetics
- **Icons**: Lucide React
- **Audio Engine**: Web Audio API (procedural drone hum & touchdown cues)
- **Testing**: Custom zero-dependency test runner with 115 E2E tests, 32 stress tests, and 20 remediation tests (100% pass rate)

---

## 🚀 Quickstart Guide

### 1. Installation
```bash
git clone <your-repo-url>
cd DroneIt
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Run Test Suite
```bash
npm test
# Or run all 115 tests directly:
node tests/run-tests.mjs
# Run stress tests:
node tests/stress/run-all-stress.mjs
```

### 4. Build for Production
```bash
npm run build
```
Generates optimized, production-ready static assets in the `dist/` directory.

---

## ☁️ Deploying to Cloudflare Pages (Free `.pages.dev` Domain)

### Method A: Connect via GitHub (Automatic CI/CD)
1. Push this repository to your GitHub account (see instructions below).
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select your `DroneIt` repository.
4. Configure Build Settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Click **Save and Deploy**. In under 1 minute, your site will be live at:
   `https://droneit.pages.dev` (or your chosen project name).

### Method B: Direct Upload via Wrangler CLI
```bash
npx wrangler pages deploy dist --project-name=droneit
```

---

## 📜 Regulatory Reference & Compliance
- **Directorate General of Civil Aviation (DGCA)**: [dgca.gov.in](https://dgca.gov.in)
- **Digital Sky Airspace Map**: [digitalsky.aai.aero](https://digitalsky.aai.aero)
- **Statutory Framework**: India Drone Rules 2021 & Drone (Amendment) Rules 2022
