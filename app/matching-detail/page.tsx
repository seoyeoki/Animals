'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './page.module.css';

// 타입 정의
interface RecommendedDog {
  rank: number;
  desertionNo: string;
  breed: string;
  age: string;
  sex: string;
  weight: string;
  neuter: string;
  desc: string;
  image_url: string;
  detail_url: string;
}

function MatchingDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dogJson = searchParams.get('dog');
  
  const dogData: RecommendedDog | null = dogJson ? JSON.parse(decodeURIComponent(dogJson)) : null;

  if (!dogData) {
    return <div className={styles.error}>강아지 정보를 불러올 수 없습니다.</div>;
  }

  const proxyImageUrl = `/api/proxy-image?url=${encodeURIComponent(dogData.image_url)}`;
  const getSexText = (sex: string) => (sex === 'M' ? '수컷' : sex === 'F' ? '암컷' : '미상');

  return (
    <main className={styles.main}>
      <div className={styles.detailCard}>
        <div className={styles.imageContainer}>
          <img src={proxyImageUrl} alt={dogData.breed} className={styles.animalImage} />
        </div>
        <div className={styles.infoContainer}>
          <div className={styles.infoHeader}>
            <h1 className={styles.breed}>{dogData.breed}</h1>
          </div>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>나이</span>
              <span className={styles.value}>{dogData.age}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>성별</span>
              <span className={styles.value}>{getSexText(dogData.sex)}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>체중</span>
              <span className={styles.value}>{dogData.weight}</span>
            </div>
          </div>
          <div className={styles.description}>
            <h3 className={styles.descTitle}>특징 및 설명</h3>
            <p className={styles.descText}>{dogData.desc}</p>
          </div>
          {/* ✨ '이 강아지 찾아가기' 버튼 추가 */}
          <div className={styles.ctaButtonContainer}>
            <a href={dogData.detail_url} target="_blank" rel="noopener noreferrer" className={styles.ctaButton}>
              이 강아지 찾아가기
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

// Suspense HOC (기존과 동일)
export default function MatchingDetailPage() {
  return (
    <Suspense fallback={<div className={styles.loading}>정보를 불러오는 중...</div>}>
      <MatchingDetailContent />
    </Suspense>
  );
}