'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useInView } from 'react-intersection-observer'
import styles from './page.module.css'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// 동물 데이터 타입 정의
interface AnimalData {
  desertionNo: string
  kindCd: string
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
}

export default function Adoption() {
  const router = useRouter()
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedBreed, setSelectedBreed] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  
  // 무한 스크롤 관련 상태
  const [allAnimals, setAllAnimals] = useState<AnimalData[]>([])
  const [displayedAnimals, setDisplayedAnimals] = useState<AnimalData[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [hasMore, setHasMore] = useState(true)
  
  // 품종 데이터 상태
  const [breeds, setBreeds] = useState<Array<{kindCd: string, kindName: string}>>([])
  const [breedsLoading, setBreedsLoading] = useState(true)
  const [breedsError, setBreedsError] = useState(false)
  
  const ITEMS_PER_PAGE = 12

  // Intersection Observer 설정
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px'
  })

  // 컴포넌트 마운트 시 동물 데이터와 품종 데이터 가져오기
  useEffect(() => {
    fetchAnimals()
    fetchBreeds()
  }, [])

  // 무한 스크롤 로직
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMoreAnimals()
    }
  }, [inView, hasMore, isLoading])

  const fetchBreeds = async () => {
    try {
      setBreedsLoading(true)
      setBreedsError(false)
      
      const response = await fetch('/api/breeds')
      
      if (!response.ok) {
        throw new Error(`품종 데이터를 가져오는데 실패했습니다: ${response.status}`)
      }
      
      const data = await response.json()
      
             if (Array.isArray(data) && data.length > 0) {
         console.log('품종 데이터 로드 성공:', data.length, '개')
         console.log('첫 번째 품종 데이터:', data[0])
         // 백엔드 응답을 프론트엔드 형식으로 매핑
         const mappedBreeds = data.map(breed => ({
           kindCd: breed.kindCd,
           kindName: breed.knm || breed.kindName || '품종명 없음'
         }))
         setBreeds(mappedBreeds)
      } else {
        throw new Error('품종 데이터가 비어있습니다')
      }
    } catch (err) {
      console.error('Error fetching breeds:', err)
      setBreedsError(true)
      // 품종 데이터 로드 실패 시 기본 데이터 사용 (expanded list)
      setBreeds([
        { kindCd: '000245', kindName: '고든 세터' },
        { kindCd: '000054', kindName: '골든 리트리버' },
        { kindCd: '000056', kindName: '그레이 하운드' },
        { kindCd: '000055', kindName: '그레이트 덴' },
        { kindCd: '000118', kindName: '그레이트 피레니즈' },
        { kindCd: '000249', kindName: '그리펀 벨지언' },
        { kindCd: '000115', kindName: '기타' },
      ])
    } finally {
      setBreedsLoading(false)
    }
  }

  const fetchAnimals = async (filters?: {
    kindCd?: string
    size?: string
    page?: number
  }) => {
    try {
      setIsLoading(true)
      setError('')
      
      // URL 파라미터 구성
      const params = new URLSearchParams()
      if (filters?.page) params.append('page', filters.page.toString())
      if (filters?.kindCd) params.append('kindCd', filters.kindCd)
      if (filters?.size) params.append('size', filters.size)
      
      const url = `/api/rescue/dogs${params.toString() ? `?${params.toString()}` : ''}`
      
      console.log('Fetching animals from URL:', url)
      console.log('URL params:', params.toString())
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('동물 데이터를 가져오는데 실패했습니다')
      }
      
      const data = await response.json()
      setAllAnimals(data)
      
      // localStorage에 데이터 저장
      localStorage.setItem('allAnimalsData', JSON.stringify(data))
      
      // 첫 번째 페이지 로드
      const initialItems = data.slice(0, ITEMS_PER_PAGE)
      setDisplayedAnimals(initialItems)
      setCurrentPage(1)
      setHasMore(data.length > ITEMS_PER_PAGE)
    } catch (err) {
      console.error('Error fetching animals:', err)
      setError('동물 데이터를 불러오는 중 오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  const loadMoreAnimals = useCallback(() => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    
    // 다음 페이지 계산
    const nextPage = currentPage + 1
    const startIndex = (nextPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    
    // 추가 데이터 가져오기
    const newItems = allAnimals.slice(startIndex, endIndex)
    
    if (newItems.length > 0) {
      setDisplayedAnimals(prev => [...prev, ...newItems])
      setCurrentPage(nextPage)
      setHasMore(endIndex < allAnimals.length)
    } else {
      setHasMore(false)
    }
    
    setIsLoading(false)
  }, [currentPage, allAnimals, isLoading, hasMore])

  const handleSearch = () => {
    // 검색 필터 구성
    const filters: {
      kindCd?: string
      size?: string
    } = {}
    
    // 품종 필터
    if (selectedBreed) {
      filters.kindCd = selectedBreed
    }
    
    // 크기 필터 (분류 선택에 따라)
    if (selectedCategory === 'small') {
      filters.size = '소형'
    } else if (selectedCategory === 'medium') {
      filters.size = '중형'
    } else if (selectedCategory === 'large') {
      filters.size = '대형'
    }
    
    console.log('Search filters:', {
      region: selectedRegion,
      category: selectedCategory,
      breed: selectedBreed,
      district: selectedDistrict,
      apiFilters: filters
    })
    
    console.log('Calling fetchAnimals with filters:', filters)
    // API 호출로 검색 실행
    fetchAnimals(filters)
  }

  const handleCardClick = (animalId: string) => {
    // 동물 카드 클릭 시 상세 페이지로 이동
    router.push(`/adoption-detail?id=${animalId}`)
  }

  // 성별 텍스트 변환
  const getSexText = (sexCd: string) => {
    switch (sexCd) {
      case 'M': return '수컷'
      case 'F': return '암컷'
      case 'Q': return '미상'
      default: return '미상'
    }
  }

  // 나이 텍스트 변환 (실제 데이터 형식에 맞춤)
  const getAgeText = (age: string) => {
    if (!age) return '나이 미상'
    
    // "2025(60일미만) (년생)" 형태의 데이터 처리
    if (age.includes('년생')) {
      return age.replace(' (년생)', '')
    }
    
    return age
  }

  // 체중 텍스트 변환 (실제 데이터 형식에 맞춤)
  const getWeightText = (weight: string) => {
    if (!weight) return ''
    
    // "0.1(Kg)" 형태의 데이터에서 숫자만 추출
    const weightMatch = weight.match(/(\d+\.?\d*)/)
    if (weightMatch) {
      return `${weightMatch[1]}kg`
    }
    
    return weight
  }

  // 품종 코드를 텍스트로 변환
  const getBreedText = (kindCd: string) => {
    if (!kindCd) return '품종 미상'
    
    // API에서 받아온 품종 데이터에서 찾기
    const breed = breeds.find(b => b.kindCd === kindCd)
    if (breed) {
      return breed.kindName
    }
    
    // 기본 품종 코드에 따른 텍스트 변환 (fallback)
    const breedMap: { [key: string]: string } = {
      '000245': '고든 세터',
      '000054': '골든 리트리버',
      '000056': '그레이 하운드',
      '000055': '그레이트 덴',
      '000118': '그레이트 피레니즈',
      '000249': '그리펀 벨지언',
      '000115': '기타',
    }
    
    return breedMap[kindCd] || kindCd
  }

  // 지역 정보 추출
  const getLocationText = (happenPlace: string) => {
    if (!happenPlace) return '위치 미상'
    
    // "의창구 북면 신촌리 592-2" 형태에서 구 정보 추출
    if (happenPlace.includes('구')) {
      const parts = happenPlace.split(' ')
      return parts[0] // 첫 번째 부분 (구 이름)
    }
    
    return happenPlace
  }

  // 보호 상태 텍스트 변환
  const getProcessStateText = (processState: string) => {
    if (!processState) return '상태 미상'
    
    const stateMap: { [key: string]: string } = {
      '보호중': '보호중',
      '입양완료': '입양완료',
      '안락사': '안락사',
      '자연사': '자연사',
      '반환': '반환'
    }
    
    return stateMap[processState] || processState
  }

  return (
    <div className={styles.container}>
      {/* Main Content */}
      <main className={styles.main}>
        {/* Page Title */}
        <div className={styles.pageTitle}>
          <h1 className={styles.title}>입양 및 입소</h1>
          <p className={styles.subtitle}>입양 및 입소를 기다리고 있어요</p>
        </div>

        {/* Search Section */}
        <div className={styles.searchSection}>
          <h2 className={styles.searchTitle}>검색하기</h2>
          
          <div className={styles.searchFilters}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>시도</label>
              <select 
                value={selectedRegion} 
                onChange={(e) => setSelectedRegion(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">전체</option>
                <option value="seoul">서울특별시</option>
                <option value="busan">부산광역시</option>
                <option value="daegu">대구광역시</option>
                <option value="incheon">인천광역시</option>
                <option value="gwangju">광주광역시</option>
                <option value="daejeon">대전광역시</option>
                <option value="ulsan">울산광역시</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>크기</label>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">전체</option>
                <option value="small">소형</option>
                <option value="medium">중형</option>
                <option value="large">대형</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>품종</label>
              <select 
                value={selectedBreed} 
                onChange={(e) => setSelectedBreed(e.target.value)}
                className={styles.filterSelect}
                disabled={breedsLoading}
              >
                <option value="">
                  {breedsLoading ? '품종 로딩 중...' : breedsError ? '품종 로딩 실패' : '전체'}
                </option>
                {breeds.map((breed) => (
                  <option key={breed.kindCd} value={breed.kindCd}>
                    {breed.kindName}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>시군구</label>
              <select 
                value={selectedDistrict} 
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">전체</option>
                <option value="gangnam">강남구</option>
                <option value="seocho">서초구</option>
                <option value="mapo">마포구</option>
                <option value="hongdae">홍대입구</option>
              </select>
            </div>
          </div>

          <button onClick={handleSearch} className={styles.searchButton}>
            검색
          </button>
        </div>

        {/* AI Recommendation Section */}
        <div className={styles.aiSection}>
          <div className={styles.aiCard}>
            <div className={styles.aiIcon}>🤖</div>
            <div className={styles.aiContent}>
              <h3 className={styles.aiTitle}>AI 추천</h3>
              <p className={styles.aiDescription}>
                어떤 반려동물을 만나면 좋을지 알아보세요!
              </p>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        )}

        {/* Animal Cards Grid */}
        {!error && (
          <div className={styles.animalGrid}>
            {displayedAnimals.length > 0 ? (
              displayedAnimals.map((animal, index) => (
                <div 
                  key={animal.desertionNo || index}
                  className={styles.animalCard}
                  onClick={() => handleCardClick(animal.desertionNo)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles.animalImage}>
                    {animal.filename ? (
                      <img 
                        src={animal.filename} 
                        alt={getBreedText(animal.kindCd)}
                        className={styles.animalImage}
                        onError={(e) => {
                          // 이미지 로드 실패 시 기본 이미지로 대체
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className={styles.noImage}>
                        <span>이미지 없음</span>
                      </div>
                    )}
                  </div>
                  <div className={styles.animalInfo}>
                    <h3 className={styles.animalName}>
                      {getBreedText(animal.kindCd)}
                    </h3>
                    <p className={styles.animalBreed}>
                      {getBreedText(animal.kindCd)}
                    </p>
                    <p className={styles.animalLocation}>
                      {getLocationText(animal.happenPlace)}
                    </p>
                    <p className={styles.animalDetails}>
                      {getSexText(animal.sexCd)} • {getAgeText(animal.age)}
                    </p>
                    {animal.weight && (
                      <p className={styles.animalWeight}>
                        체중: {getWeightText(animal.weight)}
                      </p>
                    )}
                    <p className={styles.animalState}>
                      상태: {getProcessStateText(animal.processState)}
                    </p>
                    {animal.size && (
                      <p className={styles.animalSize}>
                        크기: {animal.size}
                      </p>
                    )}
                    {animal.careNm && (
                      <p className={styles.animalCare}>
                        보호소: {animal.careNm}
                      </p>
                    )}
                    {animal.specialMark && (
                      <p className={styles.animalSpecial}>
                        {animal.specialMark.length > 50 
                          ? `${animal.specialMark.substring(0, 50)}...` 
                          : animal.specialMark}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.noData}>
                <p>등록된 동물이 없습니다.</p>
              </div>
            )}
          </div>
        )}

        {/* Loading Indicator for Infinite Scroll */}
        {hasMore && (
          <div ref={ref} className={styles.loadingIndicator}>
            {isLoading ? (
              <div className={styles.loading}>
                <p>더 많은 동물을 불러오는 중...</p>
              </div>
            ) : (
              <div className={styles.loadMoreTrigger}>
                <p>스크롤하여 더 보기</p>
              </div>
            )}
          </div>
        )}

        {/* No More Data */}
        {!hasMore && displayedAnimals.length > 0 && (
          <div className={styles.noMoreData}>
            <p>모든 동물을 불러왔습니다.</p>
          </div>
        )}
      </main>
    </div>
  )
}