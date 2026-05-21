// src/services/weatherService.js

import axios from 'axios'
import config from '../config/api'

export const fetchWeather = async (city) => {
  try {
    const [current, forecast] = await Promise.all([
      axios.get(`${config.weather.base}/weather`, {
        params: { q: city, appid: config.weather.key, units: 'metric' },
      }),
      axios.get(`${config.weather.base}/forecast`, {
        params: { q: city, appid: config.weather.key, units: 'metric', cnt: 40 },
      }),
    ])

    // Aggregate daily forecasts from 3h intervals
    const dailyMap = {}
    forecast.data.list.forEach((item) => {
      const date = item.dt_txt.split(' ')[0]
      if (!dailyMap[date]) {
        dailyMap[date] = {
          date,
          temps: [],
          icons: [],
          descriptions: [],
        }
      }
      dailyMap[date].temps.push(item.main.temp)
      dailyMap[date].icons.push(item.weather[0].icon)
      dailyMap[date].descriptions.push(item.weather[0].description)
    })

    const daily = Object.values(dailyMap)
      .slice(0, 5)
      .map((d) => ({
        date: d.date,
        high: Math.round(Math.max(...d.temps)),
        low: Math.round(Math.min(...d.temps)),
        icon: d.icons[Math.floor(d.icons.length / 2)],
        description: d.descriptions[0],
      }))

    return {
      data: {
        city: current.data.name,
        country: current.data.sys.country,
        temp: Math.round(current.data.main.temp),
        feelsLike: Math.round(current.data.main.feels_like),
        humidity: current.data.main.humidity,
        windSpeed: current.data.wind.speed,
        description: current.data.weather[0].description,
        icon: current.data.weather[0].icon,
        daily,
      },
      error: null,
    }
  } catch (error) {
    console.error('Weather fetch error:', error)
    return { data: null, error: error.message }
  }
}

export const getWeatherIconUrl = (icon) =>
  `https://openweathermap.org/img/wn/${icon}@2x.png`
