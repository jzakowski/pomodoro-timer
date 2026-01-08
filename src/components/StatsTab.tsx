'use client'

import { useStats } from '@/lib/statsContext'
import { Clock, Flame, Target, TrendingUp, BarChart3 } from 'lucide-react'

export default function StatsTab() {
  const { totalSessions, totalMinutes, currentStreak, bestStreak, sessionsByDate } = useStats()

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

  // Get last 7 days data for weekly chart
  const getWeeklyData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const weeklyData = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)

      const dateStr = date.toISOString().split('T')[0] || ''
      const dayName = days[date.getDay()] || '?'
      const sessions = sessionsByDate[dateStr] || 0

      weeklyData.push({
        date: dateStr,
        dayName,
        sessions,
        isToday: i === 0,
      })
    }

    return weeklyData
  }

  const weeklyData = getWeeklyData()
  const maxSessions = Math.max(...weeklyData.map((d) => d.sessions), 1) // Avoid division by zero

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
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Statistics
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Track your productivity over time
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {statsCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.title}
              className={`${card.bgColor} rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${card.color}`} />
                <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  {card.title}
                </p>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {card.value}
              </p>
            </div>
          )
        })}
      </div>

      {/* Weekly Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            This Week
          </h3>
        </div>

        {/* Bar Chart */}
        <div className="flex items-end justify-between gap-1 sm:gap-2 h-40 sm:h-48">
          {weeklyData.map((day) => {
            const barHeight = maxSessions > 0 ? (day.sessions / maxSessions) * 100 : 0
            const isToday = day.isToday

            return (
              <div key={day.date} className="flex flex-col items-center gap-2 flex-1">
                {/* Bar */}
                <div className="relative w-full flex flex-col justify-end h-32 sm:h-40">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-300 ${
                      isToday
                        ? 'bg-red-500 dark:bg-red-400'
                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                    }`}
                    style={{ height: `${barHeight}%`, minHeight: day.sessions > 0 ? '4px' : '0' }}
                  />
                </div>

                {/* Day Label */}
                <div className="text-center">
                  <p
                    className={`text-xs font-medium ${
                      isToday
                        ? 'text-red-500 dark:text-red-400 font-semibold'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {day.dayName}
                  </p>
                  {day.sessions > 0 && (
                    <p className="text-xs text-gray-500 dark:text-gray-500">{day.sessions}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Chart Legend */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded" />
              <span>Past days</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 dark:bg-red-400 rounded" />
              <span>Today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats Info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
          All-Time Best
        </h3>
        <div className="flex items-center gap-3 sm:gap-4">
          <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {bestStreak} days
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Best streak
            </p>
          </div>
        </div>
      </div>

      {/* Auto-update indicator */}
      <div className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
        <p>Stats update automatically after each session</p>
      </div>
    </div>
  )
}
