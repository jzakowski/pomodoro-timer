'use client'

import { useStats } from '@/lib/statsContext'
import { Clock, Flame, Target, TrendingUp, RotateCcw, Download } from 'lucide-react'
import { useState } from 'react'

export default function StatsTab() {
  const { totalSessions, totalMinutes, currentStreak, bestStreak, resetStats, exportStats } = useStats()
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  // Calculate today's focus time
  const todayFocusMinutes = totalMinutes // In a full implementation, this would filter by today
  const focusHours = Math.floor(todayFocusMinutes / 60)
  const focusMinutes = todayFocusMinutes % 60

  const formatFocusTime = () => {
    if (focusHours > 0) {
      return `${focusHours}h ${focusMinutes}m`
    }
    return `${focusMinutes}m`
  }

  const handleExportStats = () => {
    const csvData = exportStats()
    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `pomodoro-stats-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleResetStats = () => {
    resetStats()
    setShowResetConfirm(false)
  }

  const statsCards = [
    {
      title: "Today's Sessions",
      value: totalSessions.toString(),
      icon: Target,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
    {
      title: 'Focus Time Today',
      value: formatFocusTime(),
      icon: Clock,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Current Streak',
      value: `${currentStreak} days`,
      icon: Flame,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      title: 'Total Sessions',
      value: totalSessions.toString(),
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Statistics
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Track your productivity over time
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 gap-4">
        {statsCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.title}
              className={`${card.bgColor} rounded-xl p-4 border border-gray-200 dark:border-gray-700`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-5 h-5 ${card.color}`} />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {card.title}
                </p>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {card.value}
              </p>
            </div>
          )
        })}
      </div>

      {/* Additional Stats Info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          All-Time Best
        </h3>
        <div className="flex items-center gap-4">
          <Flame className="w-8 h-8 text-orange-500" />
          <div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {bestStreak} days
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Best streak
            </p>
          </div>
        </div>
      </div>

      {/* Auto-update indicator */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Stats update automatically after each session</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleExportStats}
          className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-150 flex items-center justify-center gap-2 font-medium shadow-md"
        >
          <Download className="w-5 h-5" />
          Export Stats
        </button>
        <button
          onClick={() => setShowResetConfirm(true)}
          className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-150 flex items-center justify-center gap-2 font-medium shadow-md"
        >
          <RotateCcw className="w-5 h-5" />
          Reset Stats
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Reset All Statistics?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This will permanently delete all your session history, streaks, and statistics. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors duration-150 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleResetStats}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-150 font-medium"
              >
                Yes, Reset Stats
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
