// src/components/ui/LoadingScreen.jsx

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTrip } from '../../hooks/useTrip.jsx'

const STEPS = [
  { label: 'Fetching weather data', icon: '🌤', color: '#4a90d9' },
  { label: 'Loading country info', icon: '🌍', color: '#27ae60' },
  { label: 'Getting exchange rates', icon: '💱', color: '#f39c12' },
  { label: 'AI crafting your itinerary', icon: '✨', color: '#9b59b6' },
  { label: 'Building your experience', icon: '🗺', color: '#c4603a' },
]

const TRAVEL_FACTS = [
  'The Himalayas grow about 5mm taller every year.',
  'Japan has more than 3 million vending machines.',
  'France is the most visited country in the world.',
  'India has the world\'s largest postal network.',
  'Santorini\'s blue-domed churches number only 7.',
  'Bali has over 10,000 temples on the island.',
  'The Taj Mahal changes colour throughout the day.',
]

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    background: 'var(--gradient-luxury)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 24px',
  },
  logo: {
    fontFamily: 'var(--font-serif)',
    fontSize: '2rem',
    fontWeight: 300,
    letterSpacing: '0.2em',
    color: 'var(--gold-light)',
    textTransform: 'uppercase',
    marginBottom: '48px',
  },
  globe: {
    fontSize: '3.5rem',
    marginBottom: '32px',
    display: 'block',
  },
  heading: {
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(1.6rem, 4vw, 2.5rem)',
    fontWeight: 300,
    color: 'var(--text-light)',
    marginBottom: '8px',
    textAlign: 'center',
  },
  destination: {
    fontSize: '0.85rem',
    color: 'var(--gold)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginBottom: '48px',
    textAlign: 'center',
  },
  stepsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '100%',
    maxWidth: '420px',
    marginBottom: '48px',
  },
  stepRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 20px',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
  },
  stepIcon: {
    fontSize: '1.2rem',
    width: '32px',
    textAlign: 'center',
  },
  stepLabel: {
    fontSize: '0.85rem',
    fontWeight: 400,
    flex: 1,
  },
  stepCheck: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.65rem',
  },
  progressBar: {
    width: '100%',
    maxWidth: '420px',
    height: '2px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '2px',
    overflow: 'hidden',
    marginBottom: '40px',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--terracotta), var(--gold))',
    borderRadius: '2px',
    transition: 'width 1s ease',
  },
  fact: {
    fontFamily: 'var(--font-serif)',
    fontStyle: 'italic',
    fontSize: '0.95rem',
    color: 'rgba(240,234,216,0.45)',
    textAlign: 'center',
    maxWidth: '400px',
    lineHeight: 1.7,
  },
}

export default function LoadingScreen() {
  const { loadingStep, searchParams } = useTrip()
  const [factIdx, setFactIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setFactIdx((p) => (p + 1) % TRAVEL_FACTS.length)
    }, 3000)
    return () => clearInterval(t)
  }, [])

  const progress = ((loadingStep + 1) / STEPS.length) * 100

  return (
    <motion.div
      style={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={styles.logo}>Voyagr</div>

      <motion.span
        style={styles.globe}
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        🌏
      </motion.span>

      <h2 style={styles.heading}>Crafting your journey</h2>
      <p style={styles.destination}>
        {searchParams.destinationMeta?.displayName || 'Your destination'}
      </p>

      {/* Steps */}
      <div style={styles.stepsContainer}>
        {STEPS.map((step, i) => {
          const isDone = i < loadingStep
          const isActive = i === loadingStep
          return (
            <motion.div
              key={i}
              style={{
                ...styles.stepRow,
                background: isActive
                  ? 'rgba(255,255,255,0.07)'
                  : isDone
                  ? 'rgba(255,255,255,0.03)'
                  : 'transparent',
              }}
              animate={isActive ? { x: [0, 4, 0] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <span style={styles.stepIcon}>{step.icon}</span>
              <span
                style={{
                  ...styles.stepLabel,
                  color: isDone
                    ? 'rgba(240,234,216,0.4)'
                    : isActive
                    ? 'var(--text-light)'
                    : 'rgba(240,234,216,0.25)',
                }}
              >
                {step.label}
              </span>
              <div
                style={{
                  ...styles.stepCheck,
                  background: isDone
                    ? 'rgba(39,174,96,0.2)'
                    : isActive
                    ? 'rgba(201,168,76,0.15)'
                    : 'transparent',
                  color: isDone ? '#27ae60' : isActive ? 'var(--gold)' : 'transparent',
                }}
              >
                {isDone ? '✓' : isActive ? '…' : ''}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Progress */}
      <div style={styles.progressBar}>
        <motion.div
          style={{ ...styles.progressFill, width: `${progress}%` }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>

      {/* Travel fact */}
      <AnimatePresence mode="wait">
        <motion.p
          key={factIdx}
          style={styles.fact}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.5 }}
        >
          "{TRAVEL_FACTS[factIdx]}"
        </motion.p>
      </AnimatePresence>
    </motion.div>
  )
}
