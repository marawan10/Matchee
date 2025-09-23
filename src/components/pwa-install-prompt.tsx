"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { pwaService } from '@/lib/pwa'
import { useTranslation } from '@/lib/i18n'

export function PWAInstallPrompt() {
  const { t } = useTranslation()
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)

  useEffect(() => {
    const checkInstallability = () => {
      if (pwaService.canInstall() && !pwaService.isStandalone()) {
        setShowPrompt(true)
      }
    }

    // Check after a delay to ensure PWA service is initialized
    const timer = setTimeout(checkInstallability, 2000)
    
    return () => clearTimeout(timer)
  }, [])

  const handleInstall = async () => {
    setIsInstalling(true)
    try {
      const installed = await pwaService.installApp()
      if (installed) {
        setShowPrompt(false)
      }
    } catch (error) {
      console.error('Installation failed:', error)
    } finally {
      setIsInstalling(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Don't show again for this session
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pwa-prompt-dismissed', 'true')
    }
  }

  // Don't show if already dismissed in this session
  if (typeof window !== 'undefined' && sessionStorage.getItem('pwa-prompt-dismissed')) {
    return null
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80"
        >
          <Card className="border-primary/20 bg-background/95 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Smartphone className="h-5 w-5 text-primary" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground">
                    Install Matchee
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Get the full experience with offline access and push notifications
                  </p>
                  
                  <div className="flex items-center space-x-2 mt-3">
                    <Button
                      size="sm"
                      onClick={handleInstall}
                      disabled={isInstalling}
                      className="h-8 px-3 text-xs"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      {isInstalling ? 'Installing...' : 'Install'}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDismiss}
                      className="h-8 px-2"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
