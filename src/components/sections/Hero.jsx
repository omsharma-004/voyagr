// src/components/sections/Hero.jsx

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Hero.module.css'

const SLIDES = [
  {
    name: 'Kashmir',
    country: 'India',
    tag: 'Heaven on Earth',
    url: 'https://images.unsplash.com/photo-1588083949404-c4f1ed1323b3?w=1920&q=80',
  },
  {
    name: 'Leh Ladakh',
    country: 'India',
    tag: 'Land of High Passes',
    url: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1920&q=80',
  },
  {
    name: 'Kerala',
    country: 'India',
    tag: "God's Own Country",
    url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1920&q=80',
  },
  {
    name: 'Jaipur',
    country: 'India',
    tag: 'The Pink City',
    url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1920&q=80',
  },
  {
    name: 'Goa',
    country: 'India',
    tag: 'Sun, Sand & Soul',
    url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1920&q=80',
  },
  {
    name: 'Udaipur',
    country: 'India',
    tag: 'City of Lakes',
    url: 'https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=1920&q=80',
  },
  {
    name: 'Varanasi',
    country: 'India',
    tag: 'Soul of India',
    url: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=1920&q=80',
  },
  {
    name: 'Manali',
    country: 'India',
    tag: 'Mountain Paradise',
    url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1920&q=80',
  },
]

export default function Hero({ searchPanelRef }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((p) => (p + 1) % SLIDES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const scrollToSearch = () => {
    const el = document.getElementById('search')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className={styles.hero}>
      {/* Background slideshow */}
      <div className={styles.slideshow}>
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className={styles.slide}
            style={{ backgroundImage: `url(${SLIDES[current].url})` }}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1.03 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </AnimatePresence>
        <div className={styles.overlay} />
        <div className={styles.overlayBottom} />
      </div>

      {/* Main content */}
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
      >
        <div className={styles.eyebrow}>India's Premier AI Travel Planner</div>

        <h1 className={styles.heading}>
          Discover<br />
          <em>incredible</em><br />
          India
        </h1>

        <p className={styles.subtitle}>
          From the Himalayas to the backwaters — our AI crafts deeply personalised
          itineraries with real weather, local culture, and authentic experiences.
        </p>

        <motion.button
          onClick={scrollToSearch}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '16px 40px',
            background: 'linear-gradient(135deg, var(--terracotta), var(--gold))',
            color: 'white',
            borderRadius: '999px',
            fontSize: '0.85rem',
            fontWeight: '500',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            border: 'none',
            boxShadow: '0 12px 40px rgba(196,96,58,0.4)',
          }}
          whileHover={{ scale: 1.04, boxShadow: '0 16px 50px rgba(196,96,58,0.5)' }}
          whileTap={{ scale: 0.98 }}
        >
          Start Planning
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </motion.button>
      </motion.div>

      {/* Slide indicators */}
      <div className={styles.indicators}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`${styles.indicator} ${i === current ? styles.active : ''}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>

      {/* Current destination label */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className={styles.destinationLabel}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.destinationName}>
            {SLIDES[current].name}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', marginTop: '3px' }}>
            {SLIDES[current].tag}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Scroll cue */}
      <motion.div
        className={styles.scrollCue}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.div
          className={styles.scrollLine}
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className={styles.scrollText}>Scroll</span>
      </motion.div>
    </section>
  )
}
