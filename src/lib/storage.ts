// Local storage utilities for user preferences and favorites

export interface UserPreferences {
  favoriteTeams: number[]
  favoriteLeagues: number[]
  theme: 'light' | 'dark' | 'system'
  language: 'en' | 'ar' | 'es'
  notifications: {
    goals: boolean
    cards: boolean
    kickoff: boolean
    fulltime: boolean
  }
}

const DEFAULT_PREFERENCES: UserPreferences = {
  favoriteTeams: [],
  favoriteLeagues: [],
  theme: 'system',
  language: 'en',
  notifications: {
    goals: true,
    cards: true,
    kickoff: true,
    fulltime: true
  }
}

class StorageService {
  private readonly PREFERENCES_KEY = 'matchee_preferences'
  private readonly FAVORITES_KEY = 'matchee_favorites'

  // User Preferences
  getPreferences(): UserPreferences {
    if (typeof window === 'undefined') return DEFAULT_PREFERENCES
    
    try {
      const stored = localStorage.getItem(this.PREFERENCES_KEY)
      return stored ? { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) } : DEFAULT_PREFERENCES
    } catch {
      return DEFAULT_PREFERENCES
    }
  }

  setPreferences(preferences: Partial<UserPreferences>): void {
    if (typeof window === 'undefined') return
    
    const current = this.getPreferences()
    const updated = { ...current, ...preferences }
    localStorage.setItem(this.PREFERENCES_KEY, JSON.stringify(updated))
  }

  // Favorite Teams
  getFavoriteTeams(): number[] {
    return this.getPreferences().favoriteTeams
  }

  addFavoriteTeam(teamId: number): void {
    const preferences = this.getPreferences()
    if (!preferences.favoriteTeams.includes(teamId)) {
      preferences.favoriteTeams.push(teamId)
      this.setPreferences(preferences)
    }
  }

  removeFavoriteTeam(teamId: number): void {
    const preferences = this.getPreferences()
    preferences.favoriteTeams = preferences.favoriteTeams.filter(id => id !== teamId)
    this.setPreferences(preferences)
  }

  isFavoriteTeam(teamId: number): boolean {
    return this.getFavoriteTeams().includes(teamId)
  }

  // Favorite Leagues
  getFavoriteLeagues(): number[] {
    return this.getPreferences().favoriteLeagues
  }

  addFavoriteLeague(leagueId: number): void {
    const preferences = this.getPreferences()
    if (!preferences.favoriteLeagues.includes(leagueId)) {
      preferences.favoriteLeagues.push(leagueId)
      this.setPreferences(preferences)
    }
  }

  removeFavoriteLeague(leagueId: number): void {
    const preferences = this.getPreferences()
    preferences.favoriteLeagues = preferences.favoriteLeagues.filter(id => id !== leagueId)
    this.setPreferences(preferences)
  }

  isFavoriteLeague(leagueId: number): boolean {
    return this.getFavoriteLeagues().includes(leagueId)
  }

  // Theme
  getTheme(): 'light' | 'dark' | 'system' {
    return this.getPreferences().theme
  }

  setTheme(theme: 'light' | 'dark' | 'system'): void {
    this.setPreferences({ theme })
  }

  // Language
  getLanguage(): 'en' | 'ar' | 'es' {
    return this.getPreferences().language
  }

  setLanguage(language: 'en' | 'ar' | 'es'): void {
    this.setPreferences({ language })
  }

  // Notifications
  getNotificationSettings() {
    return this.getPreferences().notifications
  }

  setNotificationSettings(notifications: Partial<UserPreferences['notifications']>): void {
    const current = this.getPreferences()
    this.setPreferences({
      notifications: { ...current.notifications, ...notifications }
    })
  }

  // Clear all data
  clearAll(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(this.PREFERENCES_KEY)
    localStorage.removeItem(this.FAVORITES_KEY)
  }
}

export const storageService = new StorageService()
