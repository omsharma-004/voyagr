# Voyagr ✈️

> AI-powered travel planner that generates personalised itineraries using real-time weather, maps, currency conversion, and AI recommendations.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Firebase](https://img.shields.io/badge/Firebase-10-FFCA28?style=flat-square&logo=firebase)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?style=flat-square&logo=vercel)

---

## 🌐 Live Demo

🔗 https://voyagr-xi-kohl.vercel.app

---

## ✨ Features

- AI-generated day-by-day travel itineraries
- Google Authentication with Firebase
- Save and manage trips using Firestore
- Real-time weather forecasts
- INR-based travel budgeting
- Currency conversion calculator for international trips
- Interactive destination maps with Leaflet
- India-focused travel experience
- Responsive UI for desktop, tablet, and mobile
- Google Calendar export support
- Destination autocomplete and smart search
- Animated modern UI with Framer Motion

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | CSS Modules |
| Animation | Framer Motion |
| Authentication | Firebase Authentication |
| Database | Firebase Firestore |
| AI | Groq API (`llama-3.1-8b-instant`) |
| Maps | Leaflet.js + OpenStreetMap |
| Weather | OpenWeatherMap API |
| Currency | ExchangeRate API |
| Countries | REST Countries API |
| Geocoding | Nominatim OpenStreetMap API |
| Deployment | Vercel |

---

## 📦 Installation

### Clone the repository

```bash
git clone https://github.com/omsharma-004/voyagr.git
cd voyagr
```

### Install dependencies

```bash
npm install
```

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Groq AI
VITE_GROQ_API_KEY=YOUR_GROQ_API_KEY

# Weather API
VITE_WEATHER_API_KEY=YOUR_OPENWEATHERMAP_API_KEY

# Currency API
VITE_EXCHANGE_API_KEY=YOUR_EXCHANGERATE_API_KEY

# Firebase
VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
```

---

## ▶️ Run Locally

```bash
npm run dev
```

---

## 🔥 Firebase Setup

### 1. Create Firebase Project

- Open Firebase Console
- Click **Create Project**
- Create a new web app

---

### 2. Enable Google Authentication

- Authentication → Get Started
- Sign-in Method → Enable Google

---

### 3. Enable Firestore Database

- Firestore Database → Create Database
- Start in test mode

---

### 4. Firestore Security Rules

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    match /trips/{tripId} {

      allow read: if request.auth != null &&
        resource.data.userId == request.auth.uid;

      allow create: if request.auth != null &&
        request.resource.data.userId == request.auth.uid;

      allow delete: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }
  }
}
```

---

### 5. Add Authorized Domain

Firebase → Authentication → Settings → Authorized Domains

Add:

```txt
voyagr-xi-kohl.vercel.app
```

---

## 🚀 Deployment

### Deploy with Vercel

```bash
npm install -g vercel
vercel
```

Or connect the GitHub repository directly on Vercel and add all environment variables in:

```txt
Project Settings → Environment Variables
```

### Build Configuration

| Setting | Value |
|--------|------|
| Build Command | `npm run build` |
| Output Directory | `dist` |

---

## 📁 Project Structure

```bash
src/
├── components/
│   ├── layout/
│   ├── sections/
│   └── ui/
├── config/
├── hooks/
├── pages/
├── services/
├── styles/
└── utils/
```

---

## 🌍 APIs Used

| API | Purpose |
|-----|---------|
| Groq API | AI itinerary generation |
| OpenWeatherMap API | Weather forecasts |
| ExchangeRate API | Currency conversion |
| REST Countries API | Country information |
| Nominatim API | Geocoding and location search |

---

## 📄 License

MIT License

---

## 👨‍💻 Author

Om Sharma

GitHub: https://github.com/omsharma-004
