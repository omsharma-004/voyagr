// src/services/authService.js — Firebase Auth

import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth, googleProvider } from '../config/firebase'

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    return { user: result.user, error: null }
  } catch (error) {
    console.error('Google sign in error:', error)
    return { user: null, error: error.message }
  }
}

export const signOutUser = async () => {
  try {
    await signOut(auth)
    return { error: null }
  } catch (error) {
    console.error('Sign out error:', error)
    return { error: error.message }
  }
}

export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback)
}

export const getCurrentUser = () => auth.currentUser
