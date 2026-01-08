'use client'

import { useTimer } from '@/lib/timerContext'
import TimerDisplay from '@/components/TimerDisplay'

export default function Home() {
  const { currentSession, sessionsUntilLong } = useTimer()

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
          🍅 Pomodoro Timer
        </h1>

        {/* Session Counter */}
        <div className="text-center mb-8">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Session {currentSession} of {sessionsUntilLong}
          </span>
        </div>

        {/* Timer Display */}
        <TimerDisplay />
      </div>
    </main>
  )
}
