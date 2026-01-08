'use client'

import React from 'react'

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Settings
      </h1>

      <div className="space-y-6">
        {/* Timer Durations */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Timer Durations
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Work Duration: 25 minutes
              </label>
              <input
                type="range"
                min="1"
                max="60"
                defaultValue="25"
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Short Break: 5 minutes
              </label>
              <input
                type="range"
                min="1"
                max="15"
                defaultValue="5"
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Long Break: 15 minutes
              </label>
              <input
                type="range"
                min="5"
                max="30"
                defaultValue="15"
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sessions until Long Break: 4
              </label>
              <input
                type="range"
                min="1"
                max="10"
                defaultValue="4"
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Auto-start */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Auto-start Options
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-900 dark:text-white font-medium">
                Auto-start Next Session
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Automatically start the next session timer
              </p>
            </div>
            <button
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              role="switch"
              aria-checked="false"
            >
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
            </button>
          </div>
        </div>

        {/* Notifications & Sound */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Notifications & Sound
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900 dark:text-white font-medium">
                  Sound Notifications
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Play sound when timer completes
                </p>
              </div>
              <button
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                role="switch"
                aria-checked="true"
              >
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900 dark:text-white font-medium">
                  Browser Notifications
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Show browser notification when timer completes
                </p>
              </div>
              <button
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                role="switch"
                aria-checked="false"
              >
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Volume: 80%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="80"
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Appearance
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Theme
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white">
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Data Management
          </h2>

          <div className="space-y-4">
            <button className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200">
              Export All Data
            </button>
            <button className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200">
              Import Data
            </button>
            <button className="w-full px-6 py-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors duration-200">
              Clear All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
