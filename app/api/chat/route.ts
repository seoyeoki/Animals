// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { RECOMMEND_API_BASE } from '@/app/api-url';

const CHATBOT_API_URL = `${RECOMMEND_API_BASE}/chat`;

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let body;
    
    // 클라이언트의 요청이 URLSearchParams이거나 JSON일 수 있으므로 둘 다 처리
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      body = new URLSearchParams(formData as unknown as Record<string, string>);
    } else {
      body = await request.json();
    }

    const response = await fetch(CHATBOT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
      },
      body: contentType.includes('application/x-www-form-urlencoded') ? body.toString() : JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Backend API error: ${response.status} - ${errorText}`);
    }

    // JSON 응답일 경우 파싱, 아닐 경우 텍스트 반환
    const responseContentType = response.headers.get('content-type') || '';
    if (responseContentType.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data, { status: 200 });
    } else {
      const data = await response.text();
      return new NextResponse(data, { status: 200, headers: { 'Content-Type': responseContentType } });
    }
    
  } catch (error) {
    console.error('Chatbot proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to communicate with the chatbot service.' },
      { status: 500 }
    );
  }
}

// OPTIONS 메서드는 CORS 사전 요청(preflight request)을 처리하는 데 필요합니다.
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}