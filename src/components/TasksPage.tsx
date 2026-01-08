'use client'

import React from 'react'
import { Plus } from 'lucide-react'

export default function TasksPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Tasks
      </h1>

      {/* Add Task Input */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="What are you working on?"
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
            aria-label="New task description"
          />
          <button
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            aria-label="Add task"
          >
            <Plus className="w-5 h-5" />
            Add
          </button>
        </div>
      </div>

      {/* Task Filters */}
      <div className="flex gap-2 mb-6">
        <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium">
          All
        </button>
        <button className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium">
          Active
        </button>
        <button className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium">
          Completed
        </button>
      </div>

      {/* Task List - Empty State */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          No tasks yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Add your first task to start tracking your pomodoros
        </p>
      </div>
    </div>
  )
}
