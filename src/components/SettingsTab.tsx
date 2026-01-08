'use client'

import { useSettings } from '@/lib/settingsContext'
import {
  Clock,
  Bell,
  Volume2,
  Palette,
  RotateCcw,
  Sun,
  Moon,
  Monitor,
  Sparkles,
} from 'lucide-react'

export default function SettingsTab() {
  const {
    workDuration,
    shortBreakDuration,
    longBreakDuration,
    sessionsUntilLongBreak,
    autoStartBreaks,
    autoStartWork,
    soundEnabled,
    browserNotificationsEnabled,
    notificationVolume,
    notificationSound,
    theme,
    accentColor,
    timerTitle,
    updateSettings,
    resetSettings,
  } = useSettings()

  const accentColors = [
    { name: 'red', color: 'bg-red-500', hex: '#EF4444' },
    { name: 'blue', color: 'bg-blue-500', hex: '#3B82F6' },
    { name: 'green', color: 'bg-green-500', hex: '#10B981' },
    { name: 'purple', color: 'bg-purple-500', hex: '#8B5CF6' },
    { name: 'orange', color: 'bg-orange-500', hex: '#F97316' },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Settings
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Customize your Pomodoro experience
        </p>
      </div>

      {/* Timer Durations */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Timer Durations
          </h3>
        </div>

        <div className="space-y-4">
          {/* Work Duration */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Work Duration
              </label>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {workDuration} min
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="60"
              value={workDuration}
              onChange={(e) => updateSettings({ workDuration: Number(e.target.value) })}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>1 min</span>
              <span>60 min</span>
            </div>
          </div>

          {/* Short Break */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Short Break
              </label>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {shortBreakDuration} min
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              value={shortBreakDuration}
              onChange={(e) =>
                updateSettings({ shortBreakDuration: Number(e.target.value) })
              }
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>1 min</span>
              <span>15 min</span>
            </div>
          </div>

          {/* Long Break */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Long Break
              </label>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {longBreakDuration} min
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              value={longBreakDuration}
              onChange={(e) =>
                updateSettings({ longBreakDuration: Number(e.target.value) })
              }
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>5 min</span>
              <span>30 min</span>
            </div>
          </div>

          {/* Sessions Until Long Break */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sessions Until Long Break
              </label>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {sessionsUntilLongBreak}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={sessionsUntilLongBreak}
              onChange={(e) =>
                updateSettings({ sessionsUntilLongBreak: Number(e.target.value) })
              }
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>1</span>
              <span>10</span>
            </div>
          </div>
        </div>
      </div>

      {/* Auto-start Options */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Auto-start Options
          </h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Auto-start Breaks
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Automatically start break after work session
              </p>
            </div>
            <button
              onClick={() => updateSettings({ autoStartBreaks: !autoStartBreaks })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                autoStartBreaks ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  autoStartBreaks ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Auto-start Work
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Automatically start work after break
              </p>
            </div>
            <button
              onClick={() => updateSettings({ autoStartWork: !autoStartWork })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                autoStartWork ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  autoStartWork ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Notifications & Sound */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notifications & Sound
          </h3>
        </div>

        <div className="space-y-4">
          {/* Sound Enabled */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sound Notifications
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Play sound when timer completes
              </p>
            </div>
            <button
              onClick={() => updateSettings({ soundEnabled: !soundEnabled })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                soundEnabled ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  soundEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Browser Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Browser Notifications
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Show system notification when timer completes
              </p>
            </div>
            <button
              onClick={() =>
                updateSettings({
                  browserNotificationsEnabled: !browserNotificationsEnabled,
                })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                browserNotificationsEnabled ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  browserNotificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Volume */}
          {soundEnabled && (
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  Volume
                </label>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {notificationVolume}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={notificationVolume}
                onChange={(e) =>
                  updateSettings({ notificationVolume: Number(e.target.value) })
                }
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          )}

          {/* Notification Sound */}
          {soundEnabled && (
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Notification Sound
              </label>
              <select
                value={notificationSound}
                onChange={(e) =>
                  updateSettings({
                    notificationSound: e.target.value as 'chime' | 'bell' | 'gong',
                  })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              >
                <option value="chime">Chime (Gentle)</option>
                <option value="bell">Bell (Classic)</option>
                <option value="gong">Gong (Deep)</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-pink-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Appearance
          </h3>
        </div>

        <div className="space-y-4">
          {/* Theme Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
              Theme
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => updateSettings({ theme: 'light' })}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all duration-200 ${
                  theme === 'light'
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
              >
                <Sun className="w-6 h-6 text-yellow-500" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Light
                </span>
              </button>
              <button
                onClick={() => updateSettings({ theme: 'dark' })}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all duration-200 ${
                  theme === 'dark'
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
              >
                <Moon className="w-6 h-6 text-blue-500" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Dark
                </span>
              </button>
              <button
                onClick={() => updateSettings({ theme: 'system' })}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all duration-200 ${
                  theme === 'system'
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
              >
                <Monitor className="w-6 h-6 text-gray-500" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  System
                </span>
              </button>
            </div>
          </div>

          {/* Accent Color */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
              Accent Color
            </label>
            <div className="grid grid-cols-5 gap-3">
              {accentColors.map((color) => (
                <button
                  key={color.name}
                  onClick={() =>
                    updateSettings({ accentColor: color.name as typeof accentColor })
                  }
                  className={`h-12 rounded-lg transition-all duration-200 ${
                    accentColor === color.name
                      ? 'ring-2 ring-offset-2 ring-gray-900 dark:ring-white scale-110'
                      : 'hover:scale-105'
                  } ${color.color}`}
                  aria-label={`Select ${color.name} accent color`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Timer Title */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Timer Title
        </label>
        <input
          type="text"
          value={timerTitle}
          onChange={(e) => updateSettings({ timerTitle: e.target.value })}
          placeholder="What are you working on?"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Optional: Display a custom message during work sessions
        </p>
      </div>

      {/* Reset Button */}
      <div className="flex justify-center">
        <button
          onClick={resetSettings}
          className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200 font-medium"
        >
          <RotateCcw className="w-5 h-5" />
          Reset to Defaults
        </button>
      </div>

      {/* Auto-save indicator */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Settings are saved automatically ✓</p>
      </div>
    </div>
  )
}
