// src/components/ui/CurrencyCalculator.jsx
// Shows only for foreign destinations — "How much INR do I need?"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { formatCurrency } from '../../services/exchangeService'

const PRESETS = [10000, 25000, 50000, 100000]
const fmtINR = (n) => `₹${Number(n).toLocaleString('en-IN')}`

export default function CurrencyCalculator({ exchange, currencyCode, countryName }) {
  const [inrAmount, setInrAmount] = useState(25000)

  if (!exchange || !currencyCode) return null

  const rates    = exchange.rates
  const inrRate  = rates['INR'] || 83
  const destRate = rates[currencyCode] || 1

  // INR → USD → dest currency
  const converted = ((inrAmount / inrRate) * destRate).toFixed(2)

  const handleInput = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '')
    setInrAmount(Number(val) || 0)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background: 'var(--white)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        border: '1px solid rgba(90,78,58,0.08)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div style={{
        fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.14em',
        textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '14px',
        display: 'flex', alignItems: 'center', gap: '6px',
      }}>
        <span>💱</span> Currency Calculator
      </div>

      {/* INR input */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '12px 16px',
        background: 'var(--ivory)',
        borderRadius: 'var(--radius-md)',
        border: '1.5px solid rgba(90,78,58,0.12)',
        marginBottom: '10px',
      }}>
        <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>₹</span>
        <input
          type="text"
          value={inrAmount ? inrAmount.toLocaleString('en-IN') : ''}
          onChange={handleInput}
          placeholder="Enter INR amount"
          style={{
            flex: 1, border: 'none', background: 'transparent',
            fontSize: '1rem', fontFamily: 'var(--font-sans)',
            color: 'var(--text-primary)', outline: 'none',
          }}
        />
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>INR</span>
      </div>

      {/* Arrow */}
      <div style={{ textAlign: 'center', color: 'var(--terracotta)', fontSize: '1rem', margin: '6px 0' }}>↓</div>

      {/* Converted output */}
      <div style={{
        padding: '14px 16px',
        background: 'linear-gradient(135deg, var(--terracotta), var(--terracotta-light))',
        borderRadius: 'var(--radius-md)',
        marginBottom: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.65)', marginBottom: '2px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            You get approx.
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 300, color: 'white' }}>
            {formatCurrency(converted, currencyCode)}
          </div>
        </div>
        <div style={{
          padding: '4px 10px',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '999px',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'white',
          letterSpacing: '0.06em',
        }}>
          {currencyCode}
        </div>
      </div>

      {/* Preset pills */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => setInrAmount(p)}
            style={{
              padding: '5px 12px',
              borderRadius: '999px',
              fontSize: '0.72rem',
              fontWeight: 500,
              cursor: 'pointer',
              border: `1.5px solid ${inrAmount === p ? 'var(--terracotta)' : 'rgba(90,78,58,0.15)'}`,
              background: inrAmount === p ? 'rgba(196,96,58,0.08)' : 'transparent',
              color: inrAmount === p ? 'var(--terracotta)' : 'var(--text-muted)',
              fontFamily: 'var(--font-sans)',
              transition: 'all 0.15s',
            }}
          >
            {fmtINR(p)}
          </button>
        ))}
      </div>

      <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '10px' }}>
        *Indicative rates only. Verify before transactions.
      </div>
    </motion.div>
  )
}
