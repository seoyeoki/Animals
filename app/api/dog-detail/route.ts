// app/api/dog-detail/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { API_KEY_DOGS } from '@/app/api-url';

const PUBLIC_API_URL = 'https://apis.data.go.kr/1543061/abandonmentPublicService_v2/abandonmentPublic_v2';

interface Breed {
  kindCd: string;
  kindName: string;
}

export async function GET(request: NextRequest) {
  try {
    let breedsList: Breed[] = [];
    try {
      const breedsApiUrl = `${request.nextUrl.origin}/api/breeds`;
      const breedsResponse = await fetch(breedsApiUrl);
      if (breedsResponse.ok) {
        breedsList = await breedsResponse.json();
      }
    } catch (e) {
      console.error("Initial fetch for breeds failed, proceeding without it.", e);
    }

    const { searchParams } = new URL(request.url);
    const desertionNo = searchParams.get('desertion_no');

    if (!desertionNo) {
      return NextResponse.json({ error: 'Missing desertion_no parameter' }, { status: 400 });
    }

    const apiUrl = `${PUBLIC_API_URL}?serviceKey=${API_KEY_DOGS}&desertionNo=${desertionNo}&_type=json`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Backend API error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    let item = data?.response?.body?.items?.item?.[0];

    // ✨✨✨ 요청하신 ID 검증 로직 ✨✨✨
    // 요청한 ID와 실제 응답받은 ID가 다른지 확인합니다.
    if (item && item.desertionNo !== desertionNo) {
      console.warn(`[ID 불일치] 요청: ${desertionNo}, 응답: ${item.desertionNo}. 유효하지 않은 데이터로 처리합니다.`);
      // ID가 다르면 item을 null로 만들어 아래의 if(!item)에서 404를 반환하도록 합니다.
      item = null;
    }

    console.log('🐾 Fetched item from public API:', item);

    if (!item) {
        return NextResponse.json({ error: 'Dog detail not found in API response.' }, { status: 404 });
    }
    
    let kindName = item.kindCd;
    const foundBreed = breedsList.find(b => b.kindCd === item.kindCd);
    if (foundBreed) {
      kindName = foundBreed.kindName;
    }

    const animalDataForPage = {
      desertionNo: item.desertionNo,
      kindCd: item.kindCd,
      kindName: kindName,
      sexCd: item.sexCd,
      age: item.age,
      weight: item.weight,
      specialMark: item.specialMark,
      happenPlace: item.happenPlace,
      processState: item.processState,
      careNm: item.careNm,
      careTel: item.careTel,
      noticeSdt: item.noticeSdt,
      noticeEdt: item.noticeEdt,
      size: item.size,
      filename: item.filename,
      popfile1: item.popfile
    };
    
    return NextResponse.json(animalDataForPage, { status: 200 });

  } catch (error) {
    console.error('Dog detail proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dog details from public API.' },
      { status: 500 }
    );
  }
}