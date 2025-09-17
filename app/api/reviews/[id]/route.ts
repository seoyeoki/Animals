import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://backend-w8ew.onrender.com/api/reviews';

// GET 함수는 request와 { params }를 인자로 받습니다.
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params; // URL에서 동적 파라미터 [id] 값을 가져옵니다.

    if (!id) {
      return NextResponse.json({ error: 'Review ID is required.' }, { status: 400 });
    }

    // 백엔드 API로 단건 데이터를 요청합니다.
    const response = await fetch(`${BACKEND_URL}/${id}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown backend error' }));
      throw new Error(`Backend API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();

    // 받은 데이터를 클라이언트에 전달합니다.
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Review detail proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch review detail.' },
      { status: 500 }
    );
  }
}