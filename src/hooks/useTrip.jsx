// src/hooks/useTrip.js — Global trip planning state

import { useState, createContext, useContext } from 'react'

const TripContext = createContext(null)

export const TripProvider = ({ children }) => {
  const [searchParams, setSearchParams] = useState({
    destination: '',
    destinationMeta: null, // { city, country, countryCode, lat, lon }
    startDate: null,
    endDate: null,
    totalDays: 0,
    budget: 'mid-range',       // kept for legacy compat
    budgetINR: 25000,           // primary budget in INR
    budgetLabel: '₹20k–₹50k',  // display label
    interests: [],
  })

  const [tripResult, setTripResult] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)

  const updateSearchParams = (updates) =>
    setSearchParams((prev) => ({ ...prev, ...updates }))

  const resetTrip = () => {
    setTripResult(null)
    setIsGenerating(false)
    setLoadingStep(0)
  }

  return (
    <TripContext.Provider
      value={{
        searchParams,
        updateSearchParams,
        tripResult,
        setTripResult,
        isGenerating,
        setIsGenerating,
        loadingStep,
        setLoadingStep,
        resetTrip,
      }}
    >
      {children}
    </TripContext.Provider>
  )
}

export const useTrip = () => {
  const ctx = useContext(TripContext)
  if (!ctx) throw new Error('useTrip must be used inside TripProvider')
  return ctx
}
