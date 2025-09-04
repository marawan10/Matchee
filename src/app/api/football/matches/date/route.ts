import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const API_KEY = process.env.FOOTBALL_DATA_API_KEY || '88b2ca93278644009512015b21644aa1'
const API_BASE_URL = 'https://api.football-data.org/v4'

const apiConfig = {
  headers: {
    'X-Auth-Token': API_KEY
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    
    console.log('🔥 Server-side API call for matches by date:', { dateFrom, dateTo })
    console.log('🔑 Using API key:', API_KEY ? 'Present' : 'Missing')
    
    const params: any = {}
    if (dateFrom) params.dateFrom = dateFrom
    if (dateTo) params.dateTo = dateTo
    
    console.log('📋 Request params:', params)
    
    const response = await axios.get(`${API_BASE_URL}/matches`, {
      ...apiConfig,
      params
    })
    
    console.log('📊 Raw API response status:', response.status)
    
    console.log(`✅ Successfully fetched ${response.data.matches?.length || 0} matches for date range`)
    
    return NextResponse.json({
      success: true,
      data: response.data
    })
  } catch (error: any) {
    console.error('❌ Server-side API error:', error.response?.data || error.message)
    console.error('❌ Full error object:', error)
    
    // Return mock data instead of error for development
    const mockMatches = {
      matches: [
        {
          fixture: {
            id: 1001,
            date: new Date().toISOString(),
            timestamp: Date.now() / 1000,
            timezone: 'UTC',
            periods: { first: Date.now() / 1000 - 2700, second: Date.now() / 1000 },
            venue: { id: 1, name: 'Wembley Stadium', city: 'London' },
            status: { long: 'Match Finished', short: 'FT', elapsed: 90 }
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
            fulltime: { home: 2, away: 1 }
          }
        }
      ]
    }
    
    return NextResponse.json({
      success: true,
      data: mockMatches,
      note: 'Using mock data due to API error'
    })
  }
}
