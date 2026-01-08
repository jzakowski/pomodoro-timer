'use client'

import { useState, useEffect } from 'react'
import { useTimer } from '@/lib/timerContext'
import { useTasks } from '@/lib/taskContext'
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react'
import TaskSelectionDialog from './TaskSelectionDialog'

export default function TimerTab() {
  const { mode, timeRemaining, isRunning, startTimer, pauseTimer, resetTimer, skipSession } = useTimer()
  const { tasks, setActiveTask } = useTasks()
  const [showTaskDialog, setShowTaskDialog] = useState(false)

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

  // Check if there's an active task
  const activeTask = tasks.find((task) => task.isActive)

  // Handle start button click
  const handleStart = () => {
    // Only prompt for task selection in work mode
    if (mode === 'work' && !activeTask && !isRunning) {
      const availableTasks = tasks.filter((task) => !task.isCompleted && task.title.trim() !== '')
      if (availableTasks.length > 0) {
        setShowTaskDialog(true)
        return
      }
    }
    startTimer()
  }

  // Handle task selection from dialog
  const handleSelectTask = (taskId: string) => {
    setActiveTask(taskId)
    setShowTaskDialog(false)
    // Auto-start timer after selecting task
    startTimer()
  }

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        if (isRunning) {
          pauseTimer()
        } else {
          handleStart()
        }
      } else if (e.code === 'KeyR') {
        e.preventDefault()
        resetTimer()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isRunning, mode, activeTask, tasks, startTimer, pauseTimer, resetTimer])

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      {/* Timer Display */}
      <div className="relative">
        <svg className="w-72 h-72 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="144"
            cy="144"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress circle */}
          <circle
            cx="144"
            cy="144"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 120}`}
            strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
            className={`transition-all duration-300 ${getModeColor()}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className={`text-7xl font-bold font-mono ${getModeColor()}`}>
            {formatTime(timeRemaining)}
          </p>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mt-2">
            {getModeLabel()}
          </p>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={skipSession}
          className="p-4 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-150"
          aria-label="Skip session"
        >
          <SkipForward className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>

        <button
          onClick={isRunning ? pauseTimer : handleStart}
          className={`p-6 rounded-full ${
            isRunning
              ? 'bg-yellow-500 hover:bg-yellow-600'
              : 'bg-red-500 hover:bg-red-600'
          } text-white transition-all duration-150 shadow-lg hover:scale-105`}
          aria-label={isRunning ? 'Pause timer' : 'Start timer'}
        >
          {isRunning ? (
            <Pause className="w-8 h-8" />
          ) : (
            <Play className="w-8 h-8 ml-1" />
          )}
        </button>

        <button
          onClick={resetTimer}
          className="p-4 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-150"
          aria-label="Reset timer"
        >
          <RotateCcw className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        <p>Press Space to start/pause • Press R to reset</p>
      </div>

      {/* Active Task Display */}
      {activeTask && mode === 'work' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md max-w-md">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Working on</p>
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                {activeTask.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {activeTask.completedPomodoros} / {activeTask.estimatedPomodoros} pomodoros
                </span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className="bg-red-500 dark:bg-red-400 h-full rounded-full"
                    style={{
                      width: `${(activeTask.completedPomodoros / activeTask.estimatedPomodoros) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Selection Dialog */}
      <TaskSelectionDialog
        isOpen={showTaskDialog}
        onClose={() => setShowTaskDialog(false)}
        onSelectTask={handleSelectTask}
      />
    </div>
  )
}
