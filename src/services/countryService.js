// src/services/countryService.js

import axios from 'axios'
import config from '../config/api'

export const fetchCountryByCode = async (countryCode) => {
  try {
    const res = await axios.get(
      `${config.restCountries.base}/alpha/${countryCode.toUpperCase()}`
    )
    const c = res.data[0]

    const languages = c.languages ? Object.values(c.languages).join(', ') : 'N/A'
    const currencies = c.currencies
      ? Object.entries(c.currencies)
          .map(([code, val]) => `${val.name} (${val.symbol || code})`)
          .join(', ')
      : 'N/A'
    const currencyCode = c.currencies ? Object.keys(c.currencies)[0] : 'USD'
    const timezones = c.timezones?.slice(0, 2).join(', ') || 'N/A'
    const drivingSide = c.car?.side || 'right'

    return {
      data: {
        name: c.name.common,
        officialName: c.name.official,
        capital: c.capital?.[0] || 'N/A',
        region: c.region,
        subregion: c.subregion,
        population: c.population,
        languages,
        currencies,
        currencyCode,
        timezones,
        drivingSide,
        flag: c.flags?.svg || c.flags?.png,
        flagEmoji: c.flag,
        maps: c.maps?.googleMaps,
        code: countryCode.toUpperCase(),
      },
      error: null,
    }
  } catch (error) {
    console.error('Country fetch error:', error)
    return { data: null, error: error.message }
  }
}

// Get country code from weather API response (2-letter ISO)
export const fetchCountryByName = async (name) => {
  try {
    const res = await axios.get(
      `${config.restCountries.base}/name/${encodeURIComponent(name)}?fullText=true`
    )
    const code = res.data[0]?.cca2
    if (code) return fetchCountryByCode(code)
    throw new Error('Country not found')
  } catch (error) {
    return { data: null, error: error.message }
  }
}
