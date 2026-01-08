'use client'

import { useTheme } from '@/lib/themeContext'
import { Sun, Moon, Monitor } from 'lucide-react'

export default function SettingsTab() {
  const { theme, setTheme } = useTheme()

  const themes = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Settings
        </h2>

        {/* Theme Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Theme
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Choose your preferred color scheme
          </p>
          <div className="grid grid-cols-3 gap-3">
            {themes.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                  theme === value
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Icon className={`w-6 h-6 mb-2 ${
                  theme === value
                    ? 'text-red-500'
                    : 'text-gray-600 dark:text-gray-400'
                }`} />
                <span className={`text-sm font-medium ${
                  theme === value
                    ? 'text-red-500'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* More settings sections can be added here */}
      </div>
    </div>
  )
}
