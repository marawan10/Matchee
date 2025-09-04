import { NextRequest, NextResponse } from 'next/server'
import { footballDataApi } from '@/lib/api/football-data-api'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const matchId = parseInt(params.id)
    const match = await footballDataApi.getMatchById(matchId)
    
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
