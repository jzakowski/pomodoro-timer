'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'

export interface Task {
  id: string
  title: string
  estimatedPomodoros: number
  completedPomodoros: number
  priority: 'high' | 'medium' | 'low'
  isActive: boolean
  isCompleted: boolean
}

interface TaskContextType {
  tasks: Task[]
  addTask: (title: string, estimatedPomodoros: number, priority: 'high' | 'medium' | 'low') => void
  deleteTask: (id: string) => void
  toggleTaskComplete: (id: string) => void
  setActiveTask: (id: string) => void
  incrementPomodoros: (id: string) => void
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

const TASKS_STORAGE_KEY = 'pomodoro_tasks'

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])

  // Load tasks from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(TASKS_STORAGE_KEY)
    if (stored) {
      try {
        setTasks(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse tasks from localStorage:', e)
      }
    }
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const addTask = (title: string, estimatedPomodoros: number, priority: 'high' | 'medium' | 'low') => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      estimatedPomodoros,
      completedPomodoros: 0,
      priority,
      isActive: false,
      isCompleted: false,
    }
    setTasks((prev) => [...prev, newTask])
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const toggleTaskComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    )
  }

  const setActiveTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => ({
        ...task,
        isActive: task.id === id,
      }))
    )
  }

  const incrementPomodoros = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completedPomodoros: Math.min(task.completedPomodoros + 1, task.estimatedPomodoros),
              isCompleted: task.completedPomodoros + 1 >= task.estimatedPomodoros,
            }
          : task
      )
    )
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        deleteTask,
        toggleTaskComplete,
        setActiveTask,
        incrementPomodoros,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider')
  }
  return context
}
