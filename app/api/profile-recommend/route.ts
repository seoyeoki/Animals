import { NextRequest, NextResponse } from 'next/server';
import { RECOMMEND_API_BASE, API_KEY_RECOMMEND } from '@/app/api-url';

const EXTERNAL_API_URL = `${RECOMMEND_API_BASE}/recommend_with_image`;

export async function POST(request: NextRequest) {
  try {
    const incomingFormData = await request.formData();

    // ✨ 디버깅을 위한 로그 추가
    console.log('Received form data keys:', Array.from(incomingFormData.keys()));
    
    // ✨ 1. 프론트엔드에서 보낸 데이터의 내용물을 명시적으로 꺼냅니다.
    const profileText = incomingFormData.get('profile');
    const refImage = incomingFormData.get('ref_image');

    console.log('Profile text:', profileText);
    console.log('Ref image:', refImage ? 'File received' : 'No file');

    // ✨ 2. 내용물이 잘 도착했는지 확인합니다. (이 부분이 없으면 422 에러의 원인이 됩니다)
    if (!profileText) {
      console.log('Missing profileText field');
      return NextResponse.json(
        { error: "API route did not receive 'profile' field." },
        { status: 400 }
      );
    }

    // ✨ 3. 외부 API로 보낼 새로운 FormData를 만듭니다.
    const outgoingFormData = new FormData();
    outgoingFormData.append('profile', profileText);
    if (refImage) {
      outgoingFormData.append('ref_image', refImage);
    }
    
    const topk = request.nextUrl.searchParams.get('topk') || '5';
    const requestUrl = `${EXTERNAL_API_URL}?topk=${topk}`;

    const response = await fetch(requestUrl, {
      method: 'POST',
      // ✨ 4. 새로 만든 깨끗한 FormData를 body에 담아 보냅니다.
      body: outgoingFormData,
      headers: {
        'x-api-key': API_KEY_RECOMMEND as string,
        'ngrok-skip-browser-warning': 'true', // ngrok 브라우저 경고 스킵
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `External API error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Profile recommend proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to get profile recommendations.' },
      { status: 500 }
    );
  }
}