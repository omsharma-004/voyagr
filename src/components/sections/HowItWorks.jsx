// src/components/sections/HowItWorks.jsx

import { motion } from 'framer-motion'
import styles from './HowItWorks.module.css'

const STEPS = [
  {
    num: '01',
    icon: '🗺',
    title: 'Enter your destination',
    desc: 'Search any city in the world with smart autocomplete. We support thousands of destinations globally.',
  },
  {
    num: '02',
    icon: '📅',
    title: 'Pick dates & travel style',
    desc: 'Set your travel window, choose your budget level, and select your interests to personalise the experience.',
  },
  {
    num: '03',
    icon: '🌤',
    title: 'Live weather + destination data',
    desc: 'We fetch real-time weather, country info, currency rates, and local insights — all injected into your plan.',
  },
  {
    num: '04',
    icon: '✨',
    title: 'AI generates your itinerary',
    desc: 'Llama 3 crafts a day-by-day plan with morning, afternoon, and evening activities tailored exactly to you.',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function HowItWorks() {
  const scrollToSearch = () => {
    document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className={styles.section} id="how-it-works">
      <div className={styles.inner}>
        {/* Left */}
        <motion.div
          className={styles.leftCol}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className={styles.eyebrow}>How It Works</div>
          <h2 className={styles.heading}>
            Planning your trip<br />
            just got{' '}
            <em>smarter</em>
          </h2>
          <p className={styles.desc}>
            Voyagr combines real-time data with AI reasoning to give you a
            travel plan that's genuinely tailored to you — not a generic
            template.
          </p>
          <button className={styles.cta} onClick={scrollToSearch}>
            Plan your trip
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>

        {/* Right: Steps */}
        <motion.div
          className={styles.steps}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {STEPS.map((step) => (
            <motion.div key={step.num} className={styles.step} variants={itemVariants}>
              <div className={styles.stepLeft}>
                <span className={styles.stepNum}>{step.num}</span>
                <div className={styles.stepLine} />
              </div>
              <div className={styles.stepContent}>
                <div className={styles.stepIcon}>{step.icon}</div>
                <div className={styles.stepTitle}>{step.title}</div>
                <div className={styles.stepDesc}>{step.desc}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
