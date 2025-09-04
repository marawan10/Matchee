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
    
    console.log('🔥 Server-side API call to football-data.org')
    
    const params: any = {}
    if (dateFrom) params.dateFrom = dateFrom
    if (dateTo) params.dateTo = dateTo
    
    const response = await axios.get(`${API_BASE_URL}/matches`, {
      ...apiConfig,
      params
    })
    
    console.log(`✅ Successfully fetched ${response.data.matches?.length || 0} matches`)
    
    return NextResponse.json({
      success: true,
      data: response.data
    })
  } catch (error: any) {
    console.error('❌ Server-side API error:', error.response?.data || error.message)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch matches',
        details: error.response?.data || error.message
      },
      { status: 500 }
    )
  }
}
