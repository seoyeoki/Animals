'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';

// 리뷰 데이터 타입 정의
interface Review {
  id: number;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
}

// API 응답 타입 정의 (페이지네이션 정보 포함)
interface ApiResponse {
  content: Review[];
  totalPages: number;
  totalElements: number;
  number: number; // 현재 페이지 번호
}

export default function ReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 검색 및 페이지네이션 상태
  const [keyword, setKeyword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sort, setSort] = useState('createdAt,desc');

  // 데이터 불러오기 함수
  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        keyword: searchTerm,
        page: page.toString(),
        size: '9',
        sort,
      });

      const response = await fetch(`/api/reviews?${params.toString()}`);
      if (!response.ok) {
        throw new Error('리뷰를 불러오는 데 실패했습니다.');
      }
      const data: ApiResponse = await response.json();
      setReviews(data.content);
      setTotalPages(data.totalPages);

    // ✨✨✨ 수정된 부분: try...catch 구문의 문법 오류를 수정했습니다. ✨✨✨
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [page, searchTerm, sort]);

  // 상태 변경 시 데이터 다시 불러오기
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(0);
    setSearchTerm(keyword);
  };
  
  // 날짜 포맷 변경 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>입양 후기</h1>
      <p className={styles.subtitle}>따뜻한 마음이 모여 만들어진 행복한 이야기들을 만나보세요.</p>
      
      <div className={styles.controlsContainer}>
        <form onSubmit={handleSearch} className={styles.searchBar}>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="제목 또는 내용으로 검색"
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>검색</button>
        </form>
        <div className={styles.actions}>
          <select value={sort} onChange={(e) => { setPage(0); setSort(e.target.value); }} className={styles.sortSelect}>
            <option value="createdAt,desc">최신순</option>
            <option value="likeCount,desc">좋아요순</option>
          </select>
        </div>
      </div>

      {isLoading && <div className={styles.loading}>리뷰를 불러오는 중...</div>}
      {error && <div className={styles.error}>{error}</div>}

      {!isLoading && !error && (
        <>
          <div className={styles.reviewGrid}>
            {reviews.map((review) => (
              <div key={review.id} className={styles.reviewCard} onClick={() => router.push(`/reviews/${review.id}`)}>
                <h3 className={styles.cardTitle}>{review.title}</h3>
                <p className={styles.cardContent}>{review.content}</p>
                <div className={styles.cardFooter}>
                  <div className={styles.cardMeta}>
                    <span>❤️ {review.likeCount}</span>
                    <span>💬 {review.commentCount}</span>
                  </div>
                  <span className={styles.cardDate}>{formatDate(review.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>

          {reviews.length === 0 && <div className={styles.noResults}>작성된 후기가 없습니다.</div>}

          <div className={styles.pagination}>
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
              이전
            </button>
            <span>{page + 1} / {totalPages > 0 ? totalPages : 1}</span>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>
              다음
            </button>
          </div>

          <div className={styles.writeButtonContainer}>
            <button onClick={() => router.push('/reviews/new')} className={styles.writeButton}>글쓰기</button>
          </div>
        </>
      )}
    </main>
  );
}