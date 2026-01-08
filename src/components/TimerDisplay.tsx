'use client'

import React from 'react'
import { useTimer } from '@/lib/timerContext'

export default function TimerDisplay() {
  const { timeRemaining, mode } = useTimer()

  // Convert seconds to MM:SS format
  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60
  const displayTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  // Calculate progress for circular ring
  const DEFAULT_DURATIONS = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  }
  const totalTime = DEFAULT_DURATIONS[mode]
  const progress = (totalTime - timeRemaining) / totalTime
  const circumference = 2 * Math.PI * 135 // radius = 135
  const strokeDashoffset = circumference * (1 - progress)

  // Color based on session type
  const colors = {
    work: '#EF4444',      // Focus Red
    shortBreak: '#10B981', // Relax Green
    longBreak: '#8B5CF6',  // Deep Purple
  }

  const currentColor = colors[mode]

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Circular Timer */}
      <div className="relative">
        <svg
          className="transform -rotate-90"
          width="300"
          height="300"
          viewBox="0 0 300 300"
        >
          {/* Background circle */}
          <circle
            cx="150"
            cy="150"
            r="135"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />

          {/* Progress circle */}
          <circle
            cx="150"
            cy="150"
            r="135"
            stroke={currentColor}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.3s ease, stroke 0.5s ease',
            }}
          />
        </svg>

        {/* Time display in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-7xl md:text-8xl font-mono font-bold text-gray-900 dark:text-white tabular-nums">
            {displayTime}
          </span>
          <span className="mt-2 text-lg capitalize text-gray-600 dark:text-gray-400">
            {mode === 'shortBreak' ? 'Short Break' : mode === 'longBreak' ? 'Long Break' : 'Work'}
          </span>
        </div>
      </div>
    </div>
  )
}
