// src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import { TripProvider } from './hooks/useTrip'
import HomePage from './pages/HomePage'
import ResultsPage from './pages/ResultsPage'
import SavedTripsPage from './pages/SavedTripsPage'
import Navbar from './components/layout/Navbar'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TripProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/saved" element={<SavedTripsPage />} />
          </Routes>
        </TripProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
