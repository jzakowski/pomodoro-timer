'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface SettingsState {
  workDuration: number // in minutes
  shortBreakDuration: number // in minutes
  longBreakDuration: number // in minutes
  sessionsUntilLong: number
  autoStart: boolean
  soundEnabled: boolean
  theme: Theme
}

interface SettingsContextType extends SettingsState {
  setWorkDuration: (duration: number) => void
  setShortBreakDuration: (duration: number) => void
  setLongBreakDuration: (duration: number) => void
  setSessionsUntilLong: (count: number) => void
  setAutoStart: (enabled: boolean) => void
  setSoundEnabled: (enabled: boolean) => void
  setTheme: (theme: Theme) => void
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
  theme: 'system',
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

  // Apply theme changes to document
  useEffect(() => {
    if (typeof window === 'undefined' || !isLoaded) return

    const root = document.documentElement
    const applyTheme = (theme: Theme) => {
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        root.classList.toggle('dark', systemTheme === 'dark')
      } else {
        root.classList.toggle('dark', theme === 'dark')
      }
    }

    applyTheme(settings.theme)

    // Listen for system theme changes if using system theme
    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = () => applyTheme('system')
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    }
  }, [settings.theme, isLoaded])

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

  const setTheme = (theme: Theme) => {
    setSettings((prev) => ({ ...prev, theme }))
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
    setTheme,
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
