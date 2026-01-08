'use client'

import { useSettings } from '@/lib/settingsContext'

export default function SettingsTab() {
  const {
    workDuration,
    setWorkDuration,
    shortBreakDuration,
    setShortBreakDuration,
    longBreakDuration,
    setLongBreakDuration,
  } = useSettings()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Settings
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Customize your Pomodoro experience
        </p>
      </div>

      {/* Timer Durations */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Timer Durations
        </h3>

        {/* Work Duration */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Work Duration
            </label>
            <span className="text-sm font-bold text-red-500 dark:text-red-400">
              {workDuration} minutes
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
              {shortBreakDuration} minutes
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
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Long Break Duration
            </label>
            <span className="text-sm font-bold text-purple-500 dark:text-purple-400">
              {longBreakDuration} minutes
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
