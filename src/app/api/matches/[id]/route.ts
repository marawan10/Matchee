import { NextRequest, NextResponse } from 'next/server'
import { footballApi, getMatches } from '@/lib/api/football-api'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const matchId = parseInt(params.id)
    
    // Get all matches and find the specific one
    const matches = await getMatches()
    const match = matches.find(m => m.fixture.id === matchId)
    
    if (!match) {
      return NextResponse.json(
        { success: false, error: 'Match not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: match
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch match details' },
      { status: 500 }
    )
  }
}
