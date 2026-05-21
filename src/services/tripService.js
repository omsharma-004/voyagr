// src/services/tripService.js — Firestore trip management

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../config/firebase'

const TRIPS_COLLECTION = 'trips'

// Firestore document structure:
// trips/{autoId}/
//   userId: string
//   createdAt: Timestamp
//   tripData: { destination, dates, itinerary, weather, country, ... }

export const saveTrip = async (userId, tripData) => {
  try {
    console.log('[Voyagr] Saving trip for userId:', userId)

    // Deep-clean: remove undefined, convert Dates to ISO strings
    const clean = JSON.parse(JSON.stringify(tripData, (key, val) => {
      if (val === undefined) return null          // undefined → null (Firestore safe)
      if (val instanceof Date) return val.toISOString()
      return val
    }))

    const payload = {
      userId,
      createdAt: serverTimestamp(),
      tripData: clean,
    }

    console.log('[Voyagr] Saving payload — destination:', clean.destination)

    const docRef = await addDoc(collection(db, TRIPS_COLLECTION), payload)
    console.log('[Voyagr] ✓ Trip saved — docId:', docRef.id)
    return { id: docRef.id, error: null }
  } catch (error) {
    console.error('[Voyagr] ✗ Save trip error:', error.code, error.message)
    return { id: null, error: error.message }
  }
}

export const loadTrips = async (userId) => {
  try {
    console.log('[Voyagr] Loading trips for userId:', userId)

    // Simple where-only query — no orderBy = no composite index needed
    const q = query(
      collection(db, TRIPS_COLLECTION),
      where('userId', '==', userId)
    )

    const snapshot = await getDocs(q)
    console.log('[Voyagr] Fetched trip count:', snapshot.docs.length)

    const trips = snapshot.docs.map((d) => {
      const data = d.data()
      // Support both old structure (...spread) and new { userId, tripData }
      const tripData = data.tripData || data
      return {
        id: d.id,
        ...tripData,
        // Normalise timestamp — works for both savedAt and createdAt field names
        savedAt: (data.createdAt || data.savedAt)?.toDate?.() || new Date(),
      }
    })

    // Sort client-side by savedAt desc — no Firestore index required
    trips.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt))

    console.log('[Voyagr] Trips loaded:', trips.map(t => t.destination))
    return { trips, error: null }
  } catch (error) {
    console.error('[Voyagr] Load trips error:', error.code, error.message)
    return { trips: [], error: error.message }
  }
}

export const deleteTrip = async (tripId) => {
  try {
    console.log('[Voyagr] Deleting trip:', tripId)
    await deleteDoc(doc(db, TRIPS_COLLECTION, tripId))
    return { error: null }
  } catch (error) {
    console.error('[Voyagr] Delete trip error:', error.message)
    return { error: error.message }
  }
}
