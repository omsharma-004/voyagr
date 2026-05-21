// src/services/geoService.js — Nominatim autocomplete + geocoding

import axios from 'axios'
import config from '../config/api'

export const searchDestinations = async (query) => {
  if (!query || query.trim().length < 2) return { results: [], error: null }

  try {
    const res = await axios.get(`${config.nominatim.base}/search`, {
      params: {
        q: query,
        format: 'json',
        addressdetails: 1,
        limit: 8,
        featuretype: 'city',
      },
      headers: { 'Accept-Language': 'en' },
    })

    const results = res.data
      .filter((item) =>
        ['city', 'town', 'village', 'municipality', 'administrative'].includes(
          item.type
        ) || item.class === 'place' || item.class === 'boundary'
      )
      .map((item) => {
        const addr = item.address
        const city =
          addr.city ||
          addr.town ||
          addr.village ||
          addr.municipality ||
          addr.county ||
          item.name
        const state = addr.state || addr.region || ''
        const country = addr.country || ''
        const countryCode = addr.country_code?.toUpperCase() || ''

        return {
          id: item.place_id,
          displayName: [city, state, country].filter(Boolean).join(', '),
          city,
          state,
          country,
          countryCode,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
          fullName: item.display_name,
        }
      })
      .filter((item, index, self) =>
        // Deduplicate by city+country
        index === self.findIndex((t) => t.city === item.city && t.country === item.country)
      )
      .slice(0, 6)

    return { results, error: null }
  } catch (error) {
    console.error('Geocoding error:', error)
    return { results: [], error: error.message }
  }
}

export const geocodeCity = async (cityName) => {
  try {
    const res = await axios.get(`${config.nominatim.base}/search`, {
      params: { q: cityName, format: 'json', limit: 1 },
      headers: { 'Accept-Language': 'en' },
    })

    if (!res.data.length) throw new Error('City not found')
    const item = res.data[0]
    return {
      data: {
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        displayName: item.display_name,
      },
      error: null,
    }
  } catch (error) {
    return { data: null, error: error.message }
  }
}
