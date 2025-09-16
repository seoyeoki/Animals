// app/api/recommend-with-survey/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { RECOMMEND_API_BASE, API_KEY_RECOMMEND } from '@/app/api-url';

const EXTERNAL_SURVEY_API = `${RECOMMEND_API_BASE}/recommend_with_survey`;

export async function POST(request: NextRequest) {
  try {
    // 1. page.tsx로부터 FormData를 그대로 받습니다.
    const formData = await request.formData();

    // 2. 외부 API로 요청을 보냅니다.
    const response = await fetch(EXTERNAL_SURVEY_API, {
      method: 'POST',
      body: formData,
      // ✨ 요청하신 대로 헤더에 API 키를 포함합니다.
      headers: {
        'x-api-key': API_KEY_RECOMMEND as string,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      // 외부 API의 에러를 그대로 클라이언트에 전달합니다.
      return NextResponse.json(
        { error: `External API error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // 3. 외부 API의 결과를 클라이언트에 최종 반환합니다.
    return NextResponse.json(data, {
      status: 200,
      headers: { // CORS 헤더 추가
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Survey recommend proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to get survey recommendations.' },
      { status: 500 }
    );
  }
}

// CORS Preflight 요청을 처리하기 위한 OPTIONS 핸들러
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}