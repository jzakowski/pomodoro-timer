'use client'

import { useNavigation } from '@/lib/navigationContext'
import { Timer, CheckSquare, BarChart3, Settings } from 'lucide-react'

export default function TabNavigation() {
  const { activeTab, setActiveTab } = useNavigation()

  const tabs = [
    { id: 'timer' as const, label: 'Timer', icon: Timer },
    { id: 'tasks' as const, label: 'Tasks', icon: CheckSquare },
    { id: 'stats' as const, label: 'Stats', icon: BarChart3 },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ]

  return (
    <>
      {/* Mobile: Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:hidden z-50">
        <div className="flex justify-around items-center h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors duration-150 ${
                  isActive
                    ? 'text-red-500 dark:text-red-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                aria-label={tab.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs mt-1">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Desktop: Top navigation */}
      <nav className="hidden md:flex justify-center mb-8">
        <div className="flex gap-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-150 ${
                  isActive
                    ? 'bg-red-500 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                aria-label={tab.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Spacer for mobile bottom nav */}
      <div className="h-16 md:hidden" />
    </>
  )
}
