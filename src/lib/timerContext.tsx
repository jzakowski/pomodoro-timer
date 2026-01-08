'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react'
import { useStats } from './statsContext'

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
  const { addSession } = useStats()
  const [mode, setMode] = useState<SessionType>('work')
  const [timeRemaining, setTimeRemaining] = useState(DEFAULT_DURATIONS.work)
  const [isRunning, setIsRunning] = useState(false)
  const [currentSession, setCurrentSession] = useState(1)
  const [sessionsUntilLong] = useState(4)

  // Track initial time for session recording
  const initialTimeRef = useRef<number>(DEFAULT_DURATIONS.work)

  // Timer countdown effect
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Timer completed - record the session
          const duration = initialTimeRef.current - prev
          addSession(mode, duration)

          setIsRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, mode, addSession])

  // Update timer duration when mode changes
  useEffect(() => {
    if (!isRunning) {
      const newDuration = DEFAULT_DURATIONS[mode]
      setTimeRemaining(newDuration)
      initialTimeRef.current = newDuration
    }
  }, [mode, isRunning])

  const startTimer = () => {
    if (!isRunning) {
      initialTimeRef.current = timeRemaining
    }
    setIsRunning(true)
  }

  const pauseTimer = () => setIsRunning(false)

  const resetTimer = () => {
    setIsRunning(false)
    const duration = DEFAULT_DURATIONS[mode]
    setTimeRemaining(duration)
    initialTimeRef.current = duration
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
