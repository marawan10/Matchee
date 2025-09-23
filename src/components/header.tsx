"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, Search, Bell, Settings, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { SearchBar } from '@/components/search-bar'
import { LanguageSelector } from '@/components/language-selector'
import { NotificationsSystem } from '@/components/notifications-system'
import { cn } from '@/lib/utils'

export function Header() {
  const { theme, setTheme } = useTheme()
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  return (
    <motion.header 
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <motion.div 
          className="flex items-center space-x-2 shrink-0"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
            <span className="text-lg font-bold text-primary-foreground">M</span>
          </div>
          <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Matchee
          </span>
        </motion.div>

        {/* Search Bar - Hidden on mobile, shown on tablet+ */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <SearchBar />
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Search button for mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSearchFocused(!isSearchFocused)}
          >
            <Search className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="relative overflow-hidden"
          >
            <div className="h-4 w-4">
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </div>
          </Button>

          <div className="hidden sm:block">
            <NotificationsSystem />
          </div>

          <div className="hidden sm:block">
            <LanguageSelector />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:flex"
          >
            <Settings className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <AnimatePresence>
        {isSearchFocused && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t bg-background/95 backdrop-blur"
          >
            <div className="container mx-auto px-4 py-3">
              <SearchBar />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
