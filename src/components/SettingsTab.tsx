'use client'

import { useTheme } from '@/lib/themeContext'
import { Sun, Moon, Monitor } from 'lucide-react'

export default function SettingsTab() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  const themes: { value: 'light' | 'dark' | 'system'; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <Sun className="w-5 h-5" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="w-5 h-5" /> },
    { value: 'system', label: 'System', icon: <Monitor className="w-5 h-5" /> },
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Settings
        </h2>

        {/* Appearance Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Appearance
          </h3>

          {/* Theme Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Theme
            </label>
            <div className="grid grid-cols-3 gap-3">
              {themes.map((themeOption) => (
                <button
                  key={themeOption.value}
                  onClick={() => setTheme(themeOption.value)}
                  className={`
                    flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all
                    ${
                      theme === themeOption.value
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                    }
                  `}
                  aria-label={`Select ${themeOption.label} theme`}
                  aria-pressed={theme === themeOption.value}
                >
                  {themeOption.icon}
                  <span className="text-sm font-medium">{themeOption.label}</span>
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {theme === 'system'
                ? `Using system theme (${resolvedTheme})`
                : `Using ${theme} theme`}
            </p>
          </div>
        </div>

        {/* Placeholder for other settings */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-center py-4">
            More customization options coming soon! ⚙️
          </p>
        </div>
      </div>
    </div>
  )
}
