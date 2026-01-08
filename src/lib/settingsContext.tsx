'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type TimerMode = 'work' | 'shortBreak' | 'longBreak'
export type Theme = 'light' | 'dark' | 'system'
export type AccentColor = 'red' | 'blue' | 'green' | 'purple' | 'orange'
export type NotificationSound = 'chime' | 'bell' | 'gong'

export interface Settings {
  // Timer durations (in minutes)
  workDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  sessionsUntilLongBreak: number

  // Auto-start options
  autoStartBreaks: boolean
  autoStartWork: boolean

  // Notifications
  soundEnabled: boolean
  browserNotificationsEnabled: boolean
  notificationVolume: number
  notificationSound: NotificationSound

  // Appearance
  theme: Theme
  accentColor: AccentColor

  // Timer title
  timerTitle: string
}

interface SettingsContextType extends Settings {
  updateSettings: (updates: Partial<Settings>) => void
  resetSettings: () => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

const DEFAULT_SETTINGS: Settings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4,
  autoStartBreaks: false,
  autoStartWork: false,
  soundEnabled: true,
  browserNotificationsEnabled: false,
  notificationVolume: 75,
  notificationSound: 'chime',
  theme: 'system',
  accentColor: 'red',
  timerTitle: '',
}

const STORAGE_KEY = 'pomodoro_settings'

const loadSettingsFromStorage = (): Settings => {
  if (typeof window === 'undefined') {
    return { ...DEFAULT_SETTINGS }
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Merge with defaults to handle any new settings added in future versions
      return { ...DEFAULT_SETTINGS, ...parsed }
    }
  } catch (error) {
    console.error('Error loading settings from storage:', error)
  }

  return { ...DEFAULT_SETTINGS }
}

const saveSettingsToStorage = (settings: Settings) => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (error) {
    console.error('Error saving settings to storage:', error)
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(loadSettingsFromStorage)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load settings on mount
  useEffect(() => {
    setSettings(loadSettingsFromStorage())
    setIsLoaded(true)
  }, [])

  // Apply theme changes to document
  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined') return undefined

    const applyTheme = () => {
      const root = document.documentElement
      const effectiveTheme =
        settings.theme === 'system'
          ? window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
          : settings.theme

      if (effectiveTheme === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }

    applyTheme()

    // Listen for system theme changes if using system theme
    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => applyTheme()
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }

    return undefined
  }, [settings.theme, isLoaded])

  // Save settings whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveSettingsToStorage(settings)
    }
  }, [settings, isLoaded])

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...updates }))
  }

  const resetSettings = () => {
    setSettings({ ...DEFAULT_SETTINGS })
  }

  const value: SettingsContextType = {
    ...settings,
    updateSettings,
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
