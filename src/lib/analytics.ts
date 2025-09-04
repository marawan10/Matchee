"use client"

interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  timestamp: Date
}

interface UserSession {
  id: string
  startTime: Date
  endTime?: Date
  pageViews: number
  events: AnalyticsEvent[]
}

class AnalyticsService {
  private static instance: AnalyticsService
  private currentSession: UserSession | null = null
  private events: AnalyticsEvent[] = []

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initSession()
      this.setupEventListeners()
    }
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService()
    }
    return AnalyticsService.instance
  }

  private initSession() {
    this.currentSession = {
      id: this.generateSessionId(),
      startTime: new Date(),
      pageViews: 0,
      events: []
    }
  }

  private setupEventListeners() {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.track('page_hidden')
      } else {
        this.track('page_visible')
      }
    })

    // Track page unload
    window.addEventListener('beforeunload', () => {
      this.endSession()
    })

    // Track clicks on important elements
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      if (target.closest('[data-analytics]')) {
        const element = target.closest('[data-analytics]') as HTMLElement
        this.track('element_click', {
          element: element.dataset.analytics,
          text: element.textContent?.trim()
        })
      }
    })
  }

  track(eventName: string, properties?: Record<string, any>) {
    const event: AnalyticsEvent = {
      name: eventName,
      properties,
      timestamp: new Date()
    }

    this.events.push(event)
    if (this.currentSession) {
      this.currentSession.events.push(event)
    }

    // Send to analytics service (in production, this would be Google Analytics, etc.)
    this.sendEvent(event)
  }

  trackPageView(path: string) {
    if (this.currentSession) {
      this.currentSession.pageViews++
    }
    
    this.track('page_view', { path })
  }

  trackMatchView(matchId: number, teams: { home: string, away: string }) {
    this.track('match_view', {
      matchId,
      homeTeam: teams.home,
      awayTeam: teams.away
    })
  }

  trackFavoriteToggle(teamId: number, teamName: string, action: 'add' | 'remove') {
    this.track('favorite_toggle', {
      teamId,
      teamName,
      action
    })
  }

  trackSearch(query: string, resultsCount: number) {
    this.track('search', {
      query,
      resultsCount
    })
  }

  trackNotificationPermission(granted: boolean) {
    this.track('notification_permission', { granted })
  }

  trackPWAInstall(success: boolean) {
    this.track('pwa_install', { success })
  }

  trackLanguageChange(from: string, to: string) {
    this.track('language_change', { from, to })
  }

  trackThemeChange(theme: string) {
    this.track('theme_change', { theme })
  }

  private sendEvent(event: AnalyticsEvent) {
    // In production, send to your analytics service
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', event)
    }

    // Example: Send to Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.name, {
        ...event.properties,
        timestamp: event.timestamp.toISOString()
      })
    }
  }

  private endSession() {
    if (this.currentSession) {
      this.currentSession.endTime = new Date()
      this.track('session_end', {
        duration: this.currentSession.endTime.getTime() - this.currentSession.startTime.getTime(),
        pageViews: this.currentSession.pageViews,
        eventCount: this.currentSession.events.length
      })
    }
  }

  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // Get analytics data for admin dashboard
  getAnalyticsData() {
    return {
      currentSession: this.currentSession,
      totalEvents: this.events.length,
      recentEvents: this.events.slice(-10)
    }
  }

  // Performance monitoring
  trackPerformance(metric: string, value: number, unit: string = 'ms') {
    this.track('performance_metric', {
      metric,
      value,
      unit
    })
  }

  // Error tracking
  trackError(error: Error, context?: string) {
    this.track('error', {
      message: error.message,
      stack: error.stack,
      context
    })
  }
}

export const analytics = AnalyticsService.getInstance()

// React hook for analytics
export function useAnalytics() {
  return {
    track: analytics.track.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackMatchView: analytics.trackMatchView.bind(analytics),
    trackFavoriteToggle: analytics.trackFavoriteToggle.bind(analytics),
    trackSearch: analytics.trackSearch.bind(analytics),
    trackNotificationPermission: analytics.trackNotificationPermission.bind(analytics),
    trackPWAInstall: analytics.trackPWAInstall.bind(analytics),
    trackLanguageChange: analytics.trackLanguageChange.bind(analytics),
    trackThemeChange: analytics.trackThemeChange.bind(analytics),
    trackPerformance: analytics.trackPerformance.bind(analytics),
    trackError: analytics.trackError.bind(analytics)
  }
}
