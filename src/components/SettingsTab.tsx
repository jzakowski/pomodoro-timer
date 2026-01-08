'use client'

import { Volume2, Play, Bell, ToggleLeft, ToggleRight } from 'lucide-react'
import { useSettings } from '@/lib/settingsContext'
import { playNotificationSound } from '@/lib/audio'

export default function SettingsTab() {
  const {
    workDuration,
    shortBreakDuration,
    longBreakDuration,
    sessionsUntilLong,
    volume,
    soundEnabled,
    notificationSound,
    browserNotificationsEnabled,
    autoStart,
    setWorkDuration,
    setShortBreakDuration,
    setLongBreakDuration,
    setSessionsUntilLong,
    setVolume,
    setSoundEnabled,
    setNotificationSound,
    setBrowserNotificationsEnabled,
    setAutoStart,
  } = useSettings()

  const handlePreviewSound = () => {
    if (soundEnabled) {
      playNotificationSound(notificationSound, volume)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value, 10)
    setVolume(newVolume)
  }

  const handleSoundEnabledChange = (enabled: boolean) => {
    setSoundEnabled(enabled)
    if (enabled) {
      // Play a preview sound when enabling
      playNotificationSound(notificationSound, volume)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Notifications & Sound Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications & Sound
        </h3>

        {/* Volume Slider */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Volume
            </label>
            <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">
              {volume}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500 hover:accent-red-600 transition-colors"
            disabled={!soundEnabled}
            aria-label="Volume control"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Sound Toggle */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sound Notifications
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Play sound when timer completes
              </p>
            </div>
            <button
              onClick={() => handleSoundEnabledChange(!soundEnabled)}
              className="relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label="Toggle sound notifications"
            >
              {soundEnabled ? (
                <>
                  <ToggleRight className="w-14 h-8 text-red-500" />
                  <span className="absolute right-1 inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform duration-200" />
                </>
              ) : (
                <>
                  <ToggleLeft className="w-14 h-8 text-gray-400 dark:text-gray-600" />
                  <span className="absolute left-1 inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform duration-200" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sound Selector & Preview */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
            Notification Sound
          </label>
          <div className="flex gap-2">
            <select
              value={notificationSound}
              onChange={(e) => setNotificationSound(e.target.value as any)}
              disabled={!soundEnabled}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Select notification sound"
            >
              <option value="chime">Chime (Gentle)</option>
              <option value="bell">Bell (Classic)</option>
              <option value="gong">Gong (Deep)</option>
            </select>
            <button
              onClick={handlePreviewSound}
              disabled={!soundEnabled}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
              aria-label="Preview sound"
            >
              <Play className="w-4 h-4" />
              Preview
            </button>
          </div>
        </div>

        {/* Browser Notifications Toggle */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Browser Notifications
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Show notification when timer completes
              </p>
            </div>
            <button
              onClick={() => setBrowserNotificationsEnabled(!browserNotificationsEnabled)}
              className="relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label="Toggle browser notifications"
            >
              {browserNotificationsEnabled ? (
                <>
                  <ToggleRight className="w-14 h-8 text-red-500" />
                  <span className="absolute right-1 inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform duration-200" />
                </>
              ) : (
                <>
                  <ToggleLeft className="w-14 h-8 text-gray-400 dark:text-gray-600" />
                  <span className="absolute left-1 inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform duration-200" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Timer Settings Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Timer Settings
        </h3>

        {/* Work Duration */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Work Duration
            </label>
            <span className="text-sm font-bold text-red-500 dark:text-red-400">
              {workDuration} min
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="60"
            value={workDuration}
            onChange={(e) => setWorkDuration(Number(e.currentTarget.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
            aria-label="Work duration in minutes"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
            <span>1 min</span>
            <span>30 min</span>
            <span>60 min</span>
          </div>
        </div>

        {/* Short Break Duration */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Short Break Duration
            </label>
            <span className="text-sm font-bold text-green-500 dark:text-green-400">
              {shortBreakDuration} min
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="15"
            value={shortBreakDuration}
            onChange={(e) => setShortBreakDuration(Number(e.currentTarget.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
            aria-label="Short break duration in minutes"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
            <span>1 min</span>
            <span>8 min</span>
            <span>15 min</span>
          </div>
        </div>

        {/* Long Break Duration */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Long Break Duration
            </label>
            <span className="text-sm font-bold text-purple-500 dark:text-purple-400">
              {longBreakDuration} min
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="30"
            value={longBreakDuration}
            onChange={(e) => setLongBreakDuration(Number(e.currentTarget.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            aria-label="Long break duration in minutes"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
            <span>5 min</span>
            <span>18 min</span>
            <span>30 min</span>
          </div>
        </div>

        {/* Sessions Until Long Break */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Sessions Until Long Break
            </label>
            <span className="text-sm font-bold text-blue-500 dark:text-blue-400">
              {sessionsUntilLong}
            </span>
          </div>
          <input
            type="range"
            min="2"
            max="8"
            value={sessionsUntilLong}
            onChange={(e) => setSessionsUntilLong(Number(e.currentTarget.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            aria-label="Number of work sessions until long break"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
            <span>2</span>
            <span>5</span>
            <span>8</span>
          </div>
        </div>

        {/* Auto-start Toggle */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Auto-start Next Session
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Automatically start next session after completion
              </p>
            </div>
            <button
              onClick={() => setAutoStart(!autoStart)}
              className="relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label="Toggle auto-start"
            >
              {autoStart ? (
                <>
                  <ToggleRight className="w-14 h-8 text-red-500" />
                  <span className="absolute right-1 inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform duration-200" />
                </>
              ) : (
                <>
                  <ToggleLeft className="w-14 h-8 text-gray-400 dark:text-gray-600" />
                  <span className="absolute left-1 inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform duration-200" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Info Message */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
          💡 Settings are automatically saved and will apply immediately
        </p>
      </div>
    </div>
  )
}
