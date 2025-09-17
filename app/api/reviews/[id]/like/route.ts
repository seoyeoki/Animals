import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://backend-w8ew.onrender.com/api/reviews';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Post ID is required.' }, { status: 400 });
    }

    // 백엔드 API로 '좋아요' 요청을 보냅니다. (body는 비어있음)
    const response = await fetch(`${BACKEND_URL}/${id}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: '백엔드 서버 에러' }));
      throw new Error(`Backend API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Like API proxy error:', error);
    return NextResponse.json(
      { error: '좋아요 처리에 실패했습니다.' },
      { status: 500 }
    );
  }
}