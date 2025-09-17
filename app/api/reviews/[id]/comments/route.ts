import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://backend-w8ew.onrender.com/api/reviews';

// --- GET: 특정 게시물의 댓글 목록 조회 ---
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      const { id } = params;
      if (!id) {
        return NextResponse.json({ error: 'Post ID is required.' }, { status: 400 });
      }
  
      const response = await fetch(`${BACKEND_URL}/${id}/comments`);
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Backend API error: ${response.status} - ${errorText}`);
        return NextResponse.json(
          { error: `백엔드 서버로부터 댓글을 가져올 수 없습니다. (상태: ${response.status})` },
          { status: response.status }
        );
      }
  
      // ✨✨✨ 중요: 백엔드 응답(객체)에서 실제 댓글 배열(content)을 추출합니다. ✨✨✨
      const responseData = await response.json();
      const comments = responseData.content; // .content 프로퍼티에 접근
  
      if (!Array.isArray(comments)) {
        console.error("[API] Fetched data's .content property is not an array:", responseData);
        throw new Error("백엔드 응답 형식이 올바르지 않습니다.");
      }
      
      console.log(`[API] Post ID ${id} | Fetched comments count:`, comments.length);
      
      // 프론트엔드에는 순수한 댓글 배열만 전달합니다.
      return NextResponse.json(comments, { status: 200 });
  
    } catch (error) {
      console.error('Comment fetch proxy error:', error);
      return NextResponse.json({ error: '댓글 목록을 불러오는 중 서버에 문제가 발생했습니다.' }, { status: 500 });
    }
  }

// --- POST: 새 댓글 작성 ---
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { content } = body;

    if (!id || !content || !content.trim()) {
      return NextResponse.json({ error: 'Post ID와 내용이 필요합니다.' }, { status: 400 });
    }

    const response = await fetch(`${BACKEND_URL}/${id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: '백엔드 서버 에러' }));
      throw new Error(`Backend API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const newComment = await response.json();
    return NextResponse.json(newComment, { status: 201 });

  } catch (error) {
    console.error('Comment creation proxy error:', error);
    return NextResponse.json({ error: '댓글 등록에 실패했습니다.' }, { status: 500 });
  }
}