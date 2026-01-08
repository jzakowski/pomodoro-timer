'use client'

import React, { useState } from 'react'
import { TimerProvider } from '@/lib/timerContext'
import TabNavigation, { TabType } from '@/components/TabNavigation'
import TimerDisplay from '@/components/TimerDisplay'
import TasksPage from '@/components/TasksPage'
import StatsPage from '@/components/StatsPage'
import SettingsPage from '@/components/SettingsPage'

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('timer')

  const renderContent = () => {
    switch (activeTab) {
      case 'timer':
        return <TimerDisplay />
      case 'tasks':
        return <TasksPage />
      case 'stats':
        return <StatsPage />
      case 'settings':
        return <SettingsPage />
      default:
        return <TimerDisplay />
    }
  }

  return (
    <TimerProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              🍅 Pomodoro Timer
            </h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="pb-20 md:pb-8">
          {renderContent()}
        </main>

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </TimerProvider>
  )
}
