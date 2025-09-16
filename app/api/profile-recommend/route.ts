// app/api/profile-recommend/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { RECOMMEND_API_BASE, API_KEY_RECOMMEND } from '@/app/api-url';

const FIXED_TOP_K = 20;

interface DogDetail {
    desertionNo: string;
    kindCd: string;
    popfile: string; 
    age: string;
    weight: string;
    sexCd: string;
    neuterYn: string;
    specialMark: string;
}

export async function POST(request: NextRequest) {
  try {
    // ✨ API가 호출되면 가장 먼저 이 로그가 터미널에 찍힙니다.
    // console.log(`✅ [${new Date().toISOString()}] /api/profile-recommend API Route Called!`);

    const externalFormData = await request.formData();

    // --- STEP 1: 외부 추천 API 호출하여 ID 목록 받기 ---
    const recommendResponse = await fetch(`${RECOMMEND_API_BASE}/recommend_with_image?topk=${FIXED_TOP_K}`, {
      
      method: 'POST',
      body: externalFormData,
      headers: {
        'x-api-key': API_KEY_RECOMMEND as string,
      },
    });

    if (!recommendResponse.ok) {
      const errorText = await recommendResponse.text();
      return NextResponse.json({ error: `External API error: ${recommendResponse.status} - ${errorText}` }, { status: recommendResponse.status });
    }

    const recommendData = await recommendResponse.json();
    const desertionNumbers = recommendData.results?.map((r: { meta: { desertionNo: string } }) => r.meta.desertionNo);

    if (!desertionNumbers || desertionNumbers.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // --- STEP 2: 서버에서 직접 /api/dog-detail 병렬 호출 및 필터링 ---
    const baseUrl = request.nextUrl.origin;
    const detailPromises = desertionNumbers.map((desertionNo: string) => 
        fetch(`${baseUrl}/api/dog-detail?desertion_no=${desertionNo}`)
    );

    const settledResults = await Promise.allSettled(detailPromises);

    const validDogs: DogDetail[] = [];
    for (const result of settledResults) {
        if (result.status === 'fulfilled' && result.value.ok) {
            const dogDetail = await result.value.json();
            validDogs.push(dogDetail);
        }
    }

    // --- STEP 3: 최종 필터링된 강아지 상세 정보 목록 반환 ---
    console.log(`✅ 최종적으로 필터링된 유효 강아지 데이터 수: ${validDogs.length} 마리`);

    return NextResponse.json(validDogs, { status: 200 });

  } catch (error) {
    console.error('Profile recommend proxy error:', error);
    return NextResponse.json({ error: 'Failed to process recommendations.' }, { status: 500 });
  }
}