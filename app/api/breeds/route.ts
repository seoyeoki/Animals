import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const response = await fetch('https://backend-w8ew.onrender.com/api/breeds', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`)
    }

    const data = await response.json()
    
    // 백엔드 응답을 프론트엔드 형식으로 변환
    const transformedData = Array.isArray(data) ? data.map(breed => ({
      kindCd: breed.kindCd,
      kindName: breed.knm || breed.kindName || '품종명 없음'
    })) : data
    
    return NextResponse.json(transformedData, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch breeds data' },
      { status: 500 }
    )
  }
}
