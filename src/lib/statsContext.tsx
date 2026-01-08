'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface SessionRecord {
  timestamp: number
  type: 'work' | 'shortBreak' | 'longBreak'
  duration: number
  date: string
}

interface StatsState {
  sessions: SessionRecord[]
  todaySessions: number
  todayFocusTime: number
  totalSessions: number
  currentStreak: number
}

interface StatsContextType extends StatsState {
  addSession: (type: 'work' | 'shortBreak' | 'longBreak', duration: number) => void
  resetStats: () => void
}

const StatsContext = createContext<StatsContextType | undefined>(undefined)

// Helper function to get today's date string
const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0]
}

// Helper function to calculate streak
const calculateStreak = (sessions: SessionRecord[]): number => {
  if (sessions.length === 0) return 0

  const dates = [...new Set(sessions.map(s => s.date))].sort().reverse()
  const today = getTodayString()
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  let streak = 0
  let checkDate = today

  for (const date of dates) {
    if (date === checkDate) {
      streak++
      // Move to previous day
      const prevDate = new Date(checkDate)
      prevDate.setDate(prevDate.getDate() - 1)
      checkDate = prevDate.toISOString().split('T')[0]
    } else if (date === yesterday && streak === 0) {
      // Start counting from yesterday if no sessions today
      streak++
      const prevDate = new Date(yesterday)
      prevDate.setDate(prevDate.getDate() - 1)
      checkDate = prevDate.toISOString().split('T')[0]
    } else {
      break
    }
  }

  return streak
}

export function StatsProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<SessionRecord[]>([])

  // Load sessions from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('pomodoro_sessions')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setSessions(parsed)
      } catch (e) {
        console.error('Failed to parse stored sessions:', e)
      }
    }
  }, [])

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (sessions.length > 0 || localStorage.getItem('pomodoro_sessions')) {
      localStorage.setItem('pomodoro_sessions', JSON.stringify(sessions))
    }
  }, [sessions])

  // Calculate today's stats
  const today = getTodayString()
  const todaySessions = sessions.filter(s => s.date === today && s.type === 'work').length
  const todayFocusTime = sessions
    .filter(s => s.date === today && s.type === 'work')
    .reduce((sum, s) => sum + s.duration, 0)

  const totalSessions = sessions.filter(s => s.type === 'work').length
  const currentStreak = calculateStreak(sessions)

  const addSession = (type: 'work' | 'shortBreak' | 'longBreak', duration: number) => {
    const newSession: SessionRecord = {
      timestamp: Date.now(),
      type,
      duration,
      date: getTodayString(),
    }
    setSessions(prev => [...prev, newSession])
  }

  const resetStats = () => {
    setSessions([])
    localStorage.removeItem('pomodoro_sessions')
  }

  const value: StatsContextType = {
    sessions,
    todaySessions,
    todayFocusTime,
    totalSessions,
    currentStreak,
    addSession,
    resetStats,
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
