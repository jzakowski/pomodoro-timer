'use client'

import { useSettings } from '@/lib/settingsContext'
import { Bell, BellOff } from 'lucide-react'

export default function SettingsTab() {
  const { browserNotifications, setBrowserNotifications, requestNotificationPermission } = useSettings()

  const handleNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestNotificationPermission()
      if (granted) {
        setBrowserNotifications(true)
      } else {
        console.warn('Notification permission denied')
        setBrowserNotifications(false)
      }
    } else {
      setBrowserNotifications(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Settings
        </h2>

        <div className="space-y-6">
          {/* Notifications Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Notifications
            </h3>

            {/* Browser Notifications Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  {browserNotifications ? (
                    <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <BellOff className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Browser Notifications
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get notified when timer completes
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleNotificationToggle(!browserNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  browserNotifications ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                role="switch"
                aria-checked={browserNotifications}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    browserNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Coming Soon */}
          <div className="text-center py-8 border-t border-gray-200 dark:border-gray-700 mt-6">
            <p className="text-gray-600 dark:text-gray-400">
              More customization options coming soon! ⚙️
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
