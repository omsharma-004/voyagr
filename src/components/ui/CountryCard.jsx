// src/components/ui/CountryCard.jsx

import { motion } from 'framer-motion'

const s = {
  card: {
    background: 'var(--white)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-md)',
    border: '1px solid rgba(90,78,58,0.08)',
  },
  flagBanner: {
    width: '100%',
    height: '90px',
    objectFit: 'cover',
    display: 'block',
    background: 'var(--ivory-dark)',
  },
  flagFallback: {
    height: '90px',
    background: 'linear-gradient(135deg, var(--ivory-dark), var(--cream))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3rem',
  },
  body: {
    padding: '20px',
  },
  nameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '16px',
  },
  countryName: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.4rem',
    fontWeight: 400,
    color: 'var(--text-primary)',
  },
  label: {
    fontSize: '0.68rem',
    fontWeight: 600,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    marginBottom: '12px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  itemLabel: {
    fontSize: '0.68rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: 600,
  },
  itemValue: {
    fontSize: '0.85rem',
    color: 'var(--text-primary)',
    fontWeight: 400,
  },
  divider: {
    height: '1px',
    background: 'rgba(90,78,58,0.08)',
    margin: '16px 0',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    background: 'rgba(196,96,58,0.08)',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.75rem',
    color: 'var(--terracotta)',
    fontWeight: 500,
  },
}

const formatPopulation = (n) => {
  if (!n) return 'N/A'
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return n.toString()
}

export default function CountryCard({ country }) {
  if (!country) return null

  return (
    <motion.div
      style={s.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* Flag */}
      {country.flag ? (
        <img src={country.flag} alt={`${country.name} flag`} style={s.flagBanner} />
      ) : (
        <div style={s.flagFallback}>{country.flagEmoji || '🏳'}</div>
      )}

      <div style={s.body}>
        <div style={s.nameRow}>
          <div style={s.countryName}>{country.name}</div>
        </div>

        <div style={s.label}>Country Information</div>

        <div style={s.grid}>
          <div style={s.item}>
            <span style={s.itemLabel}>Capital</span>
            <span style={s.itemValue}>{country.capital}</span>
          </div>
          <div style={s.item}>
            <span style={s.itemLabel}>Region</span>
            <span style={s.itemValue}>{country.region}</span>
          </div>
          <div style={s.item}>
            <span style={s.itemLabel}>Population</span>
            <span style={s.itemValue}>{formatPopulation(country.population)}</span>
          </div>
          <div style={s.item}>
            <span style={s.itemLabel}>Languages</span>
            <span style={s.itemValue}>{country.languages}</span>
          </div>
          <div style={s.item}>
            <span style={s.itemLabel}>Timezone</span>
            <span style={s.itemValue}>{country.timezones}</span>
          </div>
          <div style={s.item}>
            <span style={s.itemLabel}>Drives on</span>
            <span style={s.itemValue}>{country.drivingSide === 'left' ? '⬅ Left' : '➡ Right'}</span>
          </div>
        </div>

        <div style={s.divider} />

        <div style={s.item}>
          <span style={s.itemLabel}>Currency</span>
          <span style={s.itemValue}>{country.currencies}</span>
        </div>
      </div>
    </motion.div>
  )
}
