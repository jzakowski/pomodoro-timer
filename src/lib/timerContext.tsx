'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type SessionType = 'work' | 'shortBreak' | 'longBreak'

interface TimerState {
  mode: SessionType
  timeRemaining: number
  isRunning: boolean
  currentSession: number
  sessionsUntilLong: number
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

// Helper function to safely access localStorage
const getStorage = () => {
  if (typeof window === 'undefined') return null
  try {
    return localStorage
  } catch (e) {
    console.warn('localStorage not available:', e)
    return null
  }
}

export function TimerProvider({ children }: { children: ReactNode }) {
  // Load saved state once and use it for all initializations
  const getInitialState = () => {
    const storage = getStorage()
    if (!storage) {
      return {
        mode: 'work' as SessionType,
        timeRemaining: DEFAULT_DURATIONS.work,
        isRunning: false,
        currentSession: 1,
      }
    }

    try {
      const saved = storage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)

        // Validate and return saved state
        return {
          mode: (parsed.mode && ['work', 'shortBreak', 'longBreak'].includes(parsed.mode))
            ? parsed.mode as SessionType
            : 'work',
          timeRemaining: (typeof parsed.timeRemaining === 'number' && parsed.timeRemaining > 0)
            ? Math.min(parsed.timeRemaining, DEFAULT_DURATIONS[parsed.mode] || DEFAULT_DURATIONS.work)
            : DEFAULT_DURATIONS.work,
          isRunning: false, // Always start paused for better UX
          currentSession: (typeof parsed.currentSession === 'number' && parsed.currentSession > 0)
            ? parsed.currentSession
            : 1,
        }
      }
    } catch (e) {
      console.warn('Failed to load saved timer state:', e)
    }

    return {
      mode: 'work' as SessionType,
      timeRemaining: DEFAULT_DURATIONS.work,
      isRunning: false,
      currentSession: 1,
    }
  }

  const initialState = getInitialState()

  const [mode, setMode] = useState<SessionType>(initialState.mode)
  const [timeRemaining, setTimeRemaining] = useState(initialState.timeRemaining)
  const [isRunning, setIsRunning] = useState(initialState.isRunning)
  const [currentSession, setCurrentSession] = useState(initialState.currentSession)
  const [sessionsUntilLong] = useState(4)

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

  // Update timer duration when mode changes (but not on initial load)
  const prevModeRef = React.useRef<SessionType>(mode)

  useEffect(() => {
    // Skip on first render or if mode hasn't changed
    if (prevModeRef.current === mode) {
      return
    }

    // Only reset time when mode changes AND timer is not running
    if (!isRunning) {
      setTimeRemaining(DEFAULT_DURATIONS[mode])
    }

    prevModeRef.current = mode
  }, [mode, isRunning])

  // Save timer state to localStorage whenever it changes
  const isFirstRender = React.useRef(true)

  useEffect(() => {
    // Skip saving on first render (don't overwrite valid localStorage with defaults)
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const storage = getStorage()
    if (!storage) return

    try {
      const stateToSave = {
        mode,
        timeRemaining,
        isRunning,
        currentSession,
        sessionsUntilLong,
      }
      storage.setItem(STORAGE_KEY, JSON.stringify(stateToSave))
    } catch (e) {
      console.warn('Failed to save timer state:', e)
    }
  }, [mode, timeRemaining, isRunning, currentSession, sessionsUntilLong])

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
