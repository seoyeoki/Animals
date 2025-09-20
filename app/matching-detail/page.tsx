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
        // data: [{ code: string, name: string }]
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
  const breedName = breedMap[dogData.breed] || dogData.breed;

  // 나이 계산 (태어난 해 → 현재 나이)
  function getAgeText(ageStr: string) {
    // ageStr 예시: "2020(년생)"
    const birthYearMatch = ageStr.match(/(\d{4})/);
    if (!birthYearMatch) return ageStr;
    const birthYear = parseInt(birthYearMatch[1], 10);
    const nowYear = new Date().getFullYear();
    const age = nowYear - birthYear;
    return age > 0 ?
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