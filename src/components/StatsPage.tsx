'use client'

import React from 'react'
import { TrendingUp, Clock, Flame, Target } from 'lucide-react'

export default function StatsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Statistics
      </h1>

      {/* Date Range Selector */}
      <div className="flex gap-2 mb-6">
        <button className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium">
          Today
        </button>
        <button className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium">
          Week
        </button>
        <button className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium">
          All-time
        </button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Today's Sessions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Today's Sessions</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">0</p>
            </div>
            <Target className="w-12 h-12 text-red-500 opacity-20" />
          </div>
        </div>

        {/* Focus Time */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Focus Time</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">0h 0m</p>
            </div>
            <Clock className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </div>

        {/* Current Streak */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Current Streak</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">0</p>
            </div>
            <Flame className="w-12 h-12 text-orange-500 opacity-20" />
          </div>
        </div>

        {/* Total Sessions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Sessions</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">0</p>
            </div>
            <TrendingUp className="w-12 h-12 text-blue-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="space-y-6">
        {/* Weekly Chart Placeholder */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Sessions This Week
          </h2>
          <div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-500">
            <p>Weekly chart will be displayed here</p>
          </div>
        </div>

        {/* Pie Chart Placeholder */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Session Distribution
          </h2>
          <div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-500">
            <p>Distribution chart will be displayed here</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex gap-4">
        <button className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200">
          Export CSV
        </button>
        <button className="flex-1 px-6 py-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors duration-200">
          Reset Stats
        </button>
      </div>
    </div>
  )
}
