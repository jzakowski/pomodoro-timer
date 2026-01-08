'use client'

import { useTasks } from '@/lib/taskContext'
import { X, Star, Clock } from 'lucide-react'
import { Task } from '@/lib/taskContext'

interface TaskSelectionDialogProps {
  isOpen: boolean
  onClose: () => void
  onSelectTask: (taskId: string) => void
}

export default function TaskSelectionDialog({ isOpen, onClose, onSelectTask }: TaskSelectionDialogProps) {
  const { tasks } = useTasks()

  if (!isOpen) return null

  // Filter to show only incomplete, non-completed tasks
  const availableTasks = tasks.filter((task) => !task.isCompleted && task.title.trim() !== '')

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'low':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getPriorityLabel = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'High'
      case 'medium':
        return 'Medium'
      case 'low':
        return 'Low'
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 id="dialog-title" className="text-2xl font-bold text-gray-900 dark:text-white">
            Select a Task
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {availableTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No tasks available. Create a task first!
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Choose a task to work on during this Pomodoro session
              </p>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {availableTasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => onSelectTask(task.id)}
                    className="w-full text-left p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors truncate">
                          {task.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-2">
                          {/* Priority Badge */}
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor(
                              task.priority
                            )}`}
                          >
                            {getPriorityLabel(task.priority)}
                          </span>

                          {/* Pomodoro Progress */}
                          <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>
                              {task.completedPomodoros} / {task.estimatedPomodoros} pomodoros
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Active Indicator */}
                      {task.isActive && (
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-red-500 dark:bg-red-400 h-full transition-all duration-300"
                          style={{
                            width: `${(task.completedPomodoros / task.estimatedPomodoros) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {availableTasks.length > 0 && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
