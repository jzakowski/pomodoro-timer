'use client'

import React from 'react'

interface SessionDistributionPieChartProps {
  sessionHistory: Array<{
    type: 'work' | 'shortBreak' | 'longBreak'
    duration: number
    completed: boolean
  }>
}

export default function SessionDistributionPieChart({
  sessionHistory,
}: SessionDistributionPieChartProps) {
  // Calculate distribution
  const calculateDistribution = () => {
    const distribution = {
      work: 0,
      shortBreak: 0,
      longBreak: 0,
    }

    sessionHistory.forEach((session) => {
      if (session.completed) {
        distribution[session.type]++
      }
    })

    const total = distribution.work + distribution.shortBreak + distribution.longBreak

    return {
      work: distribution.work,
      shortBreak: distribution.shortBreak,
      longBreak: distribution.longBreak,
      total,
    }
  }

  const distribution = calculateDistribution()

  // If no sessions, show empty state
  if (distribution.total === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Session Distribution
        </h3>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 dark:text-gray-400 text-center">
            No sessions completed yet.<br />
            Complete some sessions to see the distribution.
          </p>
        </div>
      </div>
    )
  }

  // Calculate pie chart segments
  const workPercentage = (distribution.work / distribution.total) * 100
  const shortBreakPercentage = (distribution.shortBreak / distribution.total) * 100
  const longBreakPercentage = (distribution.longBreak / distribution.total) * 100

  // Convert polar coordinates to Cartesian for SVG paths
  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent)
    const y = Math.sin(2 * Math.PI * percent)
    return [x, y]
  }

  // Create SVG path for pie slice
  const createSlicePath = (startPercent: number, endPercent: number) => {
    const [startX, startY] = getCoordinatesForPercent(startPercent)
    const [endX, endY] = getCoordinatesForPercent(endPercent)
    const largeArcFlag = endPercent - startPercent > 0.5 ? 1 : 0

    const pathData = [
      `M 0 0`,
      `L ${startX} ${startY}`,
      `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
      `Z`,
    ].join(' ')

    return pathData
  }

  // Build pie chart segments
  let currentPercent = 0
  const segments: Array<{ path: string; color: string; label: string; count: number; percentage: number }> = []

  if (distribution.work > 0) {
    const endPercent = currentPercent + workPercentage / 100
    segments.push({
      path: createSlicePath(currentPercent, endPercent),
      color: '#EF4444', // Red for work
      label: 'Work',
      count: distribution.work,
      percentage: Math.round(workPercentage),
    })
    currentPercent = endPercent
  }

  if (distribution.shortBreak > 0) {
    const endPercent = currentPercent + shortBreakPercentage / 100
    segments.push({
      path: createSlicePath(currentPercent, endPercent),
      color: '#10B981', // Green for short break
      label: 'Short Break',
      count: distribution.shortBreak,
      percentage: Math.round(shortBreakPercentage),
    })
    currentPercent = endPercent
  }

  if (distribution.longBreak > 0) {
    const endPercent = currentPercent + longBreakPercentage / 100
    segments.push({
      path: createSlicePath(currentPercent, endPercent),
      color: '#8B5CF6', // Purple for long break
      label: 'Long Break',
      count: distribution.longBreak,
      percentage: Math.round(longBreakPercentage),
    })
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Session Distribution
      </h3>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        {/* Pie Chart */}
        <div className="relative">
          <svg
            viewBox="-1.2 -1.2 2.4 2.4"
            className="w-64 h-64 transform -rotate-90"
            style={{ overflow: 'visible' }}
          >
            {segments.map((segment, index) => (
              <path
                key={index}
                d={segment.path}
                fill={segment.color}
                stroke="white"
                strokeWidth="0.02"
                className="transition-opacity hover:opacity-80"
              />
            ))}
          </svg>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: segment.color }}
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {segment.label}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {segment.count} sessions ({segment.percentage}%)
                </p>
              </div>
            </div>
          ))}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total: {distribution.total} sessions
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
