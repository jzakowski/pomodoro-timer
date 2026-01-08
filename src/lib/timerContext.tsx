'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react'
import { useSettings } from './settingsContext'

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

export function TimerProvider({ children }: { children: ReactNode }) {
  const settings = useSettings()
  const [mode, setMode] = useState<SessionType>('work')
  const [timeRemaining, setTimeRemaining] = useState(settings.workDuration * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [currentSession, setCurrentSession] = useState(1)
  const [sessionsUntilLong] = useState(settings.sessionsUntilLong)

  // Calculate durations from settings
  const getDuration = (sessionType: SessionType): number => {
    switch (sessionType) {
      case 'work':
        return settings.workDuration * 60
      case 'shortBreak':
        return settings.shortBreakDuration * 60
      case 'longBreak':
        return settings.longBreakDuration * 60
    }
  }

  // Track session completion to avoid duplicate recordings
  const sessionCompletedRef = useRef(false)
  const currentModeRef = useRef(mode)

  // Update mode ref when mode changes
  useEffect(() => {
    currentModeRef.current = mode
  }, [mode])

  // Timer countdown effect
  useEffect(() => {
    if (!isRunning) {
      sessionCompletedRef.current = false
      return
    }

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

  // Update timer duration when mode or settings change
  useEffect(() => {
    if (!isRunning) {
      setTimeRemaining(getDuration(mode))
    }
  }, [mode, isRunning, settings.workDuration, settings.shortBreakDuration, settings.longBreakDuration])

  const startTimer = () => setIsRunning(true)
  const pauseTimer = () => setIsRunning(false)

  const resetTimer = () => {
    setIsRunning(false)
    setTimeRemaining(getDuration(mode))
  }

  const skipSession = () => {
    setIsRunning(false)
    const modes: SessionType[] = ['work', 'shortBreak', 'longBreak']

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

  // Auto-advance to next session when timer completes
  useEffect(() => {
    if (timeRemaining === 0 && !sessionCompletedRef.current) {
      sessionCompletedRef.current = true

      // Record session completion in localStorage for stats to pick up
      const sessionData = {
        type: mode,
        duration: getDuration(mode),
        timestamp: Date.now(),
      }

      // Store in localStorage for stats context to consume
      try {
        const pendingSessions = JSON.parse(localStorage.getItem('pomodoro_pending_sessions') || '[]')
        pendingSessions.push(sessionData)
        localStorage.setItem('pomodoro_pending_sessions', JSON.stringify(pendingSessions))

        // Trigger storage event for same-window updates
        window.dispatchEvent(new Event('local-storage'))
      } catch (error) {
        console.error('Error recording session:', error)
      }

      // Auto-advance after a short delay
      const timer = setTimeout(() => {
        skipSession()
      }, 1000)

      return () => clearTimeout(timer)
    }
    return undefined
  }, [timeRemaining, mode, currentSession, sessionsUntilLong])

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
