'use client';

import React, { Suspense, useEffect, useState } from 'react';
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

  // 품종 코드 → 품종명 매핑
  const [breedMap, setBreedMap] = useState<{ [code: string]: string }>({});
  useEffect(() => {
    fetch('/api/breeds-all')
      .then(res => res.json())
      .then(data => {
        const map: { [code: string]: string } = {};
        data.forEach((item: { code: string, name: string }) => {
          map[item.code] = item.name;
        });
        setBreedMap(map);
      });
  }, []);

  if (!dogData) {
    return <div className={styles.error}>강아지 정보를 불러올 수 없습니다.</div>;
  }

  // 품종명 변환
  const breedName = breedMap[dogData.breed] || '품종 정보 없음';

  // 나이 계산
  function getAgeText(ageStr: string) {
    console.log('ageStr:', ageStr); // 개발자 도구 확인용 로그
    
    const birthYearMatch = ageStr.match(/(\d{4})/);
    if (!birthYearMatch) return ageStr;
    const birthYear = parseInt(birthYearMatch[1], 10);
    const nowYear = new Date().getFullYear();
    const age = nowYear - birthYear + 1;
    return age > 0 ? `${age}살 (${birthYear}년생)` : ageStr;
  }

  return (
    <main className={styles.main}>
      <div className={styles.detailCard}>
        <div className={styles.imageContainer}>
          {/* 👇 이미지 없을 시 기본 로고 표시 */}
          <img 
            src={dogData.image_url || '/logo.png'} 
            alt="강아지 사진" 
            className={styles.animalImage} 
          />
        </div>
        <div className={styles.infoContainer}>
          <div className={styles.infoHeader}>
             <h2 className={styles.breed}>{breedName}</h2>
          </div>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>나이</span>
              <span className={styles.value}>{getAgeText(dogData.age)}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>성별</span>
              <span className={styles.value}>{dogData.sex}</span>
            </div>
             <div className={styles.infoItem}>
              <span className={styles.label}>몸무게</span>
              <span className={styles.value}>{dogData.weight}</span>
            </div>
             <div className={styles.infoItem}>
              <span className={styles.label}>중성화</span>
              <span className={styles.value}>{dogData.neuter}</span>
            </div>
          </div>
          <div className={styles.description}>
            <h3 className={styles.descTitle}>특징 및 설명</h3>
            <p className={styles.descText}>{dogData.desc}</p>
          </div>
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