'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type SessionType = 'work' | 'shortBreak' | 'longBreak'

interface TimerState {
  mode: SessionType
  timeRemaining: number
  isRunning: boolean
  currentSession: number
  sessionsUntilLong: number
  lastUpdated?: number
}

interface TimerContextType extends TimerState {
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  skipSession: () => void
}

const TimerContext = createContext<TimerContextType | undefined>(undefined)

const DEFAULT_DURATIONS = {
  work: 25 * 60, // 25 minutes in seconds
  shortBreak: 5 * 60, // 5 minutes
  longBreak: 15 * 60, // 15 minutes
}

const STORAGE_KEY = 'pomodoro_timer_state'

// Helper functions for localStorage (with SSR safety)
const loadState = (): TimerState | null => {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    return JSON.parse(stored)
  } catch {
    return null
  }
}

const saveState = (state: TimerState) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.error('Failed to save timer state:', error)
  }
}

export function TimerProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage or defaults
  const [mode, setMode] = useState<SessionType>(() => {
    const saved = loadState()
    return saved?.mode || 'work'
  })

  const [timeRemaining, setTimeRemaining] = useState(() => {
    const saved = loadState()
    if (saved?.isRunning && saved?.lastUpdated) {
      // Calculate elapsed time since last save
      const elapsed = Math.floor((Date.now() - saved.lastUpdated) / 1000)
      const remaining = saved.timeRemaining - elapsed
      return Math.max(0, remaining)
    }
    return saved?.timeRemaining ?? DEFAULT_DURATIONS.work
  })

  const [isRunning, setIsRunning] = useState(() => {
    const saved = loadState()
    return saved?.isRunning || false
  })

  const [currentSession, setCurrentSession] = useState(() => {
    const saved = loadState()
    return saved?.currentSession || 1
  })

  const [sessionsUntilLong] = useState(4)

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const state: TimerState = {
      mode,
      timeRemaining,
      isRunning,
      currentSession,
      sessionsUntilLong,
      lastUpdated: Date.now(),
    }
    saveState(state)
  }, [mode, timeRemaining, isRunning, currentSession, sessionsUntilLong])

  // Timer countdown effect
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning])

  // Update timer duration when mode changes
  useEffect(() => {
    if (!isRunning) {
      setTimeRemaining(DEFAULT_DURATIONS[mode])
    }
  }, [mode, isRunning])

  const startTimer = () => setIsRunning(true)
  const pauseTimer = () => setIsRunning(false)

  const resetTimer = () => {
    setIsRunning(false)
    setTimeRemaining(DEFAULT_DURATIONS[mode])
  }

  const skipSession = () => {
    setIsRunning(false)
    const modes: SessionType[] = ['work', 'shortBreak', 'longBreak']
    const currentIndex = modes.indexOf(mode)

    if (mode === 'work' && currentSession >= sessionsUntilLong) {
      setMode('longBreak')
      setCurrentSession(1)
    } else if (mode === 'work') {
      setMode('shortBreak')
    } else {
      setMode('work')
      setCurrentSession((prev) => prev + 1)
    }
  }

  const value: TimerContextType = {
    mode,
    timeRemaining,
    isRunning,
    currentSession,
    sessionsUntilLong,
    startTimer,
    pauseTimer,
    resetTimer,
    skipSession,
  }

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
}

export function useTimer() {
  const context = useContext(TimerContext)
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider')
  }
  return context
}
