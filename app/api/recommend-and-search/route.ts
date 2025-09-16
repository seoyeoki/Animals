import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // 필수 파라미터 검증
    const userText = formData.get('user_text')
    const image = formData.get('image')
    
    if (!userText || typeof userText !== 'string' || !userText.trim()) {
      return NextResponse.json(
        { error: 'user_text는 필수이며 비어있을 수 없습니다.' },
        { status: 400 }
      )
    }
    
    if (!image || !(image instanceof File)) {
      return NextResponse.json(
        { error: 'image 파일은 필수입니다.' },
        { status: 400 }
      )
    }
    
    // similarity_api로 요청 전달
    const response = await fetch('${RECOMMEND_API_BASE}/recommend-and-search', {
      method: 'POST',
      body: formData, // FormData를 그대로 전달
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      console.error('Similarity API error:', response.status, errorData)
      return NextResponse.json(
        { error: errorData.error || 'Failed to process request' },
        { status: response.status }
      )
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
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
