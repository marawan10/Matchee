"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Home, Calendar, Heart, BarChart3, Users, Trophy, TrendingUp } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const navItems = [
  { id: 'live', label: 'Live', icon: Home, active: true },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'favorites', label: 'My Feed', icon: Heart },
  { id: 'leagues', label: 'Leagues', icon: Trophy },
  { id: 'stats', label: 'Stats', icon: TrendingUp },
  { id: 'social', label: 'Social', icon: Users },
]

interface NavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const { t } = useTranslation()

  return (
    <nav className="sticky top-16 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "relative flex items-center space-x-2 px-3 sm:px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap shrink-0",
                activeTab === item.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <item.icon className="h-4 w-4" />
              <span className="hidden sm:block text-sm font-medium">{item.label}</span>
              <span className="sm:hidden text-xs font-medium">{item.label}</span>
              
              {activeTab === item.id && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  layoutId="activeTab"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </nav>
  )
}
