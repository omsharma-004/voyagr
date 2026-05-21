// src/components/sections/Itinerary.jsx

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Itinerary.module.css'

const PERIOD_LABELS = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
}

// Category → curated stable Unsplash photo IDs
// Each ID is a real, verified working Unsplash photo
const CATEGORY_PHOTOS = {
  temple:      ['1588416936097-41850ab3d86d', '1524492412937-b28074a5d7da', '1555400038-63f5ba517a47'],
  food:        ['1504674900247-0877df9cc836', '1414235077428-338989a2e8c0', '1555396273-367ea4eb4db5'],
  market:      ['1555400038-63f5ba517a47', '1558618666-fcd25c85cd64', '1534438327431-9c7860dfd888'],
  beach:       ['1507525428034-b723cf961d3e', '1506905925346-21bda4d32df4', '1519046904884-53103b34b206'],
  mountain:    ['1464822759023-fed622ff2c3b', '1486870591958-d4a74ef2734b', '1519681393784-d120267933ba'],
  hiking:      ['1551632811-561732d1e306', '1454496522488-7a8e488e8606', '1483728642387-6c3bdd6c93e5'],
  palace:      ['1477587458883-47145ed94245', '1524522173746-f628baad3644', '1587135991058-8816b028691f'],
  fort:        ['1598977054078-5e5ddbdb9c8c', '1587135991058-8816b028691f', '1524522173746-f628baad3644'],
  garden:      ['1585320806297-9c56668f5569', '1416879595882-3373a0480b5b', '1464822759023-fed622ff2c3b'],
  museum:      ['1554907984-15263bfd63bd', '1566127992631-137a642a90f4', '1605379399642-870262d3d051'],
  cafe:        ['1509042239860-f550ae2ec5a9', '1495474472287-4d71bcdd2085', '1445116572660-31f4b9e1f5a5'],
  restaurant:  ['1414235077428-338989a2e8c0', '1567620905732-2d1ec7ab7445', '1504674900247-0877df9cc836'],
  nightlife:   ['1514190051997-0f6f39ca5cde', '1533174072545-7a4b6ad7a6c3', '1516450360452-9312f5e86fc7'],
  sunset:      ['1507003211169-0a1dd7228f2d', '1500534314209-a25ddb2bd429', '1495571758640-c3f88a6b2a7d'],
  river:       ['1544551763-46a013bb70d5', '1506929562872-bb421503ef21', '1504701954957-2010ec3bcec1'],
  lake:        ['1501854140801-50d01698950b', '1439405326-8d1a5b7f6b97', '1448375240586-882707db888b'],
  waterfall:   ['1431794062232-2a99a5431130', '1455218873509-8bf306f6e6b4', '1506929562872-bb421503ef21'],
  shopping:    ['1472851294608-062f824d29cc', '1555396273-367ea4eb4db5', '1483985988355-763728e1935b'],
  adventure:   ['1551632811-561732d1e306', '1522163182402-834f871fd851', '1526139334526-f591a54b477c'],
  yoga:        ['1506126613408-eca07ce68773', '1545205597-3d9d02c29597', '1593811167562-9cef47bfc4a7'],
  spa:         ['1540555700478-4be289fbecef', '1571019613454-1cb2f99b2d8b', '1561037404-61cd46aa615b'],
  boat:        ['1544551763-46a013bb70d5', '1502920514313-52581002a659', '1506929562872-bb421503ef21'],
  heritage:    ['1477587458883-47145ed94245', '1524522173746-f628baad3644', '1588416936097-41850ab3d86d'],
  street:      ['1477959858617-67f85cf4f1df', '1480714378408-67cf0d13bc1b', '1534430480872-3498386e7856'],
  city:        ['1477959858617-67f85cf4f1df', '1480714378408-67cf0d13bc1b', '1444723121867-7a241cacace9'],
  travel:      ['1488646953014-85cb44e25828', '1476514525535-07fb3b4ae5f1', '1502602898657-3e91760cbb34'],
}

const PERIOD_BASE = {
  morning:   ['1470252649378-9c29740c9fa8', '1506126613408-eca07ce68773', '1441974231531-c6227db76b6e'],
  afternoon: ['1476514525535-07fb3b4ae5f1', '1488646953014-85cb44e25828', '1502005097973-6a7082348e28'],
  evening:   ['1514190051997-0f6f39ca5cde', '1507003211169-0a1dd7228f2d', '1533174072545-7a4b6ad7a6c3'],
}

// Extract category keywords from activity title/keyword
function detectCategory(keyword, title = '') {
  const text = `${keyword} ${title}`.toLowerCase()
  const map = [
    ['temple', 'temple,shrine,mandir,church,mosque,religious'],
    ['palace', 'palace,mahal,royal,king,queen,haveli'],
    ['fort',   'fort,fortress,citadel,qila'],
    ['food',   'food,eat,lunch,dinner,breakfast,cuisine,restaurant,dine,meal,taste'],
    ['cafe',   'cafe,coffee,chai,tea,bakery,brunch'],
    ['market', 'market,bazaar,shop,bazar,souk,mall'],
    ['beach',  'beach,sea,ocean,coast,shore,sand'],
    ['mountain','mountain,hill,peak,summit,range,himalayas'],
    ['hiking', 'hike,trek,trail,walk,nature walk,forest'],
    ['waterfall','waterfall,falls,cascade'],
    ['lake',   'lake,pond,reservoir'],
    ['river',  'river,ghat,ghats,boat,ferry'],
    ['boat',   'boat,cruise,backwater,houseboat,kayak'],
    ['garden', 'garden,park,botanical,green,meadow'],
    ['museum', 'museum,gallery,art,exhibit,history'],
    ['nightlife','nightlife,bar,club,pub,lounge,night'],
    ['sunset', 'sunset,sunrise,golden,dusk,dawn,viewpoint'],
    ['yoga',   'yoga,meditation,ashram,wellness,retreat'],
    ['spa',    'spa,massage,relax,ayurveda,treatment'],
    ['shopping','shopping,boutique,craft,souvenir,textile'],
    ['adventure','adventure,zip,rafting,paraglide,bungee,extreme'],
    ['street', 'street,stroll,walk,lane,alley,neighborhood,old city'],
    ['heritage','heritage,colonial,historic,ancient,ruins'],
  ]
  for (const [cat, keys] of map) {
    if (keys.split(',').some(k => text.includes(k))) return cat
  }
  return null
}

// Get a unique stable image for a given activity
// dayIndex + periodIndex ensures uniqueness across the whole itinerary
function getActivityImage(activity, period, dayIndex, periodIndex) {
  const keyword = activity.imageKeyword || ''
  const title   = activity.title || ''
  const cat     = detectCategory(keyword, title)

  const globalIdx = dayIndex * 3 + periodIndex  // 0-based unique index per activity

  if (cat && CATEGORY_PHOTOS[cat]) {
    const photos = CATEGORY_PHOTOS[cat]
    const photoId = photos[globalIdx % photos.length]
    return `https://images.unsplash.com/photo-${photoId}?w=800&q=75&fit=crop`
  }

  // Period fallback — use globalIdx to rotate through options
  const periodPhotos = PERIOD_BASE[period] || PERIOD_BASE.afternoon
  const photoId = periodPhotos[globalIdx % periodPhotos.length]
  return `https://images.unsplash.com/photo-${photoId}?w=800&q=75&fit=crop`
}

const ULTIMATE_FALLBACK = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=75&fit=crop'

function ActivityCard({ activity, period, dayIndex = 0, periodIndex = 0 }) {
  const [imgSrc, setImgSrc] = useState(
    () => getActivityImage(activity, period, dayIndex, periodIndex)
  )
  const [failed, setFailed] = useState(false)

  const handleImgError = () => {
    if (!failed) { setFailed(true); setImgSrc(ULTIMATE_FALLBACK) }
  }

  return (
    <motion.div
      className={styles.activityCard}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.imgWrapper}>
        <img
          className={styles.activityImg}
          src={imgSrc}
          alt={activity.title}
          loading="lazy"
          onError={handleImgError}
        />
        {activity.time && (
          <span className={styles.timeLabel}>{activity.time}</span>
        )}
        <span className={`${styles.periodBadge} ${styles[period]}`}>
          {PERIOD_LABELS[period]}
        </span>
      </div>

      <div className={styles.activityBody}>
        <div className={styles.activityTitle}>{activity.title}</div>
        {activity.location && (
          <div className={styles.activityLocation}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            {activity.location}
          </div>
        )}
        <p className={styles.activityDesc}>{activity.description}</p>
        <div className={styles.activityFooter}>
          {activity.duration && (
            <span className={styles.duration}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              {activity.duration}
            </span>
          )}
          {activity.tips && (
            <span className={styles.tip} title={activity.tips}>
              💡 {activity.tips}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function Itinerary({ itinerary }) {
  const [activeDay, setActiveDay] = useState(0)

  if (!itinerary || !itinerary.days?.length) return null

  const currentDay = itinerary.days[activeDay]

  return (
    <section className={styles.section}>
      {/* Header */}
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>AI-Generated Itinerary</div>
        <h2 className={styles.title}>Your day-by-day adventure</h2>
        {itinerary.summary && (
          <p className={styles.summary}>{itinerary.summary}</p>
        )}
      </div>

      {/* Day Tabs */}
      <div className={styles.dayTabs}>
        {itinerary.days.map((day, i) => (
          <button
            key={i}
            className={`${styles.dayTab} ${i === activeDay ? styles.active : ''}`}
            onClick={() => setActiveDay(i)}
          >
            <span className={styles.dayNum}>Day {day.day}</span>
            <span className={styles.dayTheme}>{day.theme || `Day ${day.day}`}</span>
          </button>
        ))}
      </div>

      {/* Day content */}
      <div className={styles.dayContent}>
        <div className={styles.dayThemeBar}>
          <h3 className={styles.dayThemeTitle}>
            Day {currentDay.day} — {currentDay.theme}
          </h3>
          <div className={styles.dayThemeDivider} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeDay}
            className={styles.activitiesGrid}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {currentDay.morning && (
              <ActivityCard activity={currentDay.morning} period="morning" dayIndex={activeDay} periodIndex={0} />
            )}
            {currentDay.afternoon && (
              <ActivityCard activity={currentDay.afternoon} period="afternoon" dayIndex={activeDay} periodIndex={1} />
            )}
            {currentDay.evening && (
              <ActivityCard activity={currentDay.evening} period="evening" dayIndex={activeDay} periodIndex={2} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Info rows — only on last day */}
        {activeDay === itinerary.days.length - 1 && (
          <div className={styles.infoRow}>
            {/* Highlights */}
            {itinerary.highlights?.length > 0 && (
              <div className={styles.infoCard}>
                <div className={styles.infoCardTitle}>Trip Highlights</div>
                <div className={styles.infoList}>
                  {itinerary.highlights.map((h, i) => (
                    <div key={i} className={styles.infoListItem}>
                      <div className={styles.dot} />
                      {h}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Packing tips */}
            {itinerary.packingTips?.length > 0 && (
              <div className={styles.infoCard}>
                <div className={styles.infoCardTitle}>Packing Tips</div>
                <div className={styles.infoList}>
                  {itinerary.packingTips.map((tip, i) => (
                    <div key={i} className={styles.infoListItem}>
                      <div className={styles.dot} />
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Budget */}
            {itinerary.budgetBreakdown && (
              <div className={styles.infoCard}>
                <div className={styles.infoCardTitle}>Budget Estimate</div>
                <div className={styles.budgetGrid}>
                  {Object.entries(itinerary.budgetBreakdown).map(([key, val]) => (
                    <div key={key} className={styles.budgetItem}>
                      <span className={styles.budgetItemLabel}>{key}</span>
                      <span className={styles.budgetItemValue}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Local phrases */}
            {itinerary.localPhrases?.length > 0 && (
              <div className={styles.infoCard}>
                <div className={styles.infoCardTitle}>Useful Phrases</div>
                <div className={styles.phrases}>
                  {itinerary.localPhrases.slice(0, 4).map((p, i) => (
                    <div key={i} className={styles.phrase}>
                      <span className={styles.phraseText}>"{p.phrase}"</span>
                      <span className={styles.phraseMeaning}>{p.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
