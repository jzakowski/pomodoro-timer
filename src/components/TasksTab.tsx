'use client'

import { useState } from 'react'
import { useTasks, Task } from '@/lib/taskContext'
import { Plus, Trash2, Check, Star } from 'lucide-react'

export default function TasksTab() {
  const { tasks, addTask, deleteTask, toggleTaskComplete, setActiveTask } = useTasks()
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(1)
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium')

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle.trim(), estimatedPomodoros, priority)
      setNewTaskTitle('')
      setEstimatedPomodoros(1)
      setPriority('medium')
    }
  }

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'low':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Add Task Input */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-md mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Add Task
        </h2>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.currentTarget.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            placeholder="What are you working on?"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={estimatedPomodoros}
              onChange={(e) => setEstimatedPomodoros(Number(e.currentTarget.value))}
              className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num}>
                  {num} pomodoro{num > 1 ? 's' : ''}
                </option>
              ))}
            </select>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Task['priority'])}
              className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <button
              onClick={handleAddTask}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-150 flex items-center justify-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 sm:p-12 shadow-md text-center">
            <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">
              No tasks yet. Add one above to get started! 📝
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-5 shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                {/* Active Star */}
                <button
                  onClick={() => setActiveTask(task.id)}
                  className={`mt-1 transition-colors duration-150 shrink-0 ${
                    task.isActive ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-500'
                  }`}
                  aria-label="Set as active"
                >
                  <Star className={`w-5 h-5 ${task.isActive ? 'fill-current' : ''}`} />
                </button>

                {/* Task Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3
                      className={`text-base sm:text-lg font-semibold ${
                        task.isCompleted
                          ? 'text-gray-400 line-through'
                          : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {task.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getPriorityColor(
                        task.priority
                      )} shrink-0`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>
                        {task.completedPomodoros} / {task.estimatedPomodoros}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-red-500 h-full transition-all duration-300 ease-out"
                        style={{
                          width: `${(task.completedPomodoros / task.estimatedPomodoros) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => toggleTaskComplete(task.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 flex items-center gap-1 ${
                        task.isCompleted
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-green-100 hover:text-green-800 dark:hover:bg-green-900 dark:hover:text-green-200'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span className="hidden sm:inline">{task.isCompleted ? 'Completed' : 'Mark Complete'}</span>
                      <span className="sm:hidden">Complete</span>
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-red-100 hover:text-red-800 dark:hover:bg-red-900 dark:hover:text-red-200 transition-colors duration-150 flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
