export interface Team {
  id: number
  name: string
  logo: string
  code?: string
}

export interface League {
  id: number
  name: string
  country: string
  logo: string
  flag: string
  season: number
}

export interface Venue {
  id: number
  name: string
  city: string
}

export interface Score {
  home: number | null
  away: number | null
}

export interface MatchEvent {
  time: {
    elapsed: number
    extra?: number
  }
  team: Team
  player: {
    id: number
    name: string
  }
  assist?: {
    id: number
    name: string
  }
  type: 'Goal' | 'Card' | 'subst' | 'Var'
  detail: string
  comments?: string
}

export interface MatchStats {
  team: Team
  statistics: Array<{
    type: string
    value: number | string
  }>
}

export interface Match {
  fixture: {
    id: number
    referee?: string
    timezone: string
    date: string
    timestamp: number
    periods: {
      first?: number
      second?: number
    }
    venue: Venue
    status: {
      long: string
      short: string
      elapsed?: number
    }
  }
  league: League
  teams: {
    home: Team
    away: Team
  }
  goals: {
    home: number | null
    away: number | null
  }
  score: {
    halftime: Score
    fulltime: Score
    extratime?: Score
    penalty?: Score
  }
  events?: MatchEvent[]
  statistics?: MatchStats[]
}

export interface LiveMatchesResponse {
  get: string
  parameters: Record<string, any>
  errors: any[]
  results: number
  paging: {
    current: number
    total: number
  }
  response: Match[]
}
