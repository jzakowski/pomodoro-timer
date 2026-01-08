'use client'

import { useTimer } from '@/lib/timerContext'
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react'

const SESSION_COLORS = {
  work: '#EF4444',
  shortBreak: '#10B981',
  longBreak: '#8B5CF6',
}

const SESSION_LABELS = {
  work: 'Work',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
}

export default function TimerDisplay() {
  const { mode, timeRemaining, isRunning, currentSession, sessionsUntilLong, startTimer, pauseTimer, resetTimer, skipSession } = useTimer()

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Calculate progress for circular ring
  const totalTime = mode === 'work' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 15 * 60
  const progress = timeRemaining / totalTime
  const circumference = 2 * Math.PI * 135 // 135 is radius
  const strokeDashoffset = circumference * (1 - progress)

  const color = SESSION_COLORS[mode]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Session Type Label */}
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300" style={{ color }}>
          {SESSION_LABELS[mode]}
        </h2>
      </div>

      {/* Circular Timer */}
      <div className="relative mb-8">
        <svg width="300" height="300" className="transform -rotate-90">
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
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300 ease-in-out"
          />
        </svg>

        {/* Timer Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-8xl font-mono font-bold text-gray-900 dark:text-white tabular-nums">
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>

      {/* Session Counter */}
      <div className="mb-8 text-center">
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Session {currentSession} of {sessionsUntilLong}
        </p>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-4">
        {/* Skip Button */}
        <button
          onClick={skipSession}
          className="p-4 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-150 hover:scale-105"
          aria-label="Skip session"
        >
          <SkipForward className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>

        {/* Start/Pause Button */}
        <button
          onClick={isRunning ? pauseTimer : startTimer}
          className="p-6 rounded-full text-white transition-all duration-150 hover:scale-105 shadow-lg hover:shadow-xl"
          style={{ backgroundColor: color }}
          aria-label={isRunning ? 'Pause timer' : 'Start timer'}
        >
          {isRunning ? (
            <Pause className="w-8 h-8" fill="currentColor" />
          ) : (
            <Play className="w-8 h-8" fill="currentColor" />
          )}
        </button>

        {/* Reset Button */}
        <button
          onClick={resetTimer}
          className="p-4 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-150 hover:scale-105"
          aria-label="Reset timer"
        >
          <RotateCcw className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>
      </div>
    </div>
  )
}
