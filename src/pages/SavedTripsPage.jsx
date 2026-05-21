// src/pages/SavedTripsPage.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../hooks/useAuth.jsx'
import { useTrip } from '../hooks/useTrip.jsx'
import { loadTrips, deleteTrip } from '../services/tripService'
import { formatDateRange } from '../utils/calendarUtils'

const s = {
  page: {
    minHeight: '100vh',
    background: 'var(--ivory)',
    paddingTop: '72px',
  },
  hero: {
    background: 'var(--gradient-luxury)',
    padding: '60px 24px 48px',
    textAlign: 'center',
  },
  heroEyebrow: {
    fontSize: '0.7rem',
    fontWeight: 600,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'var(--gold)',
    marginBottom: '12px',
  },
  heroTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    fontWeight: 300,
    color: 'var(--text-light)',
    marginBottom: '8px',
  },
  heroSub: {
    fontSize: '0.9rem',
    color: 'var(--text-light-muted)',
  },
  content: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '48px 24px',
  },
  signInPrompt: {
    textAlign: 'center',
    padding: '80px 24px',
  },
  promptIcon: {
    fontSize: '3rem',
    marginBottom: '20px',
  },
  promptTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.8rem',
    fontWeight: 300,
    color: 'var(--text-primary)',
    marginBottom: '10px',
  },
  promptSub: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    marginBottom: '28px',
  },
  signInBtn: {
    padding: '13px 32px',
    background: 'var(--terracotta)',
    color: 'white',
    borderRadius: '999px',
    fontSize: '0.85rem',
    fontWeight: 500,
    cursor: 'pointer',
    border: 'none',
    fontFamily: 'var(--font-sans)',
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 24px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px',
  },
  card: {
    background: 'var(--white)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid rgba(90,78,58,0.07)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
  },
  cardImg: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
    display: 'block',
    background: 'var(--ivory-dark)',
  },
  cardBody: {
    padding: '20px',
  },
  cardCity: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.4rem',
    fontWeight: 400,
    color: 'var(--text-primary)',
    marginBottom: '6px',
  },
  cardDates: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    marginBottom: '12px',
  },
  cardTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '16px',
  },
  tag: {
    padding: '3px 10px',
    background: 'var(--ivory)',
    border: '1px solid rgba(90,78,58,0.1)',
    borderRadius: '999px',
    fontSize: '0.72rem',
    color: 'var(--text-secondary)',
  },
  cardActions: {
    display: 'flex',
    gap: '10px',
    borderTop: '1px solid rgba(90,78,58,0.08)',
    paddingTop: '14px',
  },
  viewBtn: {
    flex: 1,
    padding: '9px',
    background: 'var(--terracotta)',
    color: 'white',
    borderRadius: '8px',
    fontSize: '0.78rem',
    fontWeight: 500,
    cursor: 'pointer',
    border: 'none',
    fontFamily: 'var(--font-sans)',
    transition: 'background 0.2s',
  },
  deleteBtn: {
    padding: '9px 14px',
    background: 'transparent',
    border: '1px solid rgba(224,92,92,0.25)',
    color: '#e05c5c',
    borderRadius: '8px',
    fontSize: '0.78rem',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    transition: 'background 0.2s',
  },
  savedAt: {
    fontSize: '0.68rem',
    color: 'var(--text-muted)',
    marginBottom: '12px',
  },
  loadingState: {
    textAlign: 'center',
    padding: '80px',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-serif)',
    fontSize: '1.2rem',
  },
}

export default function SavedTripsPage() {
  const { user, loading: authLoading } = useAuth()
  const { setTripResult, setIsGenerating } = useTrip()
  const navigate = useNavigate()
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [fetchError, setFetchError] = useState(null)

  useEffect(() => {
    // Wait for auth to resolve before doing anything
    if (authLoading) return

    if (!user?.uid) {
      setTrips([])
      setLoading(false)
      return
    }

    // Fetch trips for this specific uid
    setLoading(true)
    setFetchError(null)
    console.log('[Voyagr] SavedTripsPage: fetching for uid', user.uid)

    loadTrips(user.uid).then(({ trips, error }) => {
      if (error) {
        console.error('[Voyagr] SavedTripsPage fetch error:', error)
        setFetchError(error)
      } else {
        setTrips(trips)
      }
      setLoading(false)
    })
  }, [user?.uid, authLoading]) // ← uid as dep: fires on login, logout, and re-login

  const handleView = (trip) => {
    // trip may be already-spread (old) or need unwrap — both handled by loadTrips
    console.log('[Voyagr] Viewing saved trip:', trip.destination)
    setIsGenerating(false)
    setTripResult(trip)
    navigate('/results')
  }

  const handleDelete = async (e, tripId) => {
    e.stopPropagation()
    setDeleting(tripId)
    await deleteTrip(tripId)
    setTrips((prev) => prev.filter((t) => t.id !== tripId))
    setDeleting(null)
  }

  const formatSavedAt = (date) => {
    if (!date) return ''
    try {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      })
    } catch { return '' }
  }

  return (
    <div style={s.page}>
      <div style={s.hero}>
        <div style={s.heroEyebrow}>My Voyagr</div>
        <h1 style={s.heroTitle}>Saved Trips</h1>
        <p style={s.heroSub}>Your past adventures and planned journeys</p>
      </div>

      <div style={s.content}>
        {authLoading ? (
          <div style={s.loadingState}>Checking authentication...</div>
        ) : !user ? (
          <div style={s.signInPrompt}>
            <div style={s.promptIcon}>🔐</div>
            <div style={s.promptTitle}>Sign in to view saved trips</div>
            <p style={s.promptSub}>Your trips sync across all your devices when you're signed in.</p>
            <button style={s.signInBtn} onClick={() => navigate('/')}>
              Go to Home
            </button>
          </div>
        ) : loading ? (
          <div style={s.loadingState}>Loading your trips...</div>
        ) : fetchError ? (
          <div style={{ ...s.emptyState }}>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⚠️</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Could not load trips
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              {fetchError}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Check browser console for details. Ensure Firestore rules allow reads.
            </p>
          </div>
        ) : trips.length === 0 ? (
          <div style={s.emptyState}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🗺</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 300, color: 'var(--text-primary)', marginBottom: '10px' }}>
              No saved trips yet
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '28px' }}>
              Plan your first trip and save it to see it here.
            </p>
            <button style={s.signInBtn} onClick={() => navigate('/')}>
              Plan a Trip
            </button>
          </div>
        ) : (
          <div style={s.grid}>
            <AnimatePresence>
              {trips.map((trip, i) => (
                <motion.div
                  key={trip.id}
                  style={s.card}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(0,0,0,0.12)' }}
                >
                  <img
                    style={s.cardImg}
                    src={`https://source.unsplash.com/featured/600x300?${encodeURIComponent(trip.destinationMeta?.city || trip.destination)},travel`}
                    alt={trip.destination}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80'
                    }}
                  />
                  <div style={s.cardBody}>
                    <div style={s.cardCity}>{trip.destinationMeta?.city || trip.destination}</div>
                    <div style={s.cardDates}>{formatDateRange(trip.dates?.start, trip.dates?.end)} · {trip.dates?.totalDays || 0} days</div>
                    {trip.savedAt && (
                      <div style={s.savedAt}>Saved {formatSavedAt(trip.savedAt)}</div>
                    )}
                    <div style={s.cardTags}>
                      {trip.budget && (
                        <span style={{ ...s.tag, color: 'var(--terracotta)', fontWeight: 600 }}>
                          {trip.budget}
                        </span>
                      )}
                      {trip.interests?.slice(0, 3).map((int) => (
                        <span key={int} style={s.tag}>{int}</span>
                      ))}
                    </div>
                    <div style={s.cardActions}>
                      <button style={s.viewBtn} onClick={() => handleView(trip)}>
                        View Itinerary
                      </button>
                      <button
                        style={s.deleteBtn}
                        onClick={(e) => handleDelete(e, trip.id)}
                        disabled={deleting === trip.id}
                      >
                        {deleting === trip.id ? '...' : '🗑'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
