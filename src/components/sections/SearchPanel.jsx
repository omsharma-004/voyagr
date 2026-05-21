// src/components/sections/SearchPanel.jsx

import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTrip } from '../../hooks/useTrip.jsx'
import { searchDestinations } from '../../services/geoService'
import { fetchWeather } from '../../services/weatherService'
import { fetchCountryByCode } from '../../services/countryService'
import { fetchExchangeRates } from '../../services/exchangeService'
import { generateItinerary } from '../../services/groqService'
import { calculateDays } from '../../utils/calendarUtils'
import styles from './SearchPanel.module.css'
import BudgetSlider from '../ui/BudgetSlider'
import DateRangePicker from '../ui/DateRangePicker'

const INTERESTS = [
  { id: 'food', label: 'Food', emoji: '🍜' },
  { id: 'adventure', label: 'Adventure', emoji: '🧗' },
  { id: 'culture', label: 'Culture', emoji: '🏛' },
  { id: 'nature', label: 'Nature', emoji: '🌿' },
  { id: 'relaxation', label: 'Relaxation', emoji: '🧘' },
  { id: 'shopping', label: 'Shopping', emoji: '🛍' },
  { id: 'nightlife', label: 'Nightlife', emoji: '🌙' },
  { id: 'photography', label: 'Photography', emoji: '📸' },
  { id: 'hiking', label: 'Hiking', emoji: '⛰' },
  { id: 'architecture', label: 'Architecture', emoji: '🏰' },
]

const BUDGET_OPTIONS = [
  { id: 'budget', label: 'Budget', icon: '✦' },
  { id: 'mid-range', label: 'Mid-Range', icon: '✦✦' },
  { id: 'luxury', label: 'Luxury', icon: '✦✦✦' },
]

const LOADING_STEPS = [
  'Fetching weather data...',
  'Loading country info...',
  'Getting exchange rates...',
  'AI crafting your itinerary...',
  'Building your experience...',
]

export default function SearchPanel() {
  const { searchParams, updateSearchParams, setTripResult, setIsGenerating, setLoadingStep } = useTrip()
  const navigate = useNavigate()

  // Autocomplete state
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const inputRef = useRef(null)
  const suggestionsRef = useRef(null)
  const searchTimeoutRef = useRef(null)

  const [error, setError] = useState('')

  // Autocomplete search
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    clearTimeout(searchTimeoutRef.current)
    setLoadingSuggestions(true)
    searchTimeoutRef.current = setTimeout(async () => {
      const { results } = await searchDestinations(query)
      setSuggestions(results)
      setShowSuggestions(true)
      setLoadingSuggestions(false)
    }, 350)
    return () => clearTimeout(searchTimeoutRef.current)
  }, [query])

  // Click outside close
  useEffect(() => {
    const handle = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const selectDestination = (item) => {
    setQuery(item.displayName)
    updateSearchParams({ destination: item.displayName, destinationMeta: item })
    setShowSuggestions(false)
    setActiveIdx(-1)
  }

  const handleKeyDown = (e) => {
    if (!showSuggestions || !suggestions.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((p) => Math.min(p + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((p) => Math.max(p - 1, -1))
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault()
      selectDestination(suggestions[activeIdx])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  const toggleInterest = (id) => {
    const curr = searchParams.interests
    if (curr.includes(id)) {
      updateSearchParams({ interests: curr.filter((i) => i !== id) })
    } else {
      updateSearchParams({ interests: [...curr, id] })
    }
  }

  const handleDateChange = (field, value) => {
    const updates = { [field]: value }
    if (field === 'startDate' && searchParams.endDate) {
      updates.totalDays = calculateDays(value, searchParams.endDate)
    }
    if (field === 'endDate' && searchParams.startDate) {
      updates.totalDays = calculateDays(searchParams.startDate, value)
    }
    updateSearchParams(updates)
  }

  const today = new Date().toISOString().split('T')[0]

  const handlePlan = async () => {
    setError('')

    // Validation
    if (!searchParams.destinationMeta) {
      setError('Please select a destination from the suggestions.')
      return
    }
    if (!searchParams.startDate || !searchParams.endDate) {
      setError('Please select your travel dates.')
      return
    }
    if (searchParams.totalDays < 1) {
      setError('Return date must be after departure date.')
      return
    }
    if (!searchParams.interests.length) {
      setError('Please select at least one interest.')
      return
    }

    setIsGenerating(true)
    navigate('/results')

    try {
      const meta = searchParams.destinationMeta

      // Step 1: Weather
      setLoadingStep(0)
      const { data: weatherData } = await fetchWeather(meta.city)

      // Step 2: Country
      setLoadingStep(1)
      const countryCode = meta.countryCode || weatherData?.country || 'US'
      const { data: countryData } = await fetchCountryByCode(countryCode)

      // Step 3: Exchange rates
      setLoadingStep(2)
      const currencyCode = countryData?.currencyCode || 'USD'
      const { data: exchangeData } = await fetchExchangeRates('USD')

      // Step 4: AI itinerary
      setLoadingStep(3)
      const { data: itinerary, error: aiError } = await generateItinerary({
        destination: meta.displayName,
        dates: {
          start: searchParams.startDate,
          end: searchParams.endDate,
          totalDays: searchParams.totalDays,
        },
        budget: searchParams.budget,
        budgetINR: searchParams.budgetINR,
        budgetLabel: searchParams.budgetLabel,
        interests: searchParams.interests,
        weather: weatherData,
        country: countryData,
      })

      if (aiError) throw new Error(aiError)

      // Step 5: Build
      setLoadingStep(4)

      setTripResult({
        destination: meta.displayName,
        destinationMeta: meta,
        dates: {
          start: searchParams.startDate,
          end: searchParams.endDate,
          totalDays: searchParams.totalDays,
        },
        budget: searchParams.budget,
        budgetINR: searchParams.budgetINR,
        budgetLabel: searchParams.budgetLabel,
        interests: searchParams.interests,
        weather: weatherData,
        country: countryData,
        exchange: exchangeData,
        currencyCode,
        itinerary,
        generatedAt: new Date().toISOString(),
      })
    } catch (err) {
      console.error('Trip generation error:', err)
      setError(err.message || 'Something went wrong. Please try again.')
      setIsGenerating(false)
    }
  }

  const totalDays = searchParams.totalDays

  return (
    <div className={styles.wrapper} id="search">
      <motion.div
        className={styles.panel}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
      >
        {/* Row 1: Destination + Dates */}
        <div className={styles.row1}>
          {/* Destination */}
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Destination</span>
            <div className={styles.fieldInner} ref={suggestionsRef}>
              <span className={styles.fieldIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              <input
                ref={inputRef}
                className={styles.input}
                type="text"
                placeholder="Where are you going?"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  if (!e.target.value) updateSearchParams({ destination: '', destinationMeta: null })
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => suggestions.length && setShowSuggestions(true)}
                autoComplete="off"
              />

              <AnimatePresence>
                {(showSuggestions || loadingSuggestions) && (
                  <motion.div
                    className={styles.autocomplete}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                  >
                    {loadingSuggestions ? (
                      <div className={styles.autocompleteLoading}>
                        <div className={styles.spinner} />
                        Searching...
                      </div>
                    ) : (
                      suggestions.map((item, i) => (
                        <div
                          key={item.id}
                          className={`${styles.autocompleteItem} ${i === activeIdx ? styles.active : ''}`}
                          onMouseDown={() => selectDestination(item)}
                        >
                          <div className={styles.autocompleteIcon}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                          </div>
                          <div className={styles.autocompleteText}>
                            <span className={styles.autocompletePrimary}>{item.city}</span>
                            <span className={styles.autocompleteSecondary}>
                              {[item.state, item.country].filter(Boolean).join(', ')}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Departure */}
          <div className={styles.field} style={{ gridColumn: 'span 2' }}>
            <span className={styles.fieldLabel}>Travel Dates</span>
            <DateRangePicker
              startDate={searchParams.startDate}
              endDate={searchParams.endDate}
              onChange={({ startDate, endDate, totalDays }) => {
                updateSearchParams({ startDate, endDate, totalDays: totalDays || 0 })
              }}
            />
          </div>
        </div>

        {/* Row 2: Budget + Interests */}
        <div className={styles.row2}>
          {/* Budget Slider */}
          <div>
            <BudgetSlider
              value={searchParams.budgetINR}
              onChange={(vals) => updateSearchParams(vals)}
            />
          </div>

          {/* Interests */}
          <div>
            <div className={styles.budgetLabel}>Interests</div>
            <div className={styles.interestGrid}>
              {INTERESTS.map((interest) => (
                <motion.button
                  key={interest.id}
                  className={`${styles.chip} ${searchParams.interests.includes(interest.id) ? styles.selected : ''}`}
                  onClick={() => toggleInterest(interest.id)}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className={styles.chipEmoji}>{interest.emoji}</span>
                  {interest.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className={styles.errorMsg}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
            </svg>
            {error}
          </div>
        )}

        {/* CTA Row */}
        <div className={styles.ctaRow}>
          <div className={styles.summaryText}>
            {searchParams.destinationMeta && totalDays > 0 ? (
              <>
                <strong>{searchParams.destinationMeta.city}</strong> · {totalDays} day{totalDays !== 1 ? 's' : ''} · {searchParams.budgetLabel || searchParams.budget}
                {searchParams.interests.length > 0 && ` · ${searchParams.interests.length} interest${searchParams.interests.length !== 1 ? 's' : ''}`}
              </>
            ) : (
              'Fill in the details to generate your AI itinerary'
            )}
          </div>

          <motion.button
            className={styles.planBtn}
            onClick={handlePlan}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className={styles.planBtnIcon}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </span>
            Search & Plan
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
