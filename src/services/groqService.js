// src/services/groqService.js — AI itinerary generation via Groq

import axios from 'axios'
import config from '../config/api'

const buildPrompt = ({ destination, dates, budget, budgetINR, budgetLabel, interests, weather, country }) => {
  const startDate = dates.start ? new Date(dates.start).toDateString() : 'TBD'
  const endDate = dates.end ? new Date(dates.end).toDateString() : 'TBD'
  const totalDays = dates.totalDays || 3

  const weatherContext = weather
    ? `Current weather: ${weather.temp}°C, ${weather.description}, humidity ${weather.humidity}%`
    : 'Weather data unavailable'

  const countryContext = country
    ? `Country: ${country.name}, Capital: ${country.capital}, Language: ${country.languages}, Currency: ${country.currencies}`
    : ''

  // Budget-aware instructions
  const budgetPerDay = budgetINR ? Math.round(budgetINR / Math.max(totalDays, 1)) : null
  const budgetContext = budgetINR
    ? `Total trip budget: ₹${budgetINR.toLocaleString('en-IN')} INR (${budgetLabel || budget}) — approx ₹${budgetPerDay?.toLocaleString('en-IN')} per day`
    : `Budget level: ${budget}`

  const budgetInstructions = budgetINR
    ? budgetINR <= 15000
      ? 'BUDGET CONSTRAINTS: This is a very tight budget. Suggest hostels/dorms, street food, local buses/trains, free attractions, budget guesthouses. Avoid anything expensive.'
      : budgetINR <= 50000
      ? 'BUDGET CONSTRAINTS: Mid-range budget. Suggest 3-star hotels or clean guesthouses, local restaurants and cafes, autos/cabs, popular paid attractions.'
      : budgetINR <= 150000
      ? 'BUDGET CONSTRAINTS: Premium budget. Suggest 4-star hotels, good restaurants, private cabs/Ola, premium experiences and guided tours.'
      : 'BUDGET CONSTRAINTS: Luxury budget. Suggest 5-star resorts, fine dining, private transfers, exclusive experiences, luxury stays. No budget compromises.'
    : ''

  return `You are an expert AI travel planner specialising in Indian and global travel. Create a detailed ${totalDays}-day travel itinerary for ${destination}.

TRIP DETAILS:
- Destination: ${destination}
- Travel dates: ${startDate} to ${endDate} (${totalDays} days)
- ${budgetContext}
- Interests: ${interests.join(', ')}
- ${weatherContext}
- ${countryContext}

${budgetInstructions}

INSTRUCTIONS:
1. Create exactly ${totalDays} days of itinerary
2. Each day has morning, afternoon, and evening activities
3. Activities must be REAL places/experiences in ${destination}
4. STRICTLY match accommodation, food, and transport to the budget level
5. Consider the weather when suggesting activities
6. Be specific — real restaurant names, attraction names, neighbourhoods
7. For Indian destinations include local transport options (auto, metro, train)

RESPOND WITH ONLY VALID JSON in this exact structure:
{
  "destination": "${destination}",
  "totalDays": ${totalDays},
  "summary": "2-3 sentence trip overview mentioning budget tier",
  "highlights": ["highlight1", "highlight2", "highlight3"],
  "days": [
    {
      "day": 1,
      "date": "${startDate}",
      "theme": "Day theme title",
      "morning": {
        "time": "8:00 AM",
        "title": "Activity title",
        "description": "2-3 sentence description with specific details",
        "location": "Specific location name",
        "imageKeyword": "relevant search keyword for unsplash",
        "duration": "2 hours",
        "tips": "Practical tip for this activity"
      },
      "afternoon": {
        "time": "1:00 PM",
        "title": "Activity title",
        "description": "2-3 sentence description with specific details",
        "location": "Specific location name",
        "imageKeyword": "relevant search keyword for unsplash",
        "duration": "3 hours",
        "tips": "Practical tip"
      },
      "evening": {
        "time": "7:00 PM",
        "title": "Activity title",
        "description": "2-3 sentence description with specific details",
        "location": "Specific location name",
        "imageKeyword": "relevant search keyword for unsplash",
        "duration": "2-3 hours",
        "tips": "Practical tip"
      }
    }
  ],
  "packingTips": ["tip1", "tip2", "tip3"],
  "localPhrases": [
    {"phrase": "local phrase", "meaning": "English meaning", "pronunciation": "how to say it"}
  ],
  "budgetBreakdown": {
    "accommodation": "estimated range per night in INR",
    "food": "estimated per day in INR",
    "transport": "estimated total in INR",
    "activities": "estimated total in INR"
  }
}`
}

export const generateItinerary = async (tripParams) => {
  try {
    const prompt = buildPrompt(tripParams)

    const res = await axios.post(
      `${config.groq.base}/chat/completions`,
      {
        model: config.groq.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4000,
        temperature: 0.7,
        response_format: { type: 'json_object' },
      },
      {
        headers: {
          Authorization: `Bearer ${config.groq.key}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const content = res.data.choices[0].message.content
    const itinerary = JSON.parse(content)

    return { data: itinerary, error: null }
  } catch (error) {
    console.error('Groq API error:', error)
    return { data: null, error: error.response?.data?.error?.message || error.message }
  }
}
