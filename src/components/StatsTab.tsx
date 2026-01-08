'use client'

import { useStats } from '@/lib/statsContext'
import { Clock, Flame, Target, TrendingUp } from 'lucide-react'
import SessionDistributionPieChart from './SessionDistributionPieChart'

export default function StatsTab() {
  const { totalSessions, totalMinutes, currentStreak, bestStreak, sessionHistory } = useStats()

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

      {/* Session Distribution Pie Chart */}
      <SessionDistributionPieChart sessionHistory={sessionHistory} />

      {/* Auto-update indicator */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Stats update automatically after each session</p>
      </div>
    </div>
  )
}
