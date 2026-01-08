import type { Metadata } from 'next'
import './globals.css'
import { TimerProvider } from '@/lib/timerContext'
import { StatsProvider } from '@/lib/statsContext'
import { NavigationProvider } from '@/lib/navigationContext'
import { TaskProvider } from '@/lib/taskContext'
import { SettingsProvider } from '@/lib/settingsContext'

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
          <SettingsProvider>
            <TimerProvider>
              <StatsProvider>
                <TaskProvider>
                  {children}
                </TaskProvider>
              </StatsProvider>
            </TimerProvider>
          </SettingsProvider>
        </NavigationProvider>
      </body>
    </html>
  )
}
