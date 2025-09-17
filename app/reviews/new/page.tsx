'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function NewReviewPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // 간단한 유효성 검사
    if (!title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }
    if (!content.trim()) {
      setError('내용을 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      // 이전에 통합하기로 한 /api/reviews 주소로 POST 요청
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '후기 등록에 실패했습니다.');
      }

      // 성공 시, 후기 목록 페이지로 이동
      alert('후기가 성공적으로 등록되었습니다.');
      router.push('/adoption-review'); // 후기 목록 페이지 경로

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>새 후기 작성</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>제목</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
              placeholder="제목을 입력하세요"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="content" className={styles.label}>내용</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={styles.textarea}
              placeholder="따뜻한 입양 후기를 들려주세요."
              rows={15}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => router.back()}
              className={`${styles.button} ${styles.cancelButton}`}
              disabled={isLoading}
            >
              취소
            </button>
            <button
              type="submit"
              className={`${styles.button} ${styles.submitButton}`}
              disabled={isLoading}
            >
              {isLoading ? '등록 중...' : '등록하기'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}