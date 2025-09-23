import axios from 'axios'
import { Match, LiveMatchesResponse } from '@/types/match'

const API_BASE_URL = 'https://api-football-v1.p.rapidapi.com/v3'

// API configuration with your provided API key
const apiConfig = {
  headers: {
    'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY || '2049b42ca99ac268f2a8f5b887bd8a87',
    'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
  }
}

class FootballApiService {
  private async makeRequest<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    try {
      const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
        ...apiConfig,
        params
      })
      return response.data
    } catch (error) {
      console.error('API request failed:', error)
      throw new Error('Failed to fetch data from API')
    }
  }

  // Get live matches
  async getLiveMatches(): Promise<Match[]> {
    const response = await this.makeRequest<LiveMatchesResponse>('/fixtures', {
      live: 'all'
    })
    return response.response
  }

  // Get matches by date
  async getMatchesByDate(date: string): Promise<Match[]> {
    const response = await this.makeRequest<LiveMatchesResponse>('/fixtures', {
      date
    })
    return response.response
  }

  // Get match details by ID
  async getMatchById(fixtureId: number): Promise<Match | null> {
    const response = await this.makeRequest<LiveMatchesResponse>('/fixtures', {
      id: fixtureId
    })
    return response.response[0] || null
  }

  // Get match events
  async getMatchEvents(fixtureId: number) {
    return this.makeRequest('/fixtures/events', {
      fixture: fixtureId
    })
  }

  // Get match statistics
  async getMatchStatistics(fixtureId: number) {
    return this.makeRequest('/fixtures/statistics', {
      fixture: fixtureId
    })
  }

  // Get team lineups
  async getMatchLineups(fixtureId: number) {
    return this.makeRequest('/fixtures/lineups', {
      fixture: fixtureId
    })
  }

  // Get leagues
  async getLeagues(season?: number) {
    return this.makeRequest('/leagues', {
      season: season || new Date().getFullYear()
    })
  }

  // Get team information
  async getTeam(teamId: number) {
    return this.makeRequest('/teams', {
      id: teamId
    })
  }
}

// Mock data for development when API key is not available
const mockMatches: Match[] = [
  {
    fixture: {
      id: 1,
      date: new Date().toISOString(),
      timestamp: Date.now() / 1000,
      timezone: 'UTC',
      periods: { first: 1693834800, second: 1693838400 },
      venue: { id: 1, name: 'Old Trafford', city: 'Manchester' },
      status: { long: 'Match Finished', short: 'FT', elapsed: 90 }
    },
    league: {
      id: 39,
      name: 'Premier League',
      country: 'England',
      logo: 'https://media.api-sports.io/football/leagues/39.png',
      flag: 'https://media.api-sports.io/flags/gb.svg',
      season: 2024
    },
    teams: {
      home: {
        id: 33,
        name: 'Manchester United',
        logo: 'https://media.api-sports.io/football/teams/33.png'
      },
      away: {
        id: 40,
        name: 'Liverpool',
        logo: 'https://media.api-sports.io/football/teams/40.png'
      }
    },
    goals: { home: 2, away: 1 },
    score: {
      halftime: { home: 1, away: 0 },
      fulltime: { home: 2, away: 1 }
    }
  },
  {
    fixture: {
      id: 2,
      date: new Date().toISOString(),
      timestamp: Date.now() / 1000,
      timezone: 'UTC',
      periods: { first: 1693834800 },
      venue: { id: 2, name: 'Etihad Stadium', city: 'Manchester' },
      status: { long: 'Second Half', short: '2H', elapsed: 67 }
    },
    league: {
      id: 39,
      name: 'Premier League',
      country: 'England',
      logo: 'https://media.api-sports.io/football/leagues/39.png',
      flag: 'https://media.api-sports.io/flags/gb.svg',
      season: 2024
    },
    teams: {
      home: {
        id: 50,
        name: 'Manchester City',
        logo: 'https://media.api-sports.io/football/teams/50.png'
      },
      away: {
        id: 49,
        name: 'Chelsea',
        logo: 'https://media.api-sports.io/football/teams/49.png'
      }
    },
    goals: { home: 1, away: 1 },
    score: {
      halftime: { home: 0, away: 1 },
      fulltime: { home: null, away: null }
    }
  }
]

// Create service instance with fallback to mock data
export const footballApi = new FootballApiService()

// Helper function to get matches with fallback to mock data
export async function getMatches(dateFrom?: string, dateTo?: string): Promise<Match[]> {
  // Try RapidAPI first with your provided API key
  try {
    return await footballApi.getLiveMatches()
  } catch (error) {
    console.error('Failed to fetch from RapidAPI:', error)
    
    // Fallback to mock data
    console.log('Using mock data - API request failed')
    return mockMatches
  }
}
