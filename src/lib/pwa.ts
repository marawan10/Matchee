"use client"

export class PWAService {
  private static instance: PWAService
  private deferredPrompt: any = null

  private constructor() {
    if (typeof window !== 'undefined') {
      this.init()
    }
  }

  static getInstance(): PWAService {
    if (!PWAService.instance) {
      PWAService.instance = new PWAService()
    }
    return PWAService.instance
  }

  private init() {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration)
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError)
          })
      })
    }

    // Handle install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      this.deferredPrompt = e
    })

    // Handle app installed
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed')
      this.deferredPrompt = null
    })
  }

  async installApp(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false
    }

    this.deferredPrompt.prompt()
    const { outcome } = await this.deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      this.deferredPrompt = null
      return true
    }
    
    return false
  }

  canInstall(): boolean {
    return !!this.deferredPrompt
  }

  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied'
    }

    if (Notification.permission === 'granted') {
      return 'granted'
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      return permission
    }

    return Notification.permission
  }

  async subscribeToPush(): Promise<PushSubscription | null> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return null
    }

    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
        ) as BufferSource
      })

      return subscription
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error)
      return null
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  isStandalone(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true
  }

  getInstallPrompt() {
    return this.deferredPrompt
  }
}

export const pwaService = PWAService.getInstance()
