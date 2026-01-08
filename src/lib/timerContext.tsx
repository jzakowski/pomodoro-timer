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

export function TimerProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<SessionType>('work')
  const [timeRemaining, setTimeRemaining] = useState(DEFAULT_DURATIONS.work)
  const [isRunning, setIsRunning] = useState(false)
  const [currentSession, setCurrentSession] = useState(1)
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
