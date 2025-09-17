'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './page.module.css';

// 타입 정의
interface Review {
  id: number;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  id: number;
  content: string;
  createdAt: string;
}

export default function ReviewDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [review, setReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 댓글 관련 상태
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  
  // 좋아요 관련 상태
  const [isLiked, setIsLiked] = useState(false);

  // 댓글 목록 불러오기 함수
  const fetchComments = useCallback(async () => {
    if (!id) return;
    try {
      const response = await fetch(`/api/reviews/${id}/comments`);
      if (!response.ok) {
        throw new Error('댓글을 불러오지 못했습니다.');
      }
      const data: Comment[] = await response.json();
      setComments(data);
    } catch (err) {
      console.error(err);
      setCommentError('댓글을 불러오는 데 실패했습니다.');
    }
  }, [id]);

  // 후기 본문 및 댓글 데이터 불러오기
  useEffect(() => {
    if (!id) return;

    const fetchReviewAndComments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const reviewResponse = await fetch(`/api/reviews/${id}`);
        if (!reviewResponse.ok) {
          throw new Error('후기를 불러오는 데 실패했습니다.');
        }
        const reviewData: Review = await reviewResponse.json();
        setReview(reviewData);
        
        await fetchComments(); // 댓글 불러오기 호출
        
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviewAndComments();
  }, [id, fetchComments]);

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };
  
  // 댓글 등록 핸들러
  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setCommentError('댓글 내용을 입력해주세요.');
      return;
    }
    setIsSubmitting(true);
    setCommentError(null);
    try {
      const response = await fetch(`/api/reviews/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '댓글 등록에 실패했습니다.');
      }
      setNewComment('');
      alert('댓글이 성공적으로 등록되었습니다.');
      await fetchComments();
    } catch (err: any) {
      setCommentError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 좋아요 클릭 핸들러
  const handleLikeClick = async () => {
    if (isLiked || !review) return;

    setIsLiked(true);
    setReview({ ...review, likeCount: review.likeCount + 1 });

    try {
      const response = await fetch(`/api/reviews/${id}/like`, {
        method: 'POST',
      });
      if (!response.ok) {
        alert('좋아요 처리에 실패했습니다. 다시 시도해주세요.');
        setIsLiked(false);
        setReview({ ...review, likeCount: review.likeCount });
      }
    } catch (err) {
      console.error(err);
      alert('좋아요 처리에 실패했습니다. 다시 시도해주세요.');
      setIsLiked(false);
      setReview({ ...review, likeCount: review.likeCount });
    }
  };

  if (isLoading) return <div className={styles.loading}>후기를 불러오는 중...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!review) return <div className={styles.noResults}>해당 후기를 찾을 수 없습니다.</div>;

  return (
    <main className={styles.main}>
      <div className={styles.reviewContainer}>
        <header className={styles.header}>
          <h1 className={styles.title}>{review.title}</h1>
          <div className={styles.meta}>
            <span className={styles.date}>작성일: {formatDate(review.createdAt)}</span>
            <div className={styles.counts}>
              <span>❤️ {review.likeCount}</span>
              <span>💬 {review.commentCount}</span>
            </div>
          </div>
        </header>

        <article className={styles.content}>{review.content}</article>

        <div className={styles.actionsContainer}>
          <button onClick={handleLikeClick} disabled={isLiked} className={`${styles.actionLikeButton} ${isLiked ? styles.liked : ''}`}>
            ❤️ 마음에 들어요
          </button>
        </div>

        <section className={styles.commentSection}>
          <h2 className={styles.commentTitle}>댓글 ({comments.length})</h2>
          <div className={styles.commentList}>
            {comments.length > 0 ? (
              comments.map(comment => (
                <div key={comment.id} className={styles.commentItem}>
                  <p className={styles.commentContent}>{comment.content}</p>
                  <span className={styles.commentDate}>{formatDate(comment.createdAt)}</span>
                </div>
              ))
            ) : (
              <p className={styles.noComments}>아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
            )}
          </div>

          <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className={styles.commentTextarea}
              placeholder="입양 후기에 설렘을 나눠보세요"
              rows={4}
              disabled={isSubmitting}
            />
            {commentError && <p className={styles.commentError}>{commentError}</p>}
            <button type="submit" className={styles.commentSubmitButton} disabled={isSubmitting}>
              {isSubmitting ? '등록 중...' : '댓글 등록'}
            </button>
          </form>
        </section>

        <footer className={styles.footer}>
          <button onClick={() => router.back()} className={styles.listButton}>
            목록으로
          </button>
        </footer>
      </div>
    </main>
  );
}