// src/services/exchangeService.js

import axios from 'axios'
import config from '../config/api'

export const fetchExchangeRates = async (baseCurrency = 'USD') => {
  try {
    const res = await axios.get(
      `${config.exchange.base}/${config.exchange.key}/latest/${baseCurrency}`
    )

    if (res.data.result !== 'success') throw new Error('Exchange API error')

    const rates = res.data.conversion_rates
    return {
      data: {
        base: baseCurrency,
        rates,
        timestamp: res.data.time_last_update_unix,
      },
      error: null,
    }
  } catch (error) {
    console.error('Exchange rate error:', error)
    return { data: null, error: error.message }
  }
}

export const convertCurrency = (amount, fromRate, toRate) => {
  if (!fromRate || !toRate) return 0
  return ((amount / fromRate) * toRate).toFixed(2)
}

export const formatCurrency = (amount, currencyCode) => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `${currencyCode} ${amount}`
  }
}
