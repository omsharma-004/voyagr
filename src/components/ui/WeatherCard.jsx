// src/components/ui/WeatherCard.jsx — refined alignment + compact

import { motion } from 'framer-motion'
import { getWeatherIconUrl } from '../../services/weatherService'

const getDayLabel = (dateStr, i) => {
  if (i === 0) return 'Today'
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return days[new Date(dateStr).getDay()]
}

export default function WeatherCard({ weather }) {
  if (!weather) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      style={{
        background: 'linear-gradient(145deg, #1a3354 0%, #253f6b 55%, #162840 100%)',
        borderRadius: '16px',
        padding: '20px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 16px 48px rgba(26,51,84,0.45)',
      }}
    >
      {/* subtle texture */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.04) 0%, transparent 60%)', pointerEvents: 'none' }} />

      {/* Top row: city + label */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', position: 'relative' }}>
        <div>
          <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '3px' }}>
            Current Weather
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 400, lineHeight: 1.1 }}>
            {weather.city}
          </div>
        </div>
        <img
          src={getWeatherIconUrl(weather.icon)}
          alt={weather.description}
          style={{ width: '52px', height: '52px', objectFit: 'contain', marginTop: '-4px' }}
        />
      </div>

      {/* Temp row — properly aligned baseline */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', marginBottom: '4px', position: 'relative' }}>
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '4rem', fontWeight: 300, lineHeight: 1, letterSpacing: '-0.02em' }}>
          {weather.temp}
        </span>
        <span style={{ fontSize: '1.4rem', fontWeight: 300, opacity: 0.6, paddingBottom: '6px' }}>°C</span>
      </div>

      {/* Description */}
      <div style={{ fontSize: '0.82rem', textTransform: 'capitalize', opacity: 0.65, marginBottom: '16px', position: 'relative', letterSpacing: '0.02em' }}>
        {weather.description}
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px', position: 'relative' }}>
        {[
          { label: 'Feels like', value: `${weather.feelsLike}°` },
          { label: 'Humidity',   value: `${weather.humidity}%` },
          { label: 'Wind',       value: `${weather.windSpeed} m/s` },
        ].map(item => (
          <div key={item.label} style={{
            background: 'rgba(255,255,255,0.07)',
            borderRadius: '10px',
            padding: '10px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
            backdropFilter: 'blur(4px)',
          }}>
            <span style={{ fontSize: '0.6rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{item.label}</span>
            <span style={{ fontSize: '0.92rem', fontWeight: 500 }}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* 5-day forecast */}
      {weather.daily?.length > 0 && (
        <>
          <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.45, marginBottom: '10px', position: 'relative' }}>
            5-Day Forecast
          </div>
          <div style={{ display: 'flex', gap: '6px', position: 'relative' }}>
            {weather.daily.map((day, i) => (
              <div key={day.date} style={{
                flex: 1,
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '10px',
                padding: '8px 4px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
              }}>
                <span style={{ fontSize: '0.58rem', opacity: 0.5, fontWeight: 600 }}>{getDayLabel(day.date, i)}</span>
                <img src={getWeatherIconUrl(day.icon)} alt="" style={{ width: '24px', height: '24px' }} />
                <span style={{ fontSize: '0.76rem', fontWeight: 600 }}>{day.high}°</span>
                <span style={{ fontSize: '0.68rem', opacity: 0.4 }}>{day.low}°</span>
              </div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  )
}
