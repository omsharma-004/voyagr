// src/components/ui/CurrencyCard.jsx

import { motion } from 'framer-motion'
import { formatCurrency } from '../../services/exchangeService'

const COMPARE_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
]

const s = {
  card: {
    background: 'linear-gradient(135deg, #1a1208 0%, #2d1f0e 100%)',
    borderRadius: 'var(--radius-lg)',
    padding: '28px',
    color: 'white',
    boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
    position: 'relative',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: '-60px',
    right: '-60px',
    width: '200px',
    height: '200px',
    background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  label: {
    fontSize: '0.68rem',
    fontWeight: 600,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: 'var(--gold)',
    marginBottom: '20px',
    position: 'relative',
  },
  baseRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    background: 'rgba(201,168,76,0.1)',
    borderRadius: '12px',
    border: '1px solid rgba(201,168,76,0.2)',
    marginBottom: '20px',
    position: 'relative',
  },
  baseLabel: {
    fontSize: '0.75rem',
    color: 'var(--gold-light)',
    opacity: 0.7,
    marginBottom: '4px',
  },
  baseAmount: {
    fontFamily: 'var(--font-serif)',
    fontSize: '2rem',
    fontWeight: 300,
    color: 'var(--gold-light)',
  },
  currencyCode: {
    fontSize: '0.8rem',
    color: 'var(--gold)',
    fontWeight: 600,
    letterSpacing: '0.1em',
  },
  conversionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    position: 'relative',
  },
  convRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px',
    background: 'rgba(255,255,255,0.04)',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  convLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  flag: {
    fontSize: '1.3rem',
  },
  convName: {
    fontSize: '0.82rem',
    color: 'rgba(255,255,255,0.6)',
  },
  convCode: {
    fontSize: '0.72rem',
    color: 'rgba(255,255,255,0.35)',
  },
  convAmount: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.1rem',
    fontWeight: 400,
    color: 'rgba(255,255,255,0.9)',
  },
  disclaimer: {
    fontSize: '0.65rem',
    color: 'rgba(255,255,255,0.25)',
    marginTop: '16px',
    position: 'relative',
  },
}

export default function CurrencyCard({ exchange, currencyCode }) {
  if (!exchange || !currencyCode) return null

  const rates = exchange.rates
  const localRate = rates[currencyCode] || 1
  const baseAmount = 100 // Show conversion for 100 USD equivalent

  // Get local currency amount from 100 USD
  const localAmount = baseAmount * localRate

  return (
    <motion.div
      style={s.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div style={s.glow} />
      <div style={s.label}>Currency Exchange</div>

      {/* Base */}
      <div style={s.baseRow}>
        <div>
          <div style={s.baseLabel}>100 US Dollars equals</div>
          <div style={s.baseAmount}>
            {formatCurrency(localAmount, currencyCode)}
          </div>
        </div>
        <div style={s.currencyCode}>{currencyCode}</div>
      </div>

      {/* Compare currencies */}
      <div style={s.conversionList}>
        {COMPARE_CURRENCIES.filter((c) => c.code !== currencyCode).map((cur) => {
          const converted = (localAmount / localRate) * (rates[cur.code] || 1)
          return (
            <div key={cur.code} style={s.convRow}>
              <div style={s.convLeft}>
                <span style={s.flag}>{cur.flag}</span>
                <div>
                  <div style={s.convName}>{cur.name}</div>
                  <div style={s.convCode}>{cur.code}</div>
                </div>
              </div>
              <div style={s.convAmount}>
                {formatCurrency(converted, cur.code)}
              </div>
            </div>
          )
        })}
      </div>

      <div style={s.disclaimer}>
        *Rates are approximate. Verify before transactions.
      </div>
    </motion.div>
  )
}
