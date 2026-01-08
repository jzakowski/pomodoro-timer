'use client'

import { useTimer } from '@/lib/timerContext'
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react'

export default function TimerTab() {
  const { mode, timeRemaining, isRunning, startTimer, pauseTimer, resetTimer, skipSession } = useTimer()

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getModeLabel = () => {
    switch (mode) {
      case 'work':
        return 'Work'
      case 'shortBreak':
        return 'Short Break'
      case 'longBreak':
        return 'Long Break'
    }
  }

  const getModeColor = () => {
    switch (mode) {
      case 'work':
        return 'text-red-500 dark:text-red-400'
      case 'shortBreak':
        return 'text-green-500 dark:text-green-400'
      case 'longBreak':
        return 'text-purple-500 dark:text-purple-400'
    }
  }

  const totalDuration = mode === 'work' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 15 * 60
  const progress = ((totalDuration - timeRemaining) / totalDuration) * 100

  return (
    <div className="flex flex-col items-center justify-center space-y-6 sm:space-y-8">
      {/* Timer Display */}
      <div className="relative">
        <svg className="w-64 h-64 sm:w-72 sm:h-72 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="128"
            cy="128"
            r="108"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress circle */}
          <circle
            cx="128"
            cy="128"
            r="108"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 108}`}
            strokeDashoffset={`${2 * Math.PI * 108 * (1 - progress / 100)}`}
            className={`transition-all duration-300 ${getModeColor()}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className={`text-5xl sm:text-6xl md:text-7xl font-bold font-mono ${getModeColor()}`}>
            {formatTime(timeRemaining)}
          </p>
          <p className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 mt-2">
            {getModeLabel()}
          </p>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={skipSession}
          className="p-3 sm:p-4 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-150"
          aria-label="Skip session"
        >
          <SkipForward className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
        </button>

        <button
          onClick={isRunning ? pauseTimer : startTimer}
          className={`p-5 sm:p-6 rounded-full ${
            isRunning
              ? 'bg-yellow-500 hover:bg-yellow-600'
              : 'bg-red-500 hover:bg-red-600'
          } text-white transition-all duration-150 shadow-lg hover:scale-105`}
          aria-label={isRunning ? 'Pause timer' : 'Start timer'}
        >
          {isRunning ? (
            <Pause className="w-7 h-7 sm:w-8 sm:h-8" />
          ) : (
            <Play className="w-7 h-7 sm:w-8 sm:h-8 ml-1" />
          )}
        </button>

        <button
          onClick={resetTimer}
          className="p-3 sm:p-4 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-150"
          aria-label="Reset timer"
        >
          <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {/* Instructions */}
      <div className="text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 px-4">
        <p>Press Space to start/pause • Press R to reset</p>
      </div>
    </div>
  )
}
