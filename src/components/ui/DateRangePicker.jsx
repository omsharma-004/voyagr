// src/components/ui/DateRangePicker.jsx
// Premium dark popup calendar — Airbnb-inspired

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December']
const DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa']

function isSameDay(a, b) {
  if (!a || !b) return false
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth()    === b.getMonth()    &&
         a.getDate()     === b.getDate()
}
function isInRange(d, start, end) {
  if (!start || !end || !d) return false
  return d > start && d < end
}
function isPast(d) {
  const today = new Date(); today.setHours(0,0,0,0)
  return d < today
}

function buildCalendar(year, month) {
  const first = new Date(year, month, 1).getDay()
  const days  = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < first; i++) cells.push(null)
  for (let d = 1; d <= days; d++) cells.push(new Date(year, month, d))
  return cells
}

const fmt = (d) => d ? d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
const fmtShort = (d) => d ? d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''

const calcDays = (s, e) => {
  if (!s || !e) return 0
  return Math.max(0, Math.round((e - s) / 86400000))
}

export default function DateRangePicker({ startDate, endDate, onChange }) {
  const [open, setOpen]       = useState(false)
  const [selecting, setSelecting] = useState('start') // 'start' | 'end'
  const [hovered, setHovered] = useState(null)
  const today = new Date(); today.setHours(0,0,0,0)

  const initYear  = today.getFullYear()
  const initMonth = today.getMonth()
  const [viewYear,  setViewYear]  = useState(initYear)
  const [viewMonth, setViewMonth] = useState(initMonth)

  const wrapRef = useRef(null)

  // Parse string dates → Date objects
  const start = startDate ? new Date(startDate + 'T00:00:00') : null
  const end   = endDate   ? new Date(endDate   + 'T00:00:00') : null

  useEffect(() => {
    const handle = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(v => v - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(v => v + 1) }
    else setViewMonth(m => m + 1)
  }

  const toISO = (d) => {
    if (!d) return null
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  const handleDayClick = (d) => {
    if (!d || isPast(d)) return
    if (selecting === 'start') {
      onChange({ startDate: toISO(d), endDate: null, totalDays: 0 })
      setSelecting('end')
    } else {
      if (d <= start) {
        // clicked before start — restart
        onChange({ startDate: toISO(d), endDate: null, totalDays: 0 })
        setSelecting('end')
      } else {
        const days = calcDays(start, d)
        onChange({ startDate: toISO(start), endDate: toISO(d), totalDays: days })
        setSelecting('start')
        setOpen(false)
      }
    }
  }

  const cells = buildCalendar(viewYear, viewMonth)
  const effectiveEnd = selecting === 'end' && hovered ? hovered : end

  const displayText = () => {
    if (!start && !end) return 'Select travel dates'
    if (start && !end)  return `${fmtShort(start)} → pick return`
    const d = calcDays(start, end)
    return `${fmtShort(start)} — ${fmtShort(end)} · ${d} day${d !== 1 ? 's' : ''}`
  }

  // Style helpers
  const S = {
    wrapper: { position: 'relative', width: '100%' },
    trigger: {
      width: '100%',
      padding: '14px 14px 14px 42px',
      background: 'var(--white)',
      border: `1.5px solid ${open ? 'var(--terracotta)' : 'rgba(90,78,58,0.15)'}`,
      borderRadius: 'var(--radius-md)',
      fontSize: '0.9rem',
      color: start ? 'var(--text-primary)' : 'var(--text-muted)',
      cursor: 'pointer',
      textAlign: 'left',
      fontFamily: 'var(--font-sans)',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      boxShadow: open ? '0 0 0 3px rgba(196,96,58,0.1)' : 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    popup: {
      position: 'absolute',
      top: 'calc(100% + 10px)',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 999,
      background: 'rgba(18,14,10,0.96)',
      backdropFilter: 'blur(32px)',
      WebkitBackdropFilter: 'blur(32px)',
      border: '1px solid rgba(201,168,76,0.2)',
      borderRadius: '20px',
      padding: '24px',
      boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
      minWidth: '320px',
      width: '340px',
    },
    popupHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '16px',
    },
    navBtn: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      border: '1px solid rgba(255,255,255,0.12)',
      background: 'rgba(255,255,255,0.06)',
      color: 'rgba(255,255,255,0.7)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background 0.2s',
      fontSize: '0.85rem',
    },
    monthYear: {
      fontFamily: 'var(--font-serif)',
      fontSize: '1.05rem',
      fontWeight: 400,
      color: 'var(--white)',
      letterSpacing: '0.02em',
    },
    dayHeaders: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '2px',
      marginBottom: '6px',
    },
    dayHeader: {
      textAlign: 'center',
      fontSize: '0.6rem',
      fontWeight: 600,
      letterSpacing: '0.1em',
      color: 'rgba(255,255,255,0.3)',
      padding: '4px 0',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '2px',
    },
  }

  const getDayStyle = (d) => {
    if (!d) return { visibility: 'hidden' }
    const past = isPast(d)
    const isStart = isSameDay(d, start)
    const isEnd   = isSameDay(d, effectiveEnd)
    const inRange = isInRange(d, start, effectiveEnd)
    const isToday = isSameDay(d, today)

    let bg = 'transparent'
    let color = past ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.75)'
    let borderRadius = '8px'
    let fontWeight = '400'

    if (isStart || isEnd) {
      bg = 'linear-gradient(135deg, var(--terracotta), var(--gold))'
      color = 'white'
      fontWeight = '600'
    } else if (inRange) {
      bg = 'rgba(196,96,58,0.15)'
      color = 'rgba(255,255,255,0.9)'
      borderRadius = '0'
    }
    if (isStart) { borderRadius = '8px 0 0 8px' }
    if (isEnd)   { borderRadius = '0 8px 8px 0' }
    if (isStart && isEnd) { borderRadius = '8px' }

    return {
      padding: '7px 0',
      textAlign: 'center',
      fontSize: '0.8rem',
      fontWeight,
      cursor: past ? 'default' : 'pointer',
      borderRadius,
      background: bg,
      color,
      transition: 'background 0.15s, color 0.15s',
      position: 'relative',
      ...(isToday && !isStart && !isEnd ? {
        outline: '1.5px solid rgba(201,168,76,0.5)',
        outlineOffset: '-1px',
      } : {}),
    }
  }

  return (
    <div style={S.wrapper} ref={wrapRef}>
      {/* Trigger */}
      <div style={{ position: 'relative' }}>
        <span style={{
          position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
          color: 'var(--terracotta)', pointerEvents: 'none', zIndex: 1,
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
          </svg>
        </span>
        <button style={S.trigger} onClick={() => { setOpen(p => !p); setSelecting('start') }}>
          {displayText()}
        </button>
      </div>

      {/* Popup */}
      <AnimatePresence>
        {open && (
          <motion.div
            style={S.popup}
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {/* Selecting hint */}
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '16px',
              padding: '8px 12px',
              background: 'rgba(255,255,255,0.04)',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{
                flex: 1, textAlign: 'center',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                color: selecting === 'start' ? 'var(--gold)' : 'rgba(255,255,255,0.35)',
                borderBottom: selecting === 'start' ? '1px solid var(--gold)' : '1px solid transparent',
                paddingBottom: '4px',
                transition: 'color 0.2s',
              }}>
                DEPART
                <div style={{ fontSize: '0.8rem', fontWeight: 400, marginTop: '2px', color: start ? 'white' : 'rgba(255,255,255,0.3)' }}>
                  {start ? fmtShort(start) : '—'}
                </div>
              </div>
              <div style={{ width: '1px', background: 'rgba(255,255,255,0.08)' }} />
              <div style={{
                flex: 1, textAlign: 'center',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                color: selecting === 'end' ? 'var(--gold)' : 'rgba(255,255,255,0.35)',
                borderBottom: selecting === 'end' ? '1px solid var(--gold)' : '1px solid transparent',
                paddingBottom: '4px',
                transition: 'color 0.2s',
              }}>
                RETURN
                <div style={{ fontSize: '0.8rem', fontWeight: 400, marginTop: '2px', color: end ? 'white' : 'rgba(255,255,255,0.3)' }}>
                  {end ? fmtShort(end) : '—'}
                </div>
              </div>
            </div>

            {/* Month nav */}
            <div style={S.popupHeader}>
              <button style={S.navBtn} onClick={prevMonth}>‹</button>
              <span style={S.monthYear}>{MONTHS[viewMonth]} {viewYear}</span>
              <button style={S.navBtn} onClick={nextMonth}>›</button>
            </div>

            {/* Day headers */}
            <div style={S.dayHeaders}>
              {DAYS.map(d => <div key={d} style={S.dayHeader}>{d}</div>)}
            </div>

            {/* Calendar grid */}
            <div style={S.grid}>
              {cells.map((d, i) => (
                <div
                  key={i}
                  style={getDayStyle(d)}
                  onClick={() => d && handleDayClick(d)}
                  onMouseEnter={() => d && !isPast(d) && selecting === 'end' && start && d > start && setHovered(d)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {d?.getDate()}
                </div>
              ))}
            </div>

            {/* Days count */}
            {start && effectiveEnd && calcDays(start, effectiveEnd) > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  marginTop: '14px',
                  textAlign: 'center',
                  fontSize: '0.78rem',
                  color: 'var(--gold-light)',
                  padding: '8px',
                  background: 'rgba(201,168,76,0.08)',
                  borderRadius: '8px',
                  border: '1px solid rgba(201,168,76,0.15)',
                }}
              >
                ✦ {calcDays(start, effectiveEnd)} night{calcDays(start, effectiveEnd) !== 1 ? 's' : ''} selected
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
