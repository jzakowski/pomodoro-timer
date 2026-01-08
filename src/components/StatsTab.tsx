'use client'

import { useStats } from '@/lib/statsContext'
import { BarChart3, Clock, Target, Flame } from 'lucide-react'

export default function StatsTab() {
  const { todaySessions, todayFocusTime, totalSessions, currentStreak } = useStats()

  // Format focus time (seconds to hours and minutes)
  const formatFocusTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const stats = [
    {
      label: "Today's Sessions",
      value: todaySessions.toString(),
      icon: Target,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
    {
      label: 'Focus Time Today',
      value: formatFocusTime(todayFocusTime),
      icon: Clock,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: 'Current Streak',
      value: `${currentStreak} days`,
      icon: Flame,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      label: 'Total Sessions',
      value: totalSessions.toString(),
      icon: BarChart3,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Statistics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className={`${stat.bgColor} rounded-lg p-4 flex items-center gap-4`}
              >
                <div className={`${stat.color}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {todaySessions === 0 && (
          <div className="mt-8 text-center text-gray-500 dark:text-gray-400">
            <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No sessions completed yet today.</p>
            <p className="text-sm">Start a timer to begin tracking your productivity!</p>
          </div>
        )}
      </div>
    </div>
  )
}
