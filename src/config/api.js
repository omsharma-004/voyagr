// src/config/api.js — Central API configuration

const config = {
  weather: {
    key: import.meta.env.VITE_WEATHER_API_KEY,
    base: 'https://api.openweathermap.org/data/2.5',
  },
  exchange: {
    key: import.meta.env.VITE_EXCHANGE_API_KEY,
    base: 'https://v6.exchangerate-api.com/v6',
  },
  groq: {
    key: import.meta.env.VITE_GROQ_API_KEY,
    base: 'https://api.groq.com/openai/v1',
    model: 'llama-3.1-8b-instant',
  },
  nominatim: {
    base: 'https://nominatim.openstreetmap.org',
  },
  restCountries: {
    base: 'https://restcountries.com/v3.1',
  },
  unsplash: {
    base: 'https://source.unsplash.com/featured',
  },
}

export default config
