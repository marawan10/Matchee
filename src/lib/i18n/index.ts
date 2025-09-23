"use client"

import { translations, Translation } from './translations'
import { storageService } from '@/lib/storage'

export type Language = 'en' | 'ar' | 'es'

class I18nService {
  private currentLanguage: Language = 'en'
  private listeners: Function[] = []

  constructor() {
    if (typeof window !== 'undefined') {
      this.currentLanguage = storageService.getLanguage()
    }
  }

  getCurrentLanguage(): Language {
    return this.currentLanguage
  }

  setLanguage(language: Language) {
    this.currentLanguage = language
    storageService.setLanguage(language)
    
    // Update document direction for RTL languages
    if (typeof document !== 'undefined') {
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
      document.documentElement.lang = language
    }
    
    // Notify listeners
    this.listeners.forEach(listener => listener(language))
  }

  getTranslation(key: keyof Translation): string {
    return translations[this.currentLanguage]?.[key] || translations.en[key] || key
  }

  // Shorthand function
  t = (key: keyof Translation): string => {
    return this.getTranslation(key)
  }

  // Subscribe to language changes
  onLanguageChange(callback: (language: Language) => void) {
    this.listeners.push(callback)
    return () => {
      const index = this.listeners.indexOf(callback)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  // Get available languages
  getAvailableLanguages() {
    return [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'ar', name: 'العربية', flag: '🇸🇦' },
      { code: 'es', name: 'Español', flag: '🇪🇸' }
    ]
  }

  // Format numbers based on locale
  formatNumber(number: number): string {
    const locale = this.currentLanguage === 'ar' ? 'ar-SA' : 
                   this.currentLanguage === 'es' ? 'es-ES' : 'en-US'
    return new Intl.NumberFormat(locale).format(number)
  }

  // Format dates based on locale
  formatDate(date: Date): string {
    const locale = this.currentLanguage === 'ar' ? 'ar-SA' : 
                   this.currentLanguage === 'es' ? 'es-ES' : 'en-US'
    return new Intl.DateTimeFormat(locale, {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  // Format time based on locale
  formatTime(date: Date): string {
    const locale = this.currentLanguage === 'ar' ? 'ar-SA' : 
                   this.currentLanguage === 'es' ? 'es-ES' : 'en-US'
    return new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: this.currentLanguage !== 'ar' // 24h format for Arabic
    }).format(date)
  }
}

export const i18n = new I18nService()

// React hook for using i18n in components
export function useTranslation() {
  const t = (key: keyof Translation) => i18n.getTranslation(key)
  const currentLanguage = i18n.getCurrentLanguage()
  const setLanguage = (language: Language) => i18n.setLanguage(language)
  const availableLanguages = i18n.getAvailableLanguages()
  
  return {
    t,
    currentLanguage,
    setLanguage,
    availableLanguages,
    formatNumber: i18n.formatNumber.bind(i18n),
    formatDate: i18n.formatDate.bind(i18n),
    formatTime: i18n.formatTime.bind(i18n)
  }
}
