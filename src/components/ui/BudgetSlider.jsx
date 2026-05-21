// src/components/ui/BudgetSlider.jsx

import { motion, AnimatePresence } from 'framer-motion'

const TIERS = [
  { min: 5000,  max: 15000,  mid: 10000, label: '₹5k–₹15k',  tier: 'budget',    desc: 'Backpacking', c1: '#6b9fd4', c2: '#4a7fb5', perDay: '~₹1,500/day' },
  { min: 15001, max: 40000,  mid: 25000, label: '₹15k–₹40k', tier: 'mid-range', desc: 'Comfortable',  c1: '#c4603a', c2: '#d4784e', perDay: '~₹3,500/day' },
  { min: 40001, max: 80000,  mid: 55000, label: '₹40k–₹80k', tier: 'premium',   desc: 'Premium',      c1: '#9b59b6', c2: '#c9a84c', perDay: '~₹8,000/day' },
  { min: 80001, max: 100000, mid: 90000, label: '₹80k–₹1L',  tier: 'luxury',    desc: 'Luxury',       c1: '#c9a84c', c2: '#e8c97a', perDay: '~₹15,000/day' },
]

const MIN = 5000
const MAX = 100000
const STEP = 2500

const getTier = (v) => TIERS.find(t => v <= t.max) || TIERS[TIERS.length - 1]

const fmt = (v) => {
  if (v >= 100000) return '₹1L'
  if (v >= 1000)   return `₹${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k`
  return `₹${v}`
}

export default function BudgetSlider({ value = 25000, onChange }) {
  const tier = getTier(value)
  const pct  = Math.round(((value - MIN) / (MAX - MIN)) * 100)
  const { c1, c2 } = tier

  const emit = (raw) => {
    const t = getTier(raw)
    onChange?.({ budgetINR: raw, budget: t.tier, budgetLabel: t.label })
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
            Trip Budget
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
            <AnimatePresence mode="wait">
              <motion.span
                key={value}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15 }}
                style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 300, color: 'var(--text-primary)', lineHeight: 1 }}
              >
                {fmt(value)}
              </motion.span>
            </AnimatePresence>
            <span style={{ fontSize: '0.67rem', color: 'var(--text-muted)' }}>total</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tier.tier}
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -5 }}
            transition={{ duration: 0.18 }}
            style={{ textAlign: 'right' }}
          >
            <div style={{
              display: 'inline-block', padding: '3px 10px', borderRadius: '999px',
              background: `linear-gradient(135deg, ${c1}, ${c2})`,
              fontSize: '0.67rem', fontWeight: 700, letterSpacing: '0.07em',
              color: 'white', textTransform: 'uppercase', marginBottom: '3px',
            }}>
              {tier.desc}
            </div>
            <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>{tier.perDay}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slider track */}
      <div style={{ position: 'relative', height: '20px', display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, height: '3px', background: 'rgba(90,78,58,0.1)', borderRadius: '3px', pointerEvents: 'none' }} />
        <motion.div
          animate={{ width: `${pct}%`, background: `linear-gradient(90deg, ${c1}, ${c2})` }}
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          style={{ position: 'absolute', left: 0, height: '3px', borderRadius: '3px', pointerEvents: 'none', boxShadow: `0 0 6px ${c2}55` }}
        />
        <input
          type="range" min={MIN} max={MAX} step={STEP} value={value}
          onChange={e => emit(Number(e.target.value))}
          style={{ position: 'relative', width: '100%', appearance: 'none', WebkitAppearance: 'none', background: 'transparent', cursor: 'pointer', outline: 'none', zIndex: 1, height: '20px', margin: 0 }}
        />
      </div>

      {/* Tier presets */}
      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
        {TIERS.map(t => {
          const active = value >= t.min && value <= t.max
          return (
            <button key={t.mid} onClick={() => emit(t.mid)} style={{
              padding: '3px 9px', borderRadius: '999px', fontSize: '0.66rem', fontWeight: 500,
              cursor: 'pointer', fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap',
              border: `1.5px solid ${active ? t.c1 : 'rgba(90,78,58,0.13)'}`,
              background: active ? `${t.c1}14` : 'transparent',
              color: active ? t.c1 : 'var(--text-muted)',
              transition: 'all 0.18s',
            }}>
              {t.label}
            </button>
          )
        })}
      </div>

      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%;
          background: white; border: 2px solid ${c2};
          box-shadow: 0 1px 6px rgba(0,0,0,0.18); cursor: pointer;
          transition: transform 0.1s;
        }
        input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.25); }
        input[type=range]::-moz-range-thumb {
          width: 16px; height: 16px; border-radius: 50%;
          background: white; border: 2px solid ${c2}; cursor: pointer;
        }
      `}</style>
    </div>
  )
}
