'use client'

import { useSettings } from '@/lib/settingsContext'
import { Bell, BellOff, Check, X, AlertCircle } from 'lucide-react'

export default function SettingsTab() {
  const {
    browserNotificationsEnabled,
    setBrowserNotificationsEnabled,
    notificationPermission,
  } = useSettings()

  const handleToggle = () => {
    if (!browserNotificationsEnabled && notificationPermission === 'denied') {
      // Don't allow enabling if already denied
      return
    }
    setBrowserNotificationsEnabled(!browserNotificationsEnabled)
  }

  const getPermissionStatus = () => {
    if (notificationPermission === 'unsupported') {
      return {
        text: 'Not supported in this browser',
        color: 'text-gray-500',
        bgColor: 'bg-gray-100 dark:bg-gray-700',
        icon: AlertCircle,
      }
    }

    if (notificationPermission === 'denied') {
      return {
        text: 'Permission denied. Enable in browser settings.',
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        icon: X,
      }
    }

    if (notificationPermission === 'granted') {
      return {
        text: 'Notifications enabled',
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        icon: Check,
      }
    }

    return {
      text: 'Click toggle to enable notifications',
      color: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-50 dark:bg-gray-700/50',
      icon: Bell,
    }
  }

  const status = getPermissionStatus()
  const StatusIcon = status.icon

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Settings
        </h2>

        {/* Notifications Section */}
        <div className="space-y-6">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Notifications & Sound
            </h3>

            {/* Browser Notifications Toggle */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {browserNotificationsEnabled ? (
                    <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  ) : (
                    <BellOff className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Browser Notifications
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive notifications when timer completes
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleToggle}
                  disabled={notificationPermission === 'denied' || notificationPermission === 'unsupported'}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    browserNotificationsEnabled
                      ? 'bg-blue-600 dark:bg-blue-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  } ${notificationPermission === 'denied' || notificationPermission === 'unsupported' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  role="switch"
                  aria-checked={browserNotificationsEnabled}
                  aria-label="Toggle browser notifications"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                      browserNotificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Permission Status Message */}
              <div className={`flex items-start gap-2 p-3 rounded-lg ${status.bgColor}`}>
                <StatusIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${status.color}`} />
                <p className={`text-sm ${status.color}`}>
                  {status.text}
                </p>
              </div>
            </div>
          </div>

          {/* More settings sections will be added here */}
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <p className="text-sm">More customization options coming soon! ⚙️</p>
          </div>
        </div>
      </div>
    </div>
  )
}
