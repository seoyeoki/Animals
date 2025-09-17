import { NextRequest, NextResponse } from 'next/server';
import { API_KEY_DOGS } from '@/app/api-url'; // dog-detail API와 동일한 API 키를 가져옵니다.

// 공공 데이터 API 엔드포인트
const PUBLIC_API_URL = 'https://apis.data.go.kr/1543061/abandonmentPublicService_v2/abandonmentPublic_v2';

interface Breed {
  kindCd: string;
  kindName: string;
}

export async function GET(request: NextRequest) {
  try {
    // 1. 백엔드에서 전체 품종 목록을 가져옵니다.
    const breedsResponse = await fetch('https://backend-w8ew.onrender.com/api/breeds', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!breedsResponse.ok) {
      throw new Error(`Backend API error: ${breedsResponse.status}`);
    }

    const breedsData = await breedsResponse.json();
    if (!Array.isArray(breedsData)) {
      throw new Error('Fetched breeds data is not an array.');
    }

    // 2. 각 품종 코드가 유효한지 공공 API에 병렬로 조회합니다.
    const validationPromises = breedsData.map(async (breed) => {
      // 해당 품종 코드로 등록된 동물이 있는지 확인 (1개만 조회해서 확인)
      const validationUrl = `${PUBLIC_API_URL}?serviceKey=${API_KEY_DOGS}&kind=${breed.kindCd}&_type=json&numOfRows=1`;
      
      try {
        const res = await fetch(validationUrl);
        if (!res.ok) return null; // API 요청 실패 시 해당 품종은 제외

        const data = await res.json();
        // totalCount가 0보다 크면 유효한 품종으로 간주
        if (data?.response?.body?.totalCount > 0) {
          return {
            kindCd: breed.kindCd,
            kindName: breed.knm || breed.kindName || '품종명 없음'
          };
        }
        return null; // 유효하지 않은 품종
      } catch {
        return null; // 네트워크 에러 등 발생 시 제외
      }
    });

    // 3. 모든 검증 작업이 끝날 때까지 기다립니다.
    const validatedResults = await Promise.all(validationPromises);

    // 4. null이 아닌, 즉 유효한 품종들만 필터링하여 최종 목록을 만듭니다.
    const validBreeds = validatedResults.filter((breed): breed is Breed => breed !== null);

    // 5. 필터링된 최종 품종 목록을 클라이언트에 반환합니다.
    return NextResponse.json(validBreeds, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });

  } catch (error) {
    console.error('Breeds proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch or validate breeds data' },
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