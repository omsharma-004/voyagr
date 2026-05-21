# 🌍 Voyagr — AI Travel Planner

A production-grade AI-powered travel planning web app built with React, Groq (Llama 3), Firebase, and real-time APIs.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | CSS Modules (custom, no Tailwind) |
| Animation | Framer Motion |
| AI | Groq API — `llama-3.1-8b-instant` |
| Maps | Leaflet.js + OpenStreetMap |
| Auth | Firebase Authentication (Google) |
| Database | Firebase Firestore |
| Weather | OpenWeatherMap API |
| Currency | ExchangeRate API |
| Countries | REST Countries API |
| Geocoding | Nominatim (OpenStreetMap) |
| Deployment | Vercel |

---

## 📦 Installation

### 1. Clone and install

```bash
git clone <your-repo-url>
cd voyagr
npm install
```

### 2. Set up environment variables

Copy `.env` and fill in Firebase keys:

```bash
cp .env .env.local
```

Edit `.env.local`:

```env
# Weather API (OpenWeatherMap)
VITE_WEATHER_API_KEY=YOUR_WEATHER_API_KEY

# Currency Exchange API
VITE_EXCHANGE_API_KEY=YOUR_EXCHANGE_API_KEY

# Groq AI API
VITE_GROQ_API_KEY=YOUR_GROQ_API_KEY

# Firebase Config
VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
```

### 3. Run development server

```bash
npm run dev
```

---

## 🔥 Firebase Setup (Required)

### Step 1 — Create Firebase project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add Project** → name it `voyagr`
3. Disable Google Analytics (optional) → **Create Project**

### Step 2 — Enable Authentication

1. In Firebase console → **Authentication** → **Get Started**
2. **Sign-in method** tab → Enable **Google**
3. Set project support email → **Save**

### Step 3 — Enable Firestore

1. **Firestore Database** → **Create Database**
2. Choose **Start in test mode** (for development)
3. Select a region → **Done**

### Step 4 — Firestore Security Rules (Production)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /trips/{tripId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### Step 5 — Get Firebase config

1. Project Settings (gear icon) → **General**
2. Scroll to **Your apps** → Click **Web** icon (`</>`)
3. Register app → copy the config object
4. Paste values into `.env.local`

### Step 6 — Add authorized domain for Auth

1. Authentication → **Settings** → **Authorized domains**
2. Add your Vercel domain (e.g. `voyagr.vercel.app`)

---

## 🌐 API Integration Summary

### Groq AI (`src/services/groqService.js`)
- Model: `llama-3.1-8b-instant`
- Endpoint: `POST /v1/chat/completions`
- Uses `response_format: { type: "json_object" }` for structured output
- Prompt includes: weather, country, budget, interests, dates

### OpenWeatherMap (`src/services/weatherService.js`)
- Current weather + 5-day forecast
- Endpoints: `/weather` and `/forecast`

### REST Countries (`src/services/countryService.js`)
- Endpoint: `/alpha/{countryCode}` — always correct, no bugs
- Returns: capital, language, currency, population, timezone, driving side

### ExchangeRate API (`src/services/exchangeService.js`)
- Endpoint: `/latest/USD`
- Converts USD → local currency + EUR, GBP, JPY

### Nominatim (`src/services/geoService.js`)
- OpenStreetMap geocoding — free, no key needed
- Returns: city, state, country, countryCode, lat/lon

---

## 🚢 Deploy to Vercel

### Option 1 — Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option 2 — GitHub + Vercel Dashboard

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your repo
4. **Environment Variables** → add all vars from `.env.local`
5. **Build Command**: `npm run build`
6. **Output Directory**: `dist`
7. Deploy

---

## 📁 File Structure

```
voyagr/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   └── Navbar.module.css
│   │   ├── sections/
│   │   │   ├── Hero.jsx / .module.css
│   │   │   ├── SearchPanel.jsx / .module.css
│   │   │   ├── Destinations.jsx / .module.css
│   │   │   ├── HowItWorks.jsx / .module.css
│   │   │   └── Itinerary.jsx / .module.css
│   │   └── ui/
│   │       ├── LoadingScreen.jsx
│   │       ├── WeatherCard.jsx
│   │       ├── CountryCard.jsx
│   │       ├── CurrencyCard.jsx
│   │       └── TripMap.jsx
│   ├── config/
│   │   ├── api.js          ← All API keys/base URLs
│   │   └── firebase.js     ← Firebase init
│   ├── hooks/
│   │   ├── useAuth.js      ← Auth context
│   │   └── useTrip.js      ← Trip planning state
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── ResultsPage.jsx / .module.css
│   │   └── SavedTripsPage.jsx
│   ├── services/
│   │   ├── authService.js
│   │   ├── tripService.js
│   │   ├── weatherService.js
│   │   ├── countryService.js
│   │   ├── exchangeService.js
│   │   ├── geoService.js
│   │   └── groqService.js
│   ├── utils/
│   │   └── calendarUtils.js
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── vercel.json
├── .env
└── package.json
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Ivory | `#f5f0e8` |
| Terracotta | `#c4603a` |
| Gold | `#c9a84c` |
| Obsidian | `#0d0d0d` |
| Serif font | Cormorant Garamond |
| Sans font | DM Sans |
| Mono font | DM Mono |

---

## ✅ Features Checklist

- [x] AI itinerary generation (Groq Llama 3)
- [x] Destination autocomplete (Nominatim)
- [x] Date range picker with day counter
- [x] Budget selector (animated toggle)
- [x] Interest chips (multi-select)
- [x] Real weather data + 5-day forecast
- [x] Country info (correct via ISO code)
- [x] Currency exchange rates
- [x] Interactive Leaflet map
- [x] Google Auth (Firebase)
- [x] Save/load/delete trips (Firestore)
- [x] Google Calendar integration
- [x] Cinematic loading screen
- [x] Ken Burns hero slideshow
- [x] Popular destinations (India-focused)
- [x] How It Works section
- [x] Fully responsive (mobile/tablet/desktop)
- [x] Framer Motion animations throughout
- [x] Unsplash activity images
- [x] Vercel deployment ready

---

## 🛠 npm Packages

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.21.0",
  "framer-motion": "^11.0.0",
  "firebase": "^10.7.0",
  "leaflet": "^1.9.4",
  "react-leaflet": "^4.2.1",
  "axios": "^1.6.0",
  "date-fns": "^3.0.0"
}
```

---

Built by a frontend engineer who takes design seriously. 🗺
