// src/components/layout/Navbar.jsx

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth.jsx'
import { signInWithGoogle, signOutUser } from '../../services/authService'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const scrollToSection = (id) => {
    setMobileOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    else navigate('/')
  }

  const handleSignIn = async () => {
    await signInWithGoogle()
  }

  const handleSignOut = async () => {
    setDropdownOpen(false)
    await signOutUser()
    navigate('/')
  }

  const initial = user?.displayName?.[0]?.toUpperCase() || '?'

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : styles.transparent}`}>
        <div className={styles.inner}>
          {/* Logo */}
          <div className={styles.logo} onClick={() => navigate('/')}>
            <div className={styles.logoMark}>V</div>
            <span className={styles.logoText}>Voyagr</span>
          </div>

          {/* Center links */}
          <div className={styles.navLinks}>
            <button className={styles.navLink} onClick={() => scrollToSection('discover')}>
              Discover
            </button>
            <button className={styles.navLink} onClick={() => scrollToSection('how-it-works')}>
              How It Works
            </button>
            <button className={styles.navLink} onClick={() => scrollToSection('search')}>
              Plan A Trip
            </button>
          </div>

          {/* Right */}
          <div className={styles.navActions}>
            {user ? (
              <div className={styles.userMenu} ref={dropdownRef}>
                <button
                  className={styles.avatarBtn}
                  onClick={() => setDropdownOpen((p) => !p)}
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName} />
                  ) : (
                    <div className={styles.avatarFallback}>{initial}</div>
                  )}
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      className={styles.dropdown}
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.18 }}
                    >
                      <div className={styles.dropdownHeader}>
                        <div className={styles.dropdownName}>{user.displayName}</div>
                        <div className={styles.dropdownEmail}>{user.email}</div>
                      </div>
                      <button
                        className={styles.dropdownItem}
                        onClick={() => { setDropdownOpen(false); navigate('/saved') }}
                      >
                        <span>🗺</span> Saved Trips
                      </button>
                      <div className={styles.dropdownDivider} />
                      <button
                        className={`${styles.dropdownItem} ${styles.danger}`}
                        onClick={handleSignOut}
                      >
                        <span>↩</span> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button className={styles.signInBtn} onClick={handleSignIn}>
                <svg className={styles.googleIcon} viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign In
              </button>
            )}

            {/* Mobile toggle */}
            <button
              className={styles.mobileToggle}
              onClick={() => setMobileOpen((p) => !p)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={styles.mobileNav}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <button className={styles.mobileNavLink} onClick={() => scrollToSection('discover')}>Discover</button>
            <button className={styles.mobileNavLink} onClick={() => scrollToSection('how-it-works')}>How It Works</button>
            <button className={styles.mobileNavLink} onClick={() => scrollToSection('search')}>Plan A Trip</button>
            {!user && (
              <button className={styles.signInBtn} onClick={handleSignIn}>Sign In with Google</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
