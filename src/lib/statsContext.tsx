'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface SessionRecord {
  timestamp: number
  type: 'work' | 'shortBreak' | 'longBreak'
  duration: number
  completed: boolean
}

interface StatsState {
  totalSessions: number
  totalMinutes: number
  currentStreak: number
  bestStreak: number
  sessionsByDate: { [date: string]: number }
  sessionHistory: SessionRecord[]
}

interface StatsContextType extends StatsState {
  recordSession: (type: 'work' | 'shortBreak' | 'longBreak', duration: number) => void
  resetStats: () => void
  exportStats: () => string
}

const StatsContext = createContext<StatsContextType | undefined>(undefined)

const STORAGE_KEY = 'pomodoro_stats'

// Helper to get today's date string
const getTodayDateString = (): string => {
  const dateStr = new Date().toISOString().split('T')[0]
  return dateStr || ''
}

// Calculate streak from sessions by date
const calculateStreak = (sessionsByDate: { [date: string]: number }): number => {
  const dates = Object.keys(sessionsByDate).sort().reverse()
  let streak = 0
  let currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)

  for (const dateStr of dates) {
    const checkDate = new Date(dateStr)
    checkDate.setHours(0, 0, 0, 0)

    const diffTime = currentDate.getTime() - checkDate.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === streak) {
      streak++
      currentDate = new Date(checkDate)
      currentDate.setDate(currentDate.getDate() - 1)
    } else if (diffDays > streak) {
      break
    }
  }

  return streak
}

const loadStatsFromStorage = (): StatsState => {
  if (typeof window === 'undefined') {
    return {
      totalSessions: 0,
      totalMinutes: 0,
      currentStreak: 0,
      bestStreak: 0,
      sessionsByDate: {},
      sessionHistory: [],
    }
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error loading stats from storage:', error)
  }

  return {
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0,
    bestStreak: 0,
    sessionsByDate: {},
    sessionHistory: [],
  }
}

const saveStatsToStorage = (stats: StatsState) => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
  } catch (error) {
    console.error('Error saving stats to storage:', error)
  }
}

export function StatsProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<StatsState>(loadStatsFromStorage)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load stats on mount
  useEffect(() => {
    setStats(loadStatsFromStorage())
    setIsLoaded(true)

    // Process any pending sessions from localStorage
    const processPendingSessions = () => {
      try {
        const pendingSessions = JSON.parse(localStorage.getItem('pomodoro_pending_sessions') || '[]')
        if (pendingSessions.length > 0) {
          pendingSessions.forEach((session: any) => {
            recordSession(session.type, session.duration)
          })
          // Clear processed sessions
          localStorage.removeItem('pomodoro_pending_sessions')
        }
      } catch (error) {
        console.error('Error processing pending sessions:', error)
      }
    }

    processPendingSessions()
  }, [])

  // Listen for storage events to auto-update stats
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const pendingSessions = JSON.parse(localStorage.getItem('pomodoro_pending_sessions') || '[]')
        if (pendingSessions.length > 0) {
          pendingSessions.forEach((session: any) => {
            setStats((prev) => {
              const today = getTodayDateString()
              const timestamp = session.timestamp || Date.now()

              const newSessionsByDate = { ...prev.sessionsByDate }
              newSessionsByDate[today] = (newSessionsByDate[today] || 0) + 1

              const newSessionHistory = [
                ...prev.sessionHistory,
                { timestamp, type: session.type, duration: session.duration, completed: true },
              ]

              const newStreak = calculateStreak(newSessionsByDate)
              const newBestStreak = Math.max(prev.bestStreak, newStreak)

              return {
                totalSessions: prev.totalSessions + 1,
                totalMinutes: prev.totalMinutes + Math.floor(session.duration / 60),
                currentStreak: newStreak,
                bestStreak: newBestStreak,
                sessionsByDate: newSessionsByDate,
                sessionHistory: newSessionHistory,
              }
            })
          })
          // Clear processed sessions
          localStorage.removeItem('pomodoro_pending_sessions')
        }
      } catch (error) {
        console.error('Error processing pending sessions:', error)
      }
    }

    window.addEventListener('local-storage', handleStorageChange)
    return () => window.removeEventListener('local-storage', handleStorageChange)
  }, [])

  // Save stats whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveStatsToStorage(stats)
    }
  }, [stats, isLoaded])

  const recordSession = (type: 'work' | 'shortBreak' | 'longBreak', duration: number) => {
    const today = getTodayDateString()
    const timestamp = Date.now()

    setStats((prev) => {
      const newSessionsByDate = { ...prev.sessionsByDate }
      newSessionsByDate[today] = (newSessionsByDate[today] || 0) + 1

      const newSessionHistory = [
        ...prev.sessionHistory,
        { timestamp, type, duration, completed: true },
      ]

      const newStreak = calculateStreak(newSessionsByDate)
      const newBestStreak = Math.max(prev.bestStreak, newStreak)

      return {
        totalSessions: prev.totalSessions + 1,
        totalMinutes: prev.totalMinutes + Math.floor(duration / 60),
        currentStreak: newStreak,
        bestStreak: newBestStreak,
        sessionsByDate: newSessionsByDate,
        sessionHistory: newSessionHistory,
      }
    })
  }

  const resetStats = () => {
    const emptyStats: StatsState = {
      totalSessions: 0,
      totalMinutes: 0,
      currentStreak: 0,
      bestStreak: 0,
      sessionsByDate: {},
      sessionHistory: [],
    }
    setStats(emptyStats)
  }

  const exportStats = (): string => {
    const headers = ['Timestamp', 'Type', 'Duration (seconds)', 'Completed']
    const rows = stats.sessionHistory.map((session) => [
      new Date(session.timestamp).toISOString(),
      session.type,
      session.duration.toString(),
      session.completed.toString(),
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n')

    return csvContent
  }

  const value: StatsContextType = {
    ...stats,
    recordSession,
    resetStats,
    exportStats,
  }

  return <StatsContext.Provider value={value}>{children}</StatsContext.Provider>
}

export function useStats() {
  const context = useContext(StatsContext)
  if (context === undefined) {
    throw new Error('useStats must be used within a StatsProvider')
  }
  return context
}
