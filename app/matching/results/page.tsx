'use client';

import React, [useState, useEffect} from 'react';
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

// 나이 계산 함수
const calculateAge = (ageString: string): string => {
  const match = ageString.match(/(\d{4})/);
  if (match) {
    const birthYear = parseInt(match[1], 10);
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear + 1; // 한국식 나이
    return age > 0 ? `${age}살` : '1살 미만';
  }
  return ageString;
};

// 추천율 포맷 함수
const formatScore = (score: number): string => {
  const percentage = (score * 100).toFixed(1);
  return `${percentage}%`;
};


export default function MatchingResultsPage() {
  const router = useRouter();
  
  const [surveyResults, setSurveyResults] = useState<ApiResponse | null>(null);
  const [imageResults, setImageResults] = useState<ApiResponse | null>(null);
  const [breedMap, setBreedMap] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await fetch('/api/breeds-all');
        if (!response.ok) {
          throw new Error('품종 정보를 불러오는 데 실패했습니다.');
        }
        const data = await response.json();
        
        if (Array.isArray(data)) {
          const breedMapping: Record<string, string> = {};
          data.forEach((breed: { kindCd: string; knm?: string; kindName?: string }) => {
            const breedName = breed.knm || breed.kindName || '품종명 없음';
            breedMapping[breed.kindCd] = breedName;
          });
          setBreedMap(breedMapping);
        }
      } catch (e) {
        console.error('품종 정보 로드 실패:', e);
      }
    };
    
    const loadResults = () => {
      try {
        const savedSurveyResults = sessionStorage.getItem('matching_survey_results');
        const savedImageResults = sessionStorage.getItem('matching_image_results');

        if (savedSurveyResults) setSurveyResults(JSON.parse(savedSurveyResults));
        if (savedImageResults) setImageResults(JSON.parse(savedImageResults));
        
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

    fetchBreeds().then(loadResults);

  }, []);

  const getBreedName = (breedCode: string) => {
    return breedMap[breedCode] || '품종 정보 없음';
  };

  if (isLoading) {
    return <main className={styles.main}><p className={styles.loadingText}>결과를 분석하는 중...</p></main>;
  }

  if (error) {
    return <main className={styles.main}><p className={styles.errorText}>{error}</p></main>;
  }

  // URL 생성 함수 (이미지 URL이 없을 경우를 대비)
  const createProxyImageUrl = (url: string) => {
    if (!url) return '/logo.png';
    return `/api/proxy-image?url=${encodeURIComponent(url)}`;
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>강아지 추천 결과</h1>
      
      {surveyResults && surveyResults.results && surveyResults.results.length > 0 && (
        <section className={styles.resultsContainer}>
          <h2 className={styles.subTitle}>이런 강아지들이 잘 맞아요</h2>
          <div className={styles.recommendationsGrid}>
            {surveyResults.results.map((dog) => (
              <Link href={`/matching-detail?dog=${encodeURIComponent(JSON.stringify(dog))}`} key={`survey-${dog.desertionNo}`} className={styles.recommendationItem}>
                {/* 👇 JSX 구조 및 이미지 소스 수정 */}
                <div className={styles.recImageContainer}>
                  <img 
                    src={dog.image_url || '/logo.png'} 
                    alt={getBreedName(dog.breed)}
                    className={styles.recImage} 
                  />
                </div>
                <div className={styles.recInfo}>
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
                  {/* 👇 로고 이미지 출력 반영 */}
                  <img src={createProxyImageUrl(dog.image_url)} alt={getBreedName(dog.breed)} className={styles.recImage} />
                </div>
                <div className={styles.recInfo}>
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