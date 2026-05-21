// src/pages/HomePage.jsx

import { useEffect } from 'react'
import Hero from '../components/sections/Hero'
import SearchPanel from '../components/sections/SearchPanel'
import Destinations from '../components/sections/Destinations'
import HowItWorks from '../components/sections/HowItWorks'
import { useTrip } from '../hooks/useTrip.jsx'

export default function HomePage() {
  const { updateSearchParams } = useTrip()

  // Listen for destination card clicks
  useEffect(() => {
    const handler = (e) => {
      updateSearchParams({
        destination: e.detail.displayName,
        destinationMeta: e.detail,
      })
    }
    window.addEventListener('voyagr:setDestination', handler)
    return () => window.removeEventListener('voyagr:setDestination', handler)
  }, [updateSearchParams])

  return (
    <main>
      <Hero />
      <SearchPanel />
      <Destinations />
      <HowItWorks />
      <footer style={{
        background: 'var(--obsidian-soft)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '40px 24px',
        textAlign: 'center',
      }}>
        <div style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.5rem',
          letterSpacing: '0.15em',
          color: 'var(--gold-light)',
          marginBottom: '8px',
        }}>
          VOYAGR
        </div>
        <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}>
          AI-powered travel planning. Built with Groq, Firebase &amp; OpenStreetMap.
        </p>
      </footer>
    </main>
  )
}
