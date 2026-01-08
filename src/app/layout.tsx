import type { Metadata } from 'next'
import './globals.css'
import { TimerProvider } from '@/lib/timerContext'
import { StatsProvider } from '@/lib/statsContext'
import { NavigationProvider } from '@/lib/navigationContext'
import { TaskProvider } from '@/lib/taskContext'

export const metadata: Metadata = {
  title: 'Pomodoro Timer',
  description: 'A beautiful Pomodoro Timer application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <NavigationProvider>
          <TimerProvider>
            <StatsProvider>
              <TaskProvider>
                {children}
              </TaskProvider>
            </StatsProvider>
          </TimerProvider>
        </NavigationProvider>
      </body>
    </html>
  )
}
