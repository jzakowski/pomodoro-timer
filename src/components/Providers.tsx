'use client'

import React from 'react'
import { TimerProvider } from '@/lib/timerContext'
import { StatsProvider } from '@/lib/statsContext'
import { NavigationProvider } from '@/lib/navigationContext'
import { TaskProvider, useTasks } from '@/lib/taskContext'

function TimerWithTaskCallback({ children }: { children: React.ReactNode }) {
  const { tasks, incrementPomodoros } = useTasks()

  const handleWorkComplete = () => {
    // Find the active task and increment its pomodoros
    const activeTask = tasks.find(task => task.isActive)
    if (activeTask) {
      incrementPomodoros(activeTask.id)
    }
  }

  return (
    <TimerProvider onWorkComplete={handleWorkComplete}>
      {children}
    </TimerProvider>
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NavigationProvider>
      <TaskProvider>
        <TimerWithTaskCallback>
          <StatsProvider>
            {children}
          </StatsProvider>
        </TimerWithTaskCallback>
      </TaskProvider>
    </NavigationProvider>
  )
}
