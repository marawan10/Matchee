import { NextRequest, NextResponse } from 'next/server'
import { getMatches } from '@/lib/api/football-api'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const live = searchParams.get('live')
    
    const matches = await getMatches()
    
    // Filter matches based on query parameters
    let filteredMatches = matches
    
    if (live === 'true') {
      filteredMatches = matches.filter(match => 
        ['1H', '2H', 'HT'].includes(match.fixture.status.short)
      )
    }
    
    if (date) {
      const targetDate = new Date(date).toDateString()
      filteredMatches = filteredMatches.filter(match => 
        new Date(match.fixture.date).toDateString() === targetDate
      )
    }
    
    return NextResponse.json({
      success: true,
      data: filteredMatches,
      count: filteredMatches.length
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch matches' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, matchId, userId } = body
    
    // Handle match-related actions (favorites, notifications, etc.)
    switch (action) {
      case 'favorite':
        // In a real app, this would save to database
        return NextResponse.json({
          success: true,
          message: 'Match added to favorites'
        })
      
      case 'unfavorite':
        return NextResponse.json({
          success: true,
          message: 'Match removed from favorites'
        })
      
      case 'subscribe_notifications':
        return NextResponse.json({
          success: true,
          message: 'Subscribed to match notifications'
        })
      
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
