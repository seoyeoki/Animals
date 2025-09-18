'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

// API 응답 타입 정의
interface RecommendedDog {
  rank: number;
  score: number;
  desertionNo: string;
  breed: string; // "000114"와 같은 품종 코드
  age: string;   // "2024(년생)"과 같은 출생년도
  image_url: string;
  sex?: string;
  weight?: string;
  neuter?: string;
  desc?: string;
  detail_url?: string;
}

interface ApiResponse {
  recommendation: string;
  results: RecommendedDog[];
}

// ✨ 1. 데이터 포맷을 위한 헬퍼 함수들을 추가했습니다.

// 나이 계산 함수
const calculateAge = (ageString: string): string => {
  const match = ageString.match(/(\d{4})/); // "2024(년생)"에서 "2024"를 추출
  if (match) {
    const birthYear = parseInt(match[1], 10);
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    return age > 0 ? `${age}살` : '1살 미만';
  }
  return ageString; // 예상치 못한 형식이면 원본 반환
};

// 추천율 포맷 함수
const formatScore = (score: number): string => {
  const percentage = (score * 100).toFixed(1); // 소수점 첫째 자리까지 반올림
  return `${percentage}%`;
};


export default function MatchingResultsPage() {
  const router = useRouter();
  
  const [surveyResults, setSurveyResults] = useState<ApiResponse | null>(null);
  const [imageResults, setImageResults] = useState<ApiResponse | null>(null);
  
  // ✨ 2. 품종 코드와 품종명을 매핑할 상태를 추가했습니다.
  const [breedMap, setBreedMap] = useState<Record<string, string>>({});
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ✨ 3. 페이지가 로드될 때 전체 품종 정보를 가져오는 API를 호출합니다.
    const fetchBreeds = async () => {
      try {
        const response = await fetch('/api/breeds-all'); // 전체 품종 정보 API
        if (!response.ok) {
          throw new Error('품종 정보를 불러오는 데 실패했습니다.');
        }
        const data = await response.json();
        
        // ✨ API 응답이 객체 배열이므로 kindCd를 키로, kindName을 값으로 하는 맵을 생성
        if (Array.isArray(data)) {
          const breedMapping: Record<string, string> = {};
          data.forEach((breed: { kindCd: string; knm?: string; kindName?: string }) => {
            // knm 또는 kindName 필드에서 품종명을 가져옴
            const breedName = breed.knm || breed.kindName || '품종명 없음';
            breedMapping[breed.kindCd] = breedName;
          });
          setBreedMap(breedMapping);
          console.log('전체 품종 매핑 완료:', breedMapping);
        } else {
          console.error('품종 데이터가 배열이 아닙니다:', data);
        }
      } catch (e) {
        console.error('품종 정보 로드 실패:', e);
        // 품종 정보를 못 가져와도 에러를 표시하진 않습니다 (코드로 대체).
      }
    };
    
    const loadResults = () => {
      try {
        const savedSurveyResults = sessionStorage.getItem('matching_survey_results');
        const savedImageResults = sessionStorage.getItem('matching_image_results');

        if (savedSurveyResults) {
          const parsed = JSON.parse(savedSurveyResults);
          console.log('설문 결과:', parsed);
          setSurveyResults(parsed);
        }
        if (savedImageResults) {
          const parsed = JSON.parse(savedImageResults);
          console.log('이미지 결과:', parsed);
          setImageResults(parsed);
        }
        if (!savedSurveyResults && !savedImageResults) {
          setError('추천 결과가 없습니다. 매칭을 다시 시작해주세요.');
        }
      } catch (e) {
        setError('결과를 불러오는 중 오류가 발생했습니다.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBreeds().then(loadResults); // 품종 정보를 먼저 가져온 후 결과 로드

  }, []);

  // ✨ 품종 코드를 이름으로 바꿔주는 함수
  const getBreedName = (breedCode: string) => {
    const breedName = breedMap[breedCode];
    if (!breedName) {
      console.log(`품종 코드 "${breedCode}"에 대한 이름을 찾을 수 없습니다. 현재 breedMap:`, breedMap);
      return '품종 정보 없음'; // 품종명을 찾을 수 없으면 "품종 정보 없음" 반환
    }
    return breedName;
  };


  if (isLoading) {
    return <main className={styles.main}><p className={styles.loadingText}>결과를 분석하는 중...</p></main>;
  }

  if (error) {
    return <main className={styles.main}><p className={styles.errorText}>{error}</p></main>;
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>강아지 추천 결과</h1>
      
      {surveyResults && surveyResults.results && surveyResults.results.length > 0 && (
        <section className={styles.resultsContainer}>
          <h2 className={styles.subTitle}>이런 강아지들이 잘 맞아요</h2>
          <div className={styles.recommendationsGrid}>
            {surveyResults.results.map((dog) => (
              <Link href={`/matching-detail?dog=${encodeURIComponent(JSON.stringify(dog))}`} key={`survey-${dog.desertionNo}`} className={styles.recommendationItem}>
                <div className={styles.recImageContainer}>
                  <img src={`/api/proxy-image?url=${encodeURIComponent(dog.image_url)}`} alt={getBreedName(dog.breed)} className={styles.recImage} />
                </div>
                <div className={styles.recInfo}>
                  {/* ✨ 4. 헬퍼 함수를 사용하여 변환된 값을 출력합니다. */}
                  <span className={styles.recBreed}>{getBreedName(dog.breed)}</span>
                  <span className={styles.recScore}>추천율: {formatScore(dog.score)}</span>
                  <span className={styles.recAge}>{calculateAge(dog.age)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {imageResults && imageResults.results && imageResults.results.length > 0 && (
        <section className={styles.resultsContainer}>
          <h2 className={styles.subTitle}>이런 강아지들을 좋아할 것 같아요</h2>
          <div className={styles.recommendationsGrid}>
            {imageResults.results.map((dog) => (
              <Link href={`/matching-detail?dog=${encodeURIComponent(JSON.stringify(dog))}`} key={`image-${dog.desertionNo}`} className={styles.recommendationItem}>
                <div className={styles.recImageContainer}>
                  <img src={`/api/proxy-image?url=${encodeURIComponent(dog.image_url)}`} alt={getBreedName(dog.breed)} className={styles.recImage} />
                </div>
                <div className={styles.recInfo}>
                  {/* ✨ 4. 헬퍼 함수를 사용하여 변환된 값을 출력합니다. */}
                  <span className={styles.recBreed}>{getBreedName(dog.breed)}</span>
                  <span className={styles.recScore}>추천율: {formatScore(dog.score)}</span>
                  <span className={styles.recAge}>{calculateAge(dog.age)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className={styles.buttonGroup}>
        <button onClick={() => router.push('/matching')} className={styles.retryButton}>다시 추천받기</button>
      </div>
    </main>
  );
}