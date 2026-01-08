import type { Metadata } from 'next'
import './globals.css'
import { TimerProvider } from '@/lib/timerContext'

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
        <TimerProvider>{children}</TimerProvider>
      </body>
    </html>
  )
}
