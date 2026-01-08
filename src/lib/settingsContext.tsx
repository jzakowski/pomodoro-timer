'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type NotificationSound = 'chime' | 'bell' | 'gong'

interface SettingsState {
  volume: number
  soundEnabled: boolean
  notificationSound: NotificationSound
  browserNotificationsEnabled: boolean
  autoStart: boolean
  theme: 'light' | 'dark' | 'system'
  accentColor: string
}

interface SettingsContextType extends SettingsState {
  setVolume: (volume: number) => void
  setSoundEnabled: (enabled: boolean) => void
  setNotificationSound: (sound: NotificationSound) => void
  setBrowserNotificationsEnabled: (enabled: boolean) => void
  setAutoStart: (enabled: boolean) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setAccentColor: (color: string) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

const DEFAULT_SETTINGS: SettingsState = {
  volume: 50,
  soundEnabled: true,
  notificationSound: 'chime',
  browserNotificationsEnabled: false,
  autoStart: false,
  theme: 'system',
  accentColor: '#EF4444',
}

const STORAGE_KEY = 'pomodoro_settings'

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS)
  const [mounted, setMounted] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setSettings((prev) => ({
          ...prev,
          ...parsed,
        }))
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    }
    setMounted(true)
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
      } catch (error) {
        console.error('Error saving settings:', error)
      }
    }
  }, [settings, mounted])

  const setVolume = (volume: number) => {
    setSettings((prev) => ({ ...prev, volume }))
  }

  const setSoundEnabled = (soundEnabled: boolean) => {
    setSettings((prev) => ({ ...prev, soundEnabled }))
  }

  const setNotificationSound = (notificationSound: NotificationSound) => {
    setSettings((prev) => ({ ...prev, notificationSound }))
  }

  const setBrowserNotificationsEnabled = (browserNotificationsEnabled: boolean) => {
    setSettings((prev) => ({ ...prev, browserNotificationsEnabled }))
  }

  const setAutoStart = (autoStart: boolean) => {
    setSettings((prev) => ({ ...prev, autoStart }))
  }

  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    setSettings((prev) => ({ ...prev, theme }))
  }

  const setAccentColor = (accentColor: string) => {
    setSettings((prev) => ({ ...prev, accentColor }))
  }

  const value: SettingsContextType = {
    ...settings,
    setVolume,
    setSoundEnabled,
    setNotificationSound,
    setBrowserNotificationsEnabled,
    setAutoStart,
    setTheme,
    setAccentColor,
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
