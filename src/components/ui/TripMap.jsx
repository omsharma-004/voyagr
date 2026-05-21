// src/components/ui/TripMap.jsx

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const s = {
  wrapper: {
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-md)',
    position: 'relative',
  },
  mapEl: {
    width: '100%',
    height: '340px',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    padding: '14px 16px',
    background: 'var(--white)',
    borderTop: '1px solid rgba(90,78,58,0.08)',
  },
  btn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.78rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'var(--font-sans)',
    border: 'none',
  },
  btnPrimary: {
    background: 'var(--terracotta)',
    color: 'white',
  },
  btnSecondary: {
    background: 'transparent',
    border: '1.5px solid rgba(90,78,58,0.2)',
    color: 'var(--text-secondary)',
  },
}

export default function TripMap({ lat, lon, destination }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  useEffect(() => {
    if (!lat || !lon || mapInstanceRef.current) return

    // Dynamically import Leaflet to avoid SSR issues
    import('leaflet').then((L) => {
      if (mapInstanceRef.current) return

      const map = L.default.map(mapRef.current, {
        center: [lat, lon],
        zoom: 12,
        zoomControl: true,
        scrollWheelZoom: false,
      })

      L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map)

      // Custom marker
      const icon = L.default.divIcon({
        html: `
          <div style="
            width:36px;height:36px;
            background:linear-gradient(135deg,#c4603a,#c9a84c);
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            box-shadow:0 4px 16px rgba(196,96,58,0.5);
            display:flex;align-items:center;justify-content:center;
          ">
            <div style="
              width:12px;height:12px;
              background:white;
              border-radius:50%;
              transform:rotate(45deg);
            "></div>
          </div>
        `,
        className: '',
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
      })

      L.default
        .marker([lat, lon], { icon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:var(--font-sans);font-size:0.85rem;font-weight:500;padding:4px 2px">${destination}</div>`,
          { closeButton: false }
        )
        .openPopup()

      mapInstanceRef.current = map
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [lat, lon, destination])

  const openInMaps = () => {
    window.open(
      `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=13/${lat}/${lon}`,
      '_blank'
    )
  }

  const openDirections = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`,
      '_blank'
    )
  }

  return (
    <motion.div
      style={s.wrapper}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
    >
      <div ref={mapRef} style={s.mapEl} />
      <div style={s.actions}>
        <button style={{ ...s.btn, ...s.btnPrimary }} onClick={openInMaps}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
          </svg>
          Open in Maps
        </button>
        <button style={{ ...s.btn, ...s.btnSecondary }} onClick={openDirections}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="3 11 22 2 13 21 11 13 3 11" />
          </svg>
          Get Directions
        </button>
      </div>
    </motion.div>
  )
}
