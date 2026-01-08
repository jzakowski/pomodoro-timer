'use client'

import { TimerProvider } from '@/lib/timerContext'
import { NavigationProvider } from '@/lib/navigationContext'
import { TaskProvider } from '@/lib/taskContext'
import { StatsProvider } from '@/lib/statsContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StatsProvider>
      <TimerProvider>
        <NavigationProvider>
          <TaskProvider>
            {children}
          </TaskProvider>
        </NavigationProvider>
      </TimerProvider>
    </StatsProvider>
  )
}
