// src/components/sections/Destinations.jsx

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useTrip } from '../../hooks/useTrip.jsx'
import styles from './Destinations.module.css'

const DESTINATIONS = [
  { name: 'Kashmir', country: 'India', category: 'Heaven on Earth', isIndia: true,
    img: 'https://images.unsplash.com/photo-1588083949404-c4f1ed1323b3?w=600&q=80',
    meta: { city: 'Srinagar', state: 'Jammu & Kashmir', country: 'India', countryCode: 'IN', displayName: 'Srinagar, Jammu & Kashmir, India', lat: 34.0837, lon: 74.7973 } },
  { name: 'Leh Ladakh', country: 'India', category: 'Adventure', isIndia: true,
    img: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=600&q=80',
    meta: { city: 'Leh', state: 'Ladakh', country: 'India', countryCode: 'IN', displayName: 'Leh, Ladakh, India', lat: 34.1526, lon: 77.5771 } },
  { name: 'Kerala', country: 'India', category: "God's Own Country", isIndia: true,
    img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80',
    meta: { city: 'Alleppey', state: 'Kerala', country: 'India', countryCode: 'IN', displayName: 'Alleppey, Kerala, India', lat: 9.4981, lon: 76.3388 } },
  { name: 'Jaipur', country: 'India', category: 'The Pink City', isIndia: true,
    img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80',
    meta: { city: 'Jaipur', state: 'Rajasthan', country: 'India', countryCode: 'IN', displayName: 'Jaipur, Rajasthan, India', lat: 26.9124, lon: 75.7873 } },
  { name: 'Goa', country: 'India', category: 'Beach & Culture', isIndia: true,
    img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80',
    meta: { city: 'Goa', state: 'Goa', country: 'India', countryCode: 'IN', displayName: 'Goa, India', lat: 15.2993, lon: 74.1240 } },
  { name: 'Udaipur', country: 'India', category: 'City of Lakes', isIndia: true,
    img: 'https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=600&q=80',
    meta: { city: 'Udaipur', state: 'Rajasthan', country: 'India', countryCode: 'IN', displayName: 'Udaipur, Rajasthan, India', lat: 24.5854, lon: 73.7125 } },
  { name: 'Manali', country: 'India', category: 'Mountains', isIndia: true,
    img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80',
    meta: { city: 'Manali', state: 'Himachal Pradesh', country: 'India', countryCode: 'IN', displayName: 'Manali, Himachal Pradesh, India', lat: 32.2396, lon: 77.1887 } },
  { name: 'Rishikesh', country: 'India', category: 'Spiritual & Adventure', isIndia: true,
    img: 'https://images.unsplash.com/photo-1585016495481-91613b765c5c?w=600&q=80',
    meta: { city: 'Rishikesh', state: 'Uttarakhand', country: 'India', countryCode: 'IN', displayName: 'Rishikesh, Uttarakhand, India', lat: 30.0869, lon: 78.2676 } },
  { name: 'Andaman', country: 'India', category: 'Island Paradise', isIndia: true,
    img: 'https://images.unsplash.com/photo-1569428034239-f9565e32e224?w=600&q=80',
    meta: { city: 'Port Blair', state: 'Andaman', country: 'India', countryCode: 'IN', displayName: 'Port Blair, Andaman & Nicobar, India', lat: 11.6234, lon: 92.7265 } },
  { name: 'Meghalaya', country: 'India', category: 'Scotland of the East', isIndia: true,
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    meta: { city: 'Shillong', state: 'Meghalaya', country: 'India', countryCode: 'IN', displayName: 'Shillong, Meghalaya, India', lat: 25.5788, lon: 91.8933 } },
  // Global
  { name: 'Bali', country: 'Indonesia', category: 'Tropical', isIndia: false,
    img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
    meta: { city: 'Bali', state: '', country: 'Indonesia', countryCode: 'ID', displayName: 'Bali, Indonesia', lat: -8.3405, lon: 115.0920 } },
  { name: 'Dubai', country: 'UAE', category: 'Luxury', isIndia: false,
    img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80',
    meta: { city: 'Dubai', state: '', country: 'United Arab Emirates', countryCode: 'AE', displayName: 'Dubai, UAE', lat: 25.2048, lon: 55.2708 } },
  { name: 'Tokyo', country: 'Japan', category: 'Metropolis', isIndia: false,
    img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80',
    meta: { city: 'Tokyo', state: '', country: 'Japan', countryCode: 'JP', displayName: 'Tokyo, Japan', lat: 35.6762, lon: 139.6503 } },
]

export default function Destinations() {
  const { updateSearchParams } = useTrip()

  const handleCardClick = (dest) => {
    updateSearchParams({ destination: dest.meta.displayName, destinationMeta: dest.meta })
    // Scroll to search, fill input
    const searchEl = document.getElementById('search')
    if (searchEl) {
      searchEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    // Update the search input via custom event
    window.dispatchEvent(new CustomEvent('voyagr:setDestination', { detail: dest.meta }))
  }

  return (
    <section className={styles.section} id="discover">
      <div className={styles.header}>
        <div>
          <div className={styles.eyebrow}>Popular Destinations</div>
          <h2 className={styles.title}>
            Where will your<br />
            <em>story begin?</em>
          </h2>
        </div>
        <p className={styles.subtitle}>
          From the Himalayas to the Mediterranean — click any destination to instantly plan your trip.
        </p>
      </div>

      <div className={styles.track}>
        {DESTINATIONS.map((dest, i) => (
          <motion.div
            key={dest.name}
            className={styles.card}
            onClick={() => handleCardClick(dest)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            whileHover={{ y: -6 }}
          >
            <img
              className={styles.cardImg}
              src={dest.img}
              alt={dest.name}
              loading="lazy"
            />
            <div className={styles.cardOverlay} />
            <div className={styles.cardContent}>
              {dest.isIndia && (
                <div className={styles.indiaBadge}>🇮🇳 India</div>
              )}
              <div className={styles.cardCategory}>{dest.category}</div>
              <div className={styles.cardName}>{dest.name}</div>
              <div className={styles.cardCountry}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
                </svg>
                {dest.country}
              </div>
            </div>
            <div className={styles.cardArrow}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
