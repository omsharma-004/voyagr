// src/utils/calendarUtils.js

export const generateGoogleCalendarUrl = ({ destination, startDate, endDate, itinerary }) => {
  const formatDate = (date) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  const title = encodeURIComponent(`Voyagr Trip: ${destination}`)
  const start = formatDate(startDate)
  const end = formatDate(endDate)

  const details = itinerary?.summary
    ? encodeURIComponent(
        `${itinerary.summary}\n\nHighlights:\n${itinerary.highlights?.join('\n') || ''}\n\nPlanned via Voyagr — AI Travel Planner`
      )
    : encodeURIComponent(`Trip to ${destination} planned via Voyagr`)

  const location = encodeURIComponent(destination)

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`
}

export const formatDateRange = (start, end) => {
  if (!start) return ''
  const opts = { month: 'short', day: 'numeric', year: 'numeric' }
  const s = new Date(start).toLocaleDateString('en-US', opts)
  if (!end) return s
  const e = new Date(end).toLocaleDateString('en-US', opts)
  return `${s} — ${e}`
}

export const calculateDays = (start, end) => {
  if (!start || !end) return 0
  const diff = new Date(end) - new Date(start)
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)))
}
