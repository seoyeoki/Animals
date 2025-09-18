'use client'

import React, { useState, useEffect, Suspense } from 'react'
import styles from './page.module.css'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

// ✨ 1. AnimalData 인터페이스에 kindName 추가
interface AnimalData {
  desertionNo: string
  kindCd: string
  kindName?: string; // 품종명을 받을 필드
  sexCd: string
  age: string
  weight: string
  specialMark: string
  happenPlace: string
  processState: string
  careNm: string
  careTel: string
  noticeSdt: string
  noticeEdt: string
  size: string
  filename: string
  popfile1?: string
}

function AdoptionDetailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [animalData, setAnimalData] = useState<AnimalData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  
  // ✨ 품종 정보 매핑을 위한 상태
  const [breedMap, setBreedMap] = useState<Record<string, string>>({})

  // ✨ 품종 정보 로드 함수
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
        console.log('품종 매핑 완료:', breedMapping);
      }
    } catch (e) {
      console.error('품종 정보 로드 실패:', e);
    }
  };

  // ✨ 품종 코드를 이름으로 바꿔주는 함수
  const getBreedName = (breedCode: string) => {
    const breedName = breedMap[breedCode];
    if (!breedName) {
      return '품종 정보 없음';
    }
    return breedName;
  };

  useEffect(() => {
    // ✨ 품종 정보를 먼저 로드
    fetchBreeds();
    
    // ✨ 3. URL 파라미터로 'id' 대신 'desertion_no'를 사용하도록 통일
    const desertionNo = searchParams.get('id');
    if (desertionNo) {
      fetchAnimalData(desertionNo)
    } else {
        setError('동물 ID(desertion_no)를 찾을 수 없습니다.');
        setIsLoading(false);
    }
  }, [searchParams])

  const fetchAnimalData = async (id: string) => {
    try {
      setIsLoading(true)
      setError('')
      
      const response = await fetch(`/api/dog-detail?desertion_no=${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('해당 동물을 찾을 수 없습니다.');
        } else {
          throw new Error(`데이터를 불러오는 데 실패했습니다: ${response.status}`);
        }
      }
      
      const animal: AnimalData = await response.json();
      
      if (animal) {
        setAnimalData(animal);
      } else {
        throw new Error('수신된 데이터가 올바르지 않습니다.');
      }

    } catch (err: any) {
      console.error('Error fetching animal data:', err)
      setError(err.message || '동물 데이터를 불러오는 중 오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  // --- 헬퍼 함수 ---

  // ✨ 4. getBreedText 함수는 더 이상 필요 없으므로 삭제
  /*
  const getBreedText = (kindCd: string) => {
    // ...
  }
  */

  const getSexText = (sexCd: string) => {
    // ... (기존과 동일)
    switch (sexCd) {
      case 'M': return '수컷'
      case 'F': return '암컷'
      case 'Q': return '미상'
      default: return '미상'
    }
  }

  const getAgeText = (age: string) => {
    // ... (기존과 동일)
    if (!age) return '나이 미상'
    if (age.includes('년생')) {
      const yearMatch = age.match(/(\d{4})/)
      if (yearMatch) {
        const birthYear = parseInt(yearMatch[1])
        const currentYear = new Date().getFullYear()
        const calculatedAge = currentYear - birthYear + 1
        return `${calculatedAge}세`
      }
      return age.replace(' (년생)', '')
    }
    return age
  }

  const getWeightText = (weight: string) => {
    // ... (기존과 동일)
    if (!weight) return '체중 미상'
    const weightMatch = weight.match(/(\d+\.?\d*)/)
    if (weightMatch) {
      return `${weightMatch[1]}kg`
    }
    return weight
  }

  const getProcessStateText = (processState: string) => {
    // ... (기존과 동일)
    if (!processState) return '상태 미상'
    return processState;
  }

  const formatDate = (dateString: string) => {
    // ... (기존과 동일)
    if (!dateString) return '날짜 미상'
    const year = dateString.substring(0, 4)
    const month = dateString.substring(4, 6)
    const day = dateString.substring(6, 8)
    return `${year}.${month}.${day}`
  }

  const handleContact = () => {
    // ... (기존과 동일)
    if (animalData?.careTel) {
      window.open(`tel:${animalData.careTel}`)
    } else {
      alert('연락처 정보가 없습니다.')
    }
  }

  // --- 렌더링 부분 ---

  if (isLoading) { /* ... (기존과 동일) ... */ 
    return (
      <div className={styles.container}>
        <main className={styles.main}><div className={styles.loading}><p>동물 정보를 불러오는 중...</p></div></main>
      </div>
    )
  }
  if (error) { /* ... (기존과 동일) ... */ 
    return (
      <div className={styles.container}>
        <main className={styles.main}><div className={styles.error}><p>{error}</p></div></main>
      </div>
    )
  }
  if (!animalData) { /* ... (기존과 동일) ... */ 
    return (
      <div className={styles.container}>
        <main className={styles.main}><div className={styles.error}><p>동물 정보를 찾을 수 없습니다.</p></div></main>
      </div>
    )
  }

  // ✨ 5. JSX에서 getBreedText 대신 animalData.kindName을 직접 사용
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.pageTitle}>
          <h1 className={styles.title}>{getBreedName(animalData.kindCd)} 상세정보</h1>
        </div>

        <div className={styles.postInfo}>
          <span className={styles.modifiedDate}>
            공고기간: {formatDate(animalData.noticeSdt)} ~ {formatDate(animalData.noticeEdt)}
          </span>
        </div>

        <div className={styles.contentArea}>
          <div className={styles.mainContent}>
            <div className={styles.contentBox}>
              <div className={styles.animalInfo}>
                <h2 className={styles.animalName}>{getBreedName(animalData.kindCd)}</h2>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>품종:</span>
                    <span className={styles.infoValue}>{getBreedName(animalData.kindCd)}</span>
                  </div>
                  {/* ... 나머지 info items는 기존과 동일 ... */}
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>성별:</span>
                    <span className={styles.infoValue}>{getSexText(animalData.sexCd)}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>나이:</span>
                    <span className={styles.infoValue}>{getAgeText(animalData.age)}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>체중:</span>
                    <span className={styles.infoValue}>{getWeightText(animalData.weight)}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>발견장소:</span>
                    <span className={styles.infoValue}>{animalData.happenPlace || '위치 미상'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>보호상태:</span>
                    <span className={styles.infoValue}>{getProcessStateText(animalData.processState)}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>보호기관:</span>
                    <span className={styles.infoValue}>{animalData.careNm || '기관명 미상'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>연락처:</span>
                    <span className={styles.infoValue}>{animalData.careTel || '연락처 미상'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>공고번호:</span>
                    <span className={styles.infoValue}>{animalData.desertionNo || '번호 미상'}</span>
                  </div>
                </div>
                <div className={styles.specialMark}>
                  <h3 className={styles.specialTitle}>특이사항</h3>
                  <p className={styles.specialText}>{animalData.specialMark || '특이사항이 없습니다.'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.imageSection}>
            <div className={styles.imageContainer}>
              {(() => {
                const imageUrl = animalData.popfile1 || animalData.filename;
                if (imageUrl && imageUrl.trim() !== '') {
                  const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
                  return <img src={proxyUrl} alt={getBreedName(animalData.kindCd)} className={styles.animalImage} />;
                } else {
                  return <div className={styles.imagePlaceholder}><span>이미지 없음</span></div>;
                }
              })()}
            </div>
          </div>

          <div className={styles.contactSection}>
            <a 
              href={`https://www.animal.go.kr/front/awtis/public/publicDtl.do?desertionNo=${animalData.desertionNo}`}
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.contactButton}
              style={{ display: 'block', textDecoration: 'none', textAlign: 'center' }}
            >
              공고 상세보기
            </a>
          </div>
        </div>

        {/* ... (기존과 동일) ... */}
      </main>
    </div>
  )
}

export default function AdoptionDetail() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <AdoptionDetailContent />
    </Suspense>
  )
}