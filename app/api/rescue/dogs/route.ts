import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const kindCd = searchParams.get('kindCd')
    const size = searchParams.get('size')

    // URL 파라미터 구성
    const params = new URLSearchParams()
    if (page) params.append('page', page)
    if (kindCd) params.append('kindCd', kindCd)
    if (size) params.append('size', size)

    const backendUrl = `https://backend-w8ew.onrender.com/api/rescue/dogs${params.toString() ? `?${params.toString()}` : ''}`
    
    console.log('Backend URL:', backendUrl)
    console.log('Filter params:', { page, kindCd, size })
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`)
    }

    const data = await response.json()
    
    return NextResponse.json(data, {
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
      { error: 'Failed to fetch dogs data' },
      { status: 500 }
    )
  }
}
