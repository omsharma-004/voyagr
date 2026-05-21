// src/pages/ResultsPage.jsx

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTrip } from '../hooks/useTrip.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { saveTrip } from '../services/tripService'
import { formatDateRange } from '../utils/calendarUtils'
import { generateGoogleCalendarUrl } from '../utils/calendarUtils'
import LoadingScreen from '../components/ui/LoadingScreen'
import WeatherCard from '../components/ui/WeatherCard'
import CountryCard from '../components/ui/CountryCard'
import CurrencyCard from '../components/ui/CurrencyCard'
import CurrencyCalculator from '../components/ui/CurrencyCalculator'
import TripMap from '../components/ui/TripMap'
import Itinerary from '../components/sections/Itinerary'
import styles from './ResultsPage.module.css'

const INTEREST_EMOJIS = {
  food: '🍜', adventure: '🧗', culture: '🏛', nature: '🌿',
  relaxation: '🧘', shopping: '🛍', nightlife: '🌙',
  photography: '📸', hiking: '⛰', architecture: '🏰',
}

const isIndiaDestination = (meta) => {
  if (!meta) return false
  return meta.countryCode === 'IN' ||
    meta.country?.toLowerCase().includes('india')
}

const fmtINR = (n) => n ? `₹${Number(n).toLocaleString('en-IN')}` : ''

export default function ResultsPage() {
  const { tripResult, isGenerating, resetTrip } = useTrip()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Redirect if no trip data and not generating
  useEffect(() => {
    if (!isGenerating && !tripResult) {
      navigate('/')
    }
  }, [isGenerating, tripResult, navigate])

  if (isGenerating && !tripResult) {
    return <LoadingScreen />
  }

  if (!tripResult) {
    return (
      <div className={styles.redirecting}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem' }}>
          No trip data found.
        </div>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '10px 24px',
            background: 'var(--terracotta)',
            color: 'white',
            borderRadius: '999px',
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          Plan a Trip
        </button>
      </div>
    )
  }

  const { destination, destinationMeta, dates, budget, budgetINR, budgetLabel,
    interests, weather, country, exchange, currencyCode, itinerary } = tripResult

  const isIndia = isIndiaDestination(destinationMeta)

  const bannerImg = destinationMeta
    ? `https://source.unsplash.com/featured/1600x700?${encodeURIComponent(destinationMeta.city)},travel,landscape`
    : `https://source.unsplash.com/featured/1600x700?travel`

  const handleSave = async () => {
    if (!user) {
      alert('Please sign in to save trips.')
      return
    }
    setSaving(true)
    console.log('[Voyagr] Attempting save for user:', user.uid)
    console.log('[Voyagr] Trip destination:', tripResult?.destination)

    const { id, error } = await saveTrip(user.uid, tripResult)

    if (error) {
      console.error('[Voyagr] Save failed:', error)
      alert(`Save failed: ${error}\n\nCheck Firestore rules in Firebase Console.`)
      setSaving(false)
      return
    }

    console.log('[Voyagr] Saved with id:', id)
    setSaved(true)
    setSaving(false)
  }

  const handleCalendar = () => {
    const url = generateGoogleCalendarUrl({ destination, startDate: dates.start, endDate: dates.end, itinerary })
    window.open(url, '_blank')
  }

  return (
    <div className={styles.page}>
      {/* ── Compact destination banner ── */}
      <div className={styles.banner}>
        <img className={styles.bannerImg} src={bannerImg} alt={destination}
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80' }} />
        <div className={styles.bannerOverlay} />
        <div className={styles.bannerContent}>
          <div className={styles.bannerLeft}>
            <div className={styles.bannerEyebrow}>AI-Planned Journey</div>
            <h1 className={styles.bannerTitle}>{destinationMeta?.city || destination}</h1>
            <div className={styles.bannerMeta}>
              <span>{formatDateRange(dates.start, dates.end)}</span>
              <span className={styles.bannerDot} />
              <span>{dates.totalDays} day{dates.totalDays !== 1 ? 's' : ''}</span>
              {budgetLabel && <><span className={styles.bannerDot} /><span>{budgetLabel}</span></>}
            </div>
          </div>
          <div className={styles.bannerActions}>
            <button className={`${styles.actionBtn} ${saved ? styles.saved : styles.primary}`}
              onClick={handleSave} disabled={saving || saved}>
              {saved ? '✓ Saved' : saving ? 'Saving...' : '🔖 Save Trip'}
            </button>
            <button className={`${styles.actionBtn} ${styles.secondary}`} onClick={handleCalendar}>
              📅 Calendar
            </button>
            <button className={`${styles.actionBtn} ${styles.secondary}`}
              onClick={() => { resetTrip(); navigate('/') }}>
              ← New
            </button>
          </div>
        </div>
      </div>

      {/* ── Main 2-col layout ── */}
      <div className={styles.mainLayout}>

        {/* ── LEFT SIDEBAR ── */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>

          {/* Collapse toggle */}
          <button className={styles.sidebarToggle} onClick={() => setSidebarOpen(p => !p)}
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}>
            <span>{sidebarOpen ? '◀' : '▶'}</span>
          </button>

          {sidebarOpen && (
            <motion.div
              className={styles.sidebarContent}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Trip stats pill bar */}
              <div className={styles.statBar}>
                <div className={styles.stat}>
                  <span className={styles.statIcon}>📅</span>
                  <span className={styles.statVal}>{dates.totalDays}d</span>
                </div>
                <div className={styles.statDivider} />
                <div className={styles.stat}>
                  <span className={styles.statIcon}>💰</span>
                  <span className={styles.statVal}>{budgetINR ? fmtINR(budgetINR) : budget}</span>
                </div>
                <div className={styles.statDivider} />
                <div className={styles.stat}>
                  <span className={styles.statIcon}>🎯</span>
                  <span className={styles.statVal}>{interests.length} interests</span>
                </div>
              </div>

              {/* Weather — always show */}
              <WeatherCard weather={weather} compact />

              {/* Map — always show */}
              {destinationMeta?.lat && destinationMeta?.lon && (
                <TripMap lat={destinationMeta.lat} lon={destinationMeta.lon} destination={destination} />
              )}

              {/* INDIA: local tips block */}
              {isIndia && itinerary?.localPhrases?.length > 0 && (
                <div className={styles.localBlock}>
                  <div className={styles.localTitle}>
                    <span>🗣</span> Local Phrases
                  </div>
                  <div className={styles.localList}>
                    {itinerary.localPhrases.slice(0, 5).map((p, i) => (
                      <div key={i} className={styles.localItem}>
                        <span className={styles.localPhrase}>"{p.phrase}"</span>
                        <span className={styles.localMeaning}>{p.meaning}</span>
                        {p.pronunciation && <span className={styles.localPronounce}>{p.pronunciation}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FOREIGN: country info + currency */}
              {!isIndia && (
                <>
                  <CountryCard country={country} />
                  <CurrencyCard exchange={exchange} currencyCode={currencyCode} />
                  <CurrencyCalculator exchange={exchange} currencyCode={currencyCode} countryName={country?.name} />
                </>
              )}

              {/* Interests tags */}
              <div className={styles.tagCloud}>
                {interests.map(id => (
                  <span key={id} className={styles.interestTag}>
                    {INTEREST_EMOJIS[id]} {id}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </aside>

        {/* ── MAIN CONTENT: itinerary first ── */}
        <main className={styles.mainContent}>
          {itinerary && <Itinerary itinerary={itinerary} />}
        </main>
      </div>
    </div>
  )
}
