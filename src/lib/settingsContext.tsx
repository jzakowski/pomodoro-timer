'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type NotificationSound = 'chime' | 'bell' | 'gong'

interface SettingsState {
  // Timer durations (in minutes)
  workDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  sessionsUntilLongBreak: number

  // Toggles
  autoStartNextSession: boolean
  soundEnabled: boolean
  browserNotificationsEnabled: boolean

  // Sound settings
  volume: number
  notificationSound: NotificationSound

  // Appearance
  theme: 'light' | 'dark' | 'system'
  accentColor: string
}

interface SettingsContextType extends SettingsState {
  // Timer duration setters
  setWorkDuration: (duration: number) => void
  setShortBreakDuration: (duration: number) => void
  setLongBreakDuration: (duration: number) => void
  setSessionsUntilLongBreak: (sessions: number) => void

  // Toggle setters
  setAutoStartNextSession: (enabled: boolean) => void
  setSoundEnabled: (enabled: boolean) => void
  setBrowserNotificationsEnabled: (enabled: boolean) => void

  // Sound settings setters
  setVolume: (volume: number) => void
  setNotificationSound: (sound: NotificationSound) => void

  // Appearance setters
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setAccentColor: (color: string) => void

  // Helper to check if notifications are supported and permission status
  notificationPermission: NotificationPermission | 'unsupported'
  requestNotificationPermission: () => Promise<boolean>
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

const DEFAULT_SETTINGS: SettingsState = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4,
  autoStartNextSession: false,
  soundEnabled: true,
  browserNotificationsEnabled: false,
  volume: 75,
  notificationSound: 'chime',
  theme: 'system',
  accentColor: '#EF4444',
}

const SETTINGS_STORAGE_KEY = 'pomodoro_settings'

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS)
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'unsupported'>('default')

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY)
      if (stored) {
        const parsedSettings = JSON.parse(stored)
        setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings })
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
    } catch (error) {
      console.error('Error saving settings:', error)
    }
  }, [settings])

  // Check notification support and permission status
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission)

      // Listen for permission changes
      const handlePermissionChange = () => {
        setNotificationPermission(Notification.permission)
        // If permission was denied, disable the toggle
        if (Notification.permission === 'denied') {
          setSettings((prev) => ({ ...prev, browserNotificationsEnabled: false }))
        }
      }

      // Add event listener for permission changes (if supported)
      // Type assertion needed as onpermissionchange is not in TypeScript's Notification type
      const notificationApi = Notification as unknown as { addEventListener?: (event: string, handler: () => void) => void }
      const notificationApiRemove = Notification as unknown as { removeEventListener?: (event: string, handler: () => void) => void }

      if (notificationApi.addEventListener) {
        notificationApi.addEventListener('permissionchange', handlePermissionChange)
      }

      return () => {
        if (notificationApiRemove.removeEventListener) {
          notificationApiRemove.removeEventListener('permissionchange', handlePermissionChange)
        }
      }
    } else {
      setNotificationPermission('unsupported')
    }
    return undefined
  }, [])

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
      setNotificationPermission(permission)

      if (permission === 'granted') {
        return true
      }
    }

    return false
  }

  const setBrowserNotificationsEnabled = (enabled: boolean) => {
    if (enabled) {
      // Request permission when enabling
      requestNotificationPermission().then((granted) => {
        if (granted) {
          setSettings((prev) => ({ ...prev, browserNotificationsEnabled: true }))
        } else {
          // If permission denied, keep toggle off
          setSettings((prev) => ({ ...prev, browserNotificationsEnabled: false }))
          setNotificationPermission('denied')
        }
      })
    } else {
      setSettings((prev) => ({ ...prev, browserNotificationsEnabled: false }))
    }
  }

  const value: SettingsContextType = {
    ...settings,
    setWorkDuration: (duration) => setSettings((prev) => ({ ...prev, workDuration: duration })),
    setShortBreakDuration: (duration) => setSettings((prev) => ({ ...prev, shortBreakDuration: duration })),
    setLongBreakDuration: (duration) => setSettings((prev) => ({ ...prev, longBreakDuration: duration })),
    setSessionsUntilLongBreak: (sessions) => setSettings((prev) => ({ ...prev, sessionsUntilLongBreak: sessions })),
    setAutoStartNextSession: (enabled) => setSettings((prev) => ({ ...prev, autoStartNextSession: enabled })),
    setSoundEnabled: (enabled) => setSettings((prev) => ({ ...prev, soundEnabled: enabled })),
    setBrowserNotificationsEnabled,
    setVolume: (volume) => setSettings((prev) => ({ ...prev, volume })),
    setNotificationSound: (sound) => setSettings((prev) => ({ ...prev, notificationSound: sound })),
    setTheme: (theme) => setSettings((prev) => ({ ...prev, theme })),
    setAccentColor: (color) => setSettings((prev) => ({ ...prev, accentColor: color })),
    notificationPermission,
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
