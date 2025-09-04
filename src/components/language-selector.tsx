"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Languages, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation, Language } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface LanguageSelectorProps {
  className?: string
}

export function LanguageSelector({ className }: LanguageSelectorProps) {
  const { currentLanguage, setLanguage, availableLanguages } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = (language: Language) => {
    setLanguage(language)
    setIsOpen(false)
  }

  const currentLang = availableLanguages.find(lang => lang.code === currentLanguage)

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
      >
        <Languages className="h-4 w-4" />
        <span className="text-sm">{currentLang?.flag}</span>
        <span className="hidden sm:inline text-sm">{currentLang?.name}</span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 min-w-[160px]"
            >
              <div className="py-2">
                {availableLanguages.map((language, index) => (
                  <motion.button
                    key={language.code}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleLanguageChange(language.code as Language)}
                    className={cn(
                      "w-full px-4 py-2 text-left hover:bg-muted transition-colors flex items-center justify-between",
                      currentLanguage === language.code && "bg-muted"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{language.flag}</span>
                      <span className="text-sm font-medium">{language.name}</span>
                    </div>
                    {currentLanguage === language.code && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
