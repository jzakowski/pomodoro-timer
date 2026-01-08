'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface SettingsState {
  workDuration: number // in minutes
  shortBreakDuration: number // in minutes
  longBreakDuration: number // in minutes
  sessionsUntilLong: number
  autoStart: boolean
  soundEnabled: boolean
}

interface SettingsContextType extends SettingsState {
  setWorkDuration: (duration: number) => void
  setShortBreakDuration: (duration: number) => void
  setLongBreakDuration: (duration: number) => void
  setSessionsUntilLong: (count: number) => void
  setAutoStart: (enabled: boolean) => void
  setSoundEnabled: (enabled: boolean) => void
  resetSettings: () => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

const SETTINGS_STORAGE_KEY = 'pomodoro_settings'

const DEFAULT_SETTINGS: SettingsState = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLong: 4,
  autoStart: false,
  soundEnabled: true,
}

const loadSettingsFromStorage = (): SettingsState => {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS
  }

  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return { ...DEFAULT_SETTINGS, ...parsed }
    }
  } catch (error) {
    console.error('Error loading settings from storage:', error)
  }

  return DEFAULT_SETTINGS
}

const saveSettingsToStorage = (settings: SettingsState) => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
  } catch (error) {
    console.error('Error saving settings to storage:', error)
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load settings on mount
  useEffect(() => {
    const loaded = loadSettingsFromStorage()
    setSettings(loaded)
    setIsLoaded(true)
  }, [])

  // Save settings whenever they change (after initial load)
  useEffect(() => {
    if (isLoaded) {
      saveSettingsToStorage(settings)
    }
  }, [settings, isLoaded])

  const setWorkDuration = (duration: number) => {
    setSettings((prev) => ({ ...prev, workDuration: duration }))
  }

  const setShortBreakDuration = (duration: number) => {
    setSettings((prev) => ({ ...prev, shortBreakDuration: duration }))
  }

  const setLongBreakDuration = (duration: number) => {
    setSettings((prev) => ({ ...prev, longBreakDuration: duration }))
  }

  const setSessionsUntilLong = (count: number) => {
    setSettings((prev) => ({ ...prev, sessionsUntilLong: count }))
  }

  const setAutoStart = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, autoStart: enabled }))
  }

  const setSoundEnabled = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, soundEnabled: enabled }))
  }

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS)
  }

  const value: SettingsContextType = {
    ...settings,
    setWorkDuration,
    setShortBreakDuration,
    setLongBreakDuration,
    setSessionsUntilLong,
    setAutoStart,
    setSoundEnabled,
    resetSettings,
  }

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
