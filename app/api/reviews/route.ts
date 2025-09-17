import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://backend-w8ew.onrender.com/api/reviews';

// --- GET: 리뷰 목록 조회 ---
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword') || '';
    const page = searchParams.get('page') || '0';
    const size = searchParams.get('size') || '9';
    const sort = searchParams.get('sort') || 'createdAt,desc';

    const targetUrl = `${BACKEND_URL}?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}&sort=${sort}`;

    const response = await fetch(targetUrl);

    if (!response.ok) {
      throw new Error('Backend API error while fetching list');
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Review list proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch review list.' }, { status: 500 });
  }
}

// --- POST: 새 리뷰 작성 ---
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json({ error: '제목과 내용을 모두 입력해주세요.' }, { status: 400 });
    }

    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content }),
    });

    if (!response.ok) {
      throw new Error('Backend API error while creating review');
    }

    const newReview = await response.json();
    return NextResponse.json(newReview, { status: 201 });

  } catch (error) {
    console.error('New review creation error:', error);
    return NextResponse.json({ error: '후기 등록에 실패했습니다.' }, { status: 500 });
  }
}

// CORS 사전 요청(preflight) 처리를 위한 OPTIONS 메서드
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}