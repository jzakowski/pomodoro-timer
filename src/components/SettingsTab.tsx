'use client'

import { useSettings } from '@/lib/settingsContext'

export default function SettingsTab() {
  const { autoStart, setAutoStart } = useSettings()

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Settings
        </h2>

        <div className="space-y-6">
          {/* Timer Settings Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Timer Settings
            </h3>

            {/* Auto-start Toggle */}
            <div className="flex items-center justify-between py-3">
              <div className="flex-1">
                <label htmlFor="auto-start" className="text-gray-900 dark:text-white font-medium">
                  Auto-start next session
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Automatically start the next session when the current one completes
                </p>
              </div>
              <button
                id="auto-start"
                onClick={() => setAutoStart(!autoStart)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                  autoStart ? 'bg-red-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}
                aria-pressed={autoStart}
                aria-label="Toggle auto-start"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-150 ease-in-out ${
                    autoStart ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* More settings sections can be added here in the future */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              More customization options coming soon! ⚙️
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
