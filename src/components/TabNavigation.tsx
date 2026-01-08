'use client'

import React from 'react'
import { Timer, CheckSquare, BarChart3, Settings } from 'lucide-react'

export type TabType = 'timer' | 'tasks' | 'stats' | 'settings'

interface TabNavigationProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const tabs = [
  { id: 'timer' as TabType, label: 'Timer', icon: Timer },
  { id: 'tasks' as TabType, label: 'Tasks', icon: CheckSquare },
  { id: 'stats' as TabType, label: 'Stats', icon: BarChart3 },
  { id: 'settings' as TabType, label: 'Settings', icon: Settings },
]

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:relative md:border-b md:border-t-0 md:mb-8 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-around md:justify-center md:gap-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex flex-col md:flex-row items-center justify-center
                  py-3 px-4 md:py-4 md:px-6
                  transition-all duration-200
                  ${isActive
                    ? 'text-red-500 dark:text-red-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }
                `}
                aria-label={`Switch to ${tab.label} tab`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`w-6 h-6 md:w-5 md:h-5 md:mr-2 ${isActive ? 'scale-110' : ''}`} />
                <span className="text-xs md:text-sm font-medium mt-1 md:mt-0">
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
