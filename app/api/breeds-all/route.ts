import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 백엔드에서 전체 품종 목록을 가져옵니다.
    const breedsResponse = await fetch('https://backend-w8ew.onrender.com/api/breeds', {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });

    if (!breedsResponse.ok) {
      throw new Error(`Backend API error: ${breedsResponse.status}`);
    }

    const breedsData = await breedsResponse.json();
    
    if (!Array.isArray(breedsData)) {
      throw new Error('Fetched breeds data is not an array.');
    }

    // 전체 품종 데이터를 그대로 반환
    return NextResponse.json(breedsData, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });

  } catch (error) {
    console.error('Breeds-all proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch breeds data' },
      { status: 500 }
    );
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
  });
}
