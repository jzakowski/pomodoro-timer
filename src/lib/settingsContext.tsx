'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface SettingsState {
  browserNotifications: boolean
  soundNotifications: boolean
  autoStart: boolean
}

interface SettingsContextType extends SettingsState {
  setBrowserNotifications: (enabled: boolean) => void
  setSoundNotifications: (enabled: boolean) => void
  setAutoStart: (enabled: boolean) => void
  requestNotificationPermission: () => Promise<boolean>
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

const DEFAULT_SETTINGS: SettingsState = {
  browserNotifications: false,
  soundNotifications: true,
  autoStart: false,
}

const STORAGE_KEY = 'pomodoro_settings'

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SettingsState>(() => {
    // Load from localStorage on mount
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
        }
      } catch (error) {
        console.error('Error loading settings:', error)
      }
    }
    return DEFAULT_SETTINGS
  })

  // Save to localStorage whenever settings change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
      } catch (error) {
        console.error('Error saving settings:', error)
      }
    }
  }, [settings])

  const setBrowserNotifications = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, browserNotifications: enabled }))
  }

  const setSoundNotifications = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, soundNotifications: enabled }))
  }

  const setAutoStart = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, autoStart: enabled }))
  }

  const requestNotificationPermission = async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.warn('Notifications not supported in this browser')
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }

    return false
  }

  const value: SettingsContextType = {
    ...settings,
    setBrowserNotifications,
    setSoundNotifications,
    setAutoStart,
    requestNotificationPermission,
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
