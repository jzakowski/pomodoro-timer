'use client'

import { useNavigation } from '@/lib/navigationContext'
import TabNavigation from '@/components/TabNavigation'
import TimerTab from '@/components/TimerTab'
import TasksTab from '@/components/TasksTab'
import StatsTab from '@/components/StatsTab'
import SettingsTab from '@/components/SettingsTab'

export default function Home() {
  const { activeTab } = useNavigation()

  const renderTab = () => {
    switch (activeTab) {
      case 'timer':
        return <TimerTab />
      case 'tasks':
        return <TasksTab />
      case 'stats':
        return <StatsTab />
      case 'settings':
        return <SettingsTab />
      default:
        return <TimerTab />
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-6 sm:mb-8">
          🍅 Pomodoro Timer
        </h1>
        <TabNavigation />
        <div className="mt-6 sm:mt-8">
          {renderTab()}
        </div>
      </div>
    </main>
  )
}
