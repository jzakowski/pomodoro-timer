'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface SettingsState {
  autoStart: boolean
}

interface SettingsContextType extends SettingsState {
  setAutoStart: (value: boolean) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

const STORAGE_KEY = 'pomodoro_settings'

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [autoStart, setAutoStartState] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const settings = JSON.parse(stored)
        if (typeof settings.autoStart === 'boolean') {
          setAutoStartState(settings.autoStart)
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      const settings = { autoStart }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch (error) {
      console.error('Error saving settings:', error)
    }
  }, [autoStart])

  const setAutoStart = (value: boolean) => {
    setAutoStartState(value)
  }

  const value: SettingsContextType = {
    autoStart,
    setAutoStart,
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
