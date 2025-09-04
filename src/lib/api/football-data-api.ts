import { Match, LiveMatchesResponse } from '@/types/match'

class FootballDataApiService {
  private async makeRequest<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    try {
      const url = new URL(`/api/football${endpoint}`, window.location.origin)
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            url.searchParams.append(key, String(value))
          }
        })
      }

      const response = await fetch(url.toString())
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'API request failed')
      }
      
      return data.data as T
    } catch (error) {
      console.error('API request failed:', error)
      throw new Error('Failed to fetch data from API')
    }
  }

  // Transform football-data.org format to our internal format
  private transformMatch(match: any): Match {
    return {
      fixture: {
        id: match.id,
        date: match.utcDate,
        timestamp: new Date(match.utcDate).getTime() / 1000,
        timezone: 'UTC',
        periods: {
          first: match.score?.halfTime ? new Date(match.utcDate).getTime() / 1000 : undefined,
          second: match.score?.fullTime ? new Date(match.utcDate).getTime() / 1000 + 2700 : undefined
        },
        venue: {
          id: 1,
          name: match.venue || 'Unknown Venue',
          city: 'Unknown'
        },
        status: {
          long: this.getStatusLong(match.status),
          short: this.getStatusShort(match.status),
          elapsed: match.minute || undefined
        }
      },
      league: {
        id: match.competition?.id || 0,
        name: match.competition?.name || 'Unknown League',
        country: match.competition?.area?.name || 'Unknown',
        logo: match.competition?.emblem || '',
        flag: match.competition?.area?.flag || '',
        season: match.season?.currentMatchday || new Date().getFullYear()
      },
      teams: {
        home: {
          id: match.homeTeam?.id || 0,
          name: match.homeTeam?.name || 'Home Team',
          logo: match.homeTeam?.crest || ''
        },
        away: {
          id: match.awayTeam?.id || 0,
          name: match.awayTeam?.name || 'Away Team',
          logo: match.awayTeam?.crest || ''
        }
      },
      goals: {
        home: match.score?.fullTime?.home ?? match.score?.halfTime?.home ?? null,
        away: match.score?.fullTime?.away ?? match.score?.halfTime?.away ?? null
      },
      score: {
        halftime: {
          home: match.score?.halfTime?.home ?? null,
          away: match.score?.halfTime?.away ?? null
        },
        fulltime: {
          home: match.score?.fullTime?.home ?? null,
          away: match.score?.fullTime?.away ?? null
        }
      }
    }
  }

  private getStatusShort(status: string): string {
    switch (status) {
      case 'SCHEDULED': return 'NS'
      case 'TIMED': return 'NS'
      case 'IN_PLAY': return '1H'
      case 'PAUSED': return 'HT'
      case 'FINISHED': return 'FT'
      case 'SUSPENDED': return 'SUSP'
      case 'CANCELLED': return 'CANC'
      default: return status
    }
  }

  private getStatusLong(status: string): string {
    switch (status) {
      case 'SCHEDULED': return 'Not Started'
      case 'TIMED': return 'Not Started'
      case 'IN_PLAY': return 'In Play'
      case 'PAUSED': return 'Half Time'
      case 'FINISHED': return 'Match Finished'
      case 'SUSPENDED': return 'Suspended'
      case 'CANCELLED': return 'Cancelled'
      default: return status
    }
  }

  // Get matches for today
  async getTodayMatches(): Promise<Match[]> {
    const today = new Date().toISOString().split('T')[0]
    const response = await this.makeRequest<any>(`/matches`, {
      dateFrom: today,
      dateTo: today
    })
    return response.matches?.map((match: any) => this.transformMatch(match)) || []
  }

  // Get matches by date range
  async getMatchesByDateRange(dateFrom: string, dateTo: string): Promise<Match[]> {
    const response = await this.makeRequest<any>(`/matches`, {
      dateFrom,
      dateTo
    })
    return response.matches?.map((match: any) => this.transformMatch(match)) || []
  }

  // Get matches for a specific competition
  async getCompetitionMatches(competitionId: number): Promise<Match[]> {
    const response = await this.makeRequest<any>(`/competitions/${competitionId}/matches`)
    return response.matches?.map((match: any) => this.transformMatch(match)) || []
  }

  // Get match by ID
  async getMatchById(matchId: number): Promise<Match | null> {
    try {
      const response = await this.makeRequest<any>(`/matches/${matchId}`)
      return this.transformMatch(response)
    } catch {
      return null
    }
  }

  async getMatches(dateFrom?: string, dateTo?: string): Promise<Match[]> {
    try {
      const params: Record<string, any> = {}
      if (dateFrom) params.dateFrom = dateFrom
      if (dateTo) params.dateTo = dateTo
      
      const endpoint = dateFrom || dateTo ? '/matches/date' : '/matches'
      const response = await this.makeRequest<any>(endpoint, params)
      return response.matches?.map((match: any) => this.transformMatch(match)) || []
    } catch (error) {
      console.warn('Failed to fetch matches, using mock data:', error)
      return enhancedMockMatches
    }
  }

  // Get competitions
  async getCompetitions() {
    return this.makeRequest('/competitions')
  }

  // Get team information
  async getTeam(teamId: number) {
    return this.makeRequest(`/teams/${teamId}`)
  }
}

// Enhanced mock data with more realistic matches
const enhancedMockMatches: Match[] = [
  {
    fixture: {
      id: 1,
      date: new Date().toISOString(),
      timestamp: Date.now() / 1000,
      timezone: 'UTC',
      periods: { first: Date.now() / 1000 - 2700, second: Date.now() / 1000 },
      venue: { id: 1, name: 'Old Trafford', city: 'Manchester' },
      status: { long: 'Second Half', short: '2H', elapsed: 67 }
    },
    league: {
      id: 39,
      name: 'Premier League',
      country: 'England',
      logo: 'https://crests.football-data.org/PL.png',
      flag: 'https://crests.football-data.org/770.svg',
      season: 2024
    },
    teams: {
      home: {
        id: 33,
        name: 'Manchester United',
        logo: 'https://crests.football-data.org/66.png'
      },
      away: {
        id: 40,
        name: 'Liverpool',
        logo: 'https://crests.football-data.org/64.png'
      }
    },
    goals: { home: 2, away: 1 },
    score: {
      halftime: { home: 1, away: 0 },
      fulltime: { home: null, away: null }
    }
  },
  {
    fixture: {
      id: 2,
      date: new Date().toISOString(),
      timestamp: Date.now() / 1000,
      timezone: 'UTC',
      periods: { first: Date.now() / 1000 - 2700 },
      venue: { id: 2, name: 'Etihad Stadium', city: 'Manchester' },
      status: { long: 'First Half', short: '1H', elapsed: 23 }
    },
    league: {
      id: 39,
      name: 'Premier League',
      country: 'England',
      logo: 'https://crests.football-data.org/PL.png',
      flag: 'https://crests.football-data.org/770.svg',
      season: 2024
    },
    teams: {
      home: {
        id: 50,
        name: 'Manchester City',
        logo: 'https://crests.football-data.org/65.png'
      },
      away: {
        id: 49,
        name: 'Chelsea',
        logo: 'https://crests.football-data.org/61.png'
      }
    },
    goals: { home: 0, away: 0 },
    score: {
      halftime: { home: null, away: null },
      fulltime: { home: null, away: null }
    }
  },
  {
    fixture: {
      id: 3,
      date: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
      timestamp: (Date.now() + 3600000) / 1000,
      timezone: 'UTC',
      periods: {},
      venue: { id: 3, name: 'Emirates Stadium', city: 'London' },
      status: { long: 'Not Started', short: 'NS' }
    },
    league: {
      id: 39,
      name: 'Premier League',
      country: 'England',
      logo: 'https://crests.football-data.org/PL.png',
      flag: 'https://crests.football-data.org/770.svg',
      season: 2024
    },
    teams: {
      home: {
        id: 57,
        name: 'Arsenal',
        logo: 'https://crests.football-data.org/57.png'
      },
      away: {
        id: 73,
        name: 'Tottenham',
        logo: 'https://crests.football-data.org/73.png'
      }
    },
    goals: { home: null, away: null },
    score: {
      halftime: { home: null, away: null },
      fulltime: { home: null, away: null }
    }
  }
]

// Create service instance
export const footballDataApi = new FootballDataApiService()

// Helper function to get matches from football-data.org
export const getFootballDataMatches = (dateFrom?: string, dateTo?: string) => footballDataApi.getMatches(dateFrom, dateTo)
