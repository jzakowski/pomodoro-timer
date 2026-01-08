'use client'

import { useTimer } from '@/lib/timerContext'

export default function TimerDisplay() {
  const { timeRemaining, mode, isRunning, startTimer, pauseTimer, resetTimer, skipSession } = useTimer()

  // Convert seconds to MM:SS format
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Calculate progress ring offset
  const circumference = 2 * Math.PI * 135
  const DEFAULT_DURATIONS = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  }
  const progress = timeRemaining / DEFAULT_DURATIONS[mode]
  const strokeDashoffset = circumference * (1 - progress)

  // Mode colors
  const modeColors = {
    work: '#EF4444',
    shortBreak: '#10B981',
    longBreak: '#8B5CF6',
  }

  const modeLabels = {
    work: 'Work',
    shortBreak: 'Short Break',
    longBreak: 'Long Break',
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Circular Timer Display */}
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
            stroke={modeColors[mode]}
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

        {/* Timer text in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Large monospace timer display - 80px on desktop, 48px on mobile */}
          <span className="text-[80px] md:text-[96px] font-mono font-bold text-gray-900 dark:text-white tabular-nums leading-none">
            {formatTime(timeRemaining)}
          </span>
          {/* Mode label */}
          <span className="mt-2 text-lg capitalize text-gray-600 dark:text-gray-400">
            {modeLabels[mode]}
          </span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="mt-8 flex items-center gap-4">
        {/* Skip Button */}
        <button
          onClick={skipSession}
          className="p-3 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Skip session"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-700 dark:text-gray-300"
          >
            <polygon points="5 4 15 12 5 20 5 4"></polygon>
            <line x1="19" y1="5" x2="19" y2="19"></line>
          </svg>
        </button>

        {/* Start/Pause Button */}
        <button
          onClick={isRunning ? pauseTimer : startTimer}
          className="p-6 rounded-full bg-red-500 hover:bg-red-600 transition-transform hover:scale-105 active:scale-95"
          aria-label={isRunning ? 'Pause timer' : 'Start timer'}
        >
          {isRunning ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="white"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="white"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          )}
        </button>

        {/* Reset Button */}
        <button
          onClick={resetTimer}
          className="p-3 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Reset timer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-700 dark:text-gray-300"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12"></path>
            <path d="M3 3v9h9"></path>
          </svg>
        </button>
      </div>
    </div>
  )
}
