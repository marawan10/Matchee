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
    console.log('🔥 Server-side API call for competitions')
    
    const response = await axios.get(`${API_BASE_URL}/competitions`, apiConfig)
    
    console.log(`✅ Successfully fetched ${response.data.competitions?.length || 0} competitions`)
    
    return NextResponse.json({
      success: true,
      data: response.data
    })
  } catch (error: any) {
    console.error('❌ Server-side API error:', error.response?.data || error.message)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch competitions',
        details: error.response?.data || error.message
      },
      { status: 500 }
    )
  }
}
