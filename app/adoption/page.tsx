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
  const [displayedAnimals, setDisplayedAnimals] = useState<AnimalData[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [emptyDataCount, setEmptyDataCount] = useState(0) // 연속 빈 데이터 카운터
  
  // 품종 데이터 상태
  const [breeds, setBreeds] = useState<Array<{kindCd: string, kindName: string}>>([])
  const [breedsLoading, setBreedsLoading] = useState(true)
  const [breedsError, setBreedsError] = useState(false)
  
  const ITEMS_PER_PAGE = 12

  // 이미지 URL 처리 헬퍼 함수
  const getImageUrl = (animal: any) => {
    // 백엔드에서 popfile1 필드로 데이터를 주므로 이를 사용
    const filename = animal.popfile1 || animal.filename
    
    if (!filename || filename.trim() === '') {
      console.log('Empty filename/popfile1')
      return null
    }
    
    // URL이 이미 완전한 형태인지 확인
    if (filename.startsWith('http://') || filename.startsWith('https://')) {
      console.log('Valid image URL:', filename)
      // 프록시를 통해 이미지 로드
      const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(filename)}`
      console.log('Proxy URL created:', proxyUrl)
      return proxyUrl
    }
    
    // 상대 경로인 경우 기본 URL 추가
    console.log('Relative path:', filename)
    return filename
  }

  // Intersection Observer 설정
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '200px' // 100px에서 200px로 증가
  })

  // 컴포넌트 마운트 시 동물 데이터와 품종 데이터 가져오기
  useEffect(() => {
    fetchAnimals()
    fetchBreeds()
  }, [])

  const loadMoreAnimals = useCallback(() => {
    if (isLoadingMore || !hasMore) {
      console.log('loadMoreAnimals 호출 무시:', { isLoadingMore, hasMore })
      return
    }

    // 다음 페이지 계산
    const nextPage = currentPage + 1
    console.log('다음 페이지 로드 시작:', nextPage)
    setCurrentPage(nextPage)
    
    // 서버에서 다음 페이지 데이터 가져오기
    const filters: {
      kindCd?: string
      size?: string
      page?: number
    } = {}
    
    // 현재 필터 상태 유지
    if (selectedBreed) {
      filters.kindCd = selectedBreed
    }
    if (selectedCategory === 'small') {
      filters.size = '소형'
    } else if (selectedCategory === 'medium') {
      filters.size = '중형'
    } else if (selectedCategory === 'large') {
      filters.size = '대형'
    }
    
    filters.page = nextPage
    
    // 서버에서 다음 페이지 데이터 가져오기 (append=true로 설정)
    fetchAnimals(filters, true)
  }, [currentPage, isLoadingMore, hasMore, selectedBreed, selectedCategory])

  // 무한 스크롤 로직
  useEffect(() => {
    console.log('무한 스크롤 체크:', { inView, hasMore, isLoadingMore })
    if (inView && hasMore && !isLoadingMore) {
      console.log('무한 스크롤 트리거됨')
      loadMoreAnimals()
    }
  }, [inView, hasMore, isLoadingMore, loadMoreAnimals])

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
  }, append: boolean = false) => {
    try {
      if (append) {
        setIsLoadingMore(true)
      } else {
        setIsLoading(true)
      }
      setError('')
      
      // URL 파라미터 구성
      const params = new URLSearchParams()
      if (filters?.page) params.append('page', filters.page.toString())
      if (filters?.kindCd) params.append('kindCd', filters.kindCd)
      if (filters?.size) params.append('size', filters.size)
      
      const url = `/api/rescue/dogs${params.toString() ? `?${params.toString()}` : ''}`
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('동물 데이터를 가져오는데 실패했습니다')
      }
      
      const data = await response.json()
      
      // 디버깅을 위한 로그 추가
      console.log('API Response Data:', data)
      console.log('Data length:', data.length)
      console.log('First animal data:', data[0])
      if (data[0]) {
        console.log('First animal filename:', data[0].filename)
      }
      
      // 데이터가 배열이 아닌 경우 처리
      if (!Array.isArray(data)) {
        console.error('API 응답이 배열이 아닙니다:', data)
        throw new Error('서버에서 잘못된 데이터 형식을 반환했습니다')
      }
      
      if (append) {
        // 무한 스크롤: 기존 데이터에 추가
        setDisplayedAnimals(prev => {
          const newData = [...prev, ...data]
          return newData
        })
        
        // 빈 데이터 처리
        if (data.length === 0) {
          console.log('빈 데이터 수신, 현재 페이지:', filters?.page)
          const newEmptyCount = emptyDataCount + 1
          setEmptyDataCount(newEmptyCount)
          
          // 연속으로 2번 빈 데이터가 오면 더 이상 데이터가 없다고 판단
          if (newEmptyCount >= 2) {
            console.log('더 이상 데이터가 없음, hasMore를 false로 설정')
            setHasMore(false)
          } else {
            setHasMore(true) // 아직 시도해볼 수 있음
          }
        } else {
          // 데이터가 있으면 카운터 리셋
          console.log('데이터 수신됨, 개수:', data.length)
          setEmptyDataCount(0)
          setHasMore(data.length >= 10) // 10개 미만이면 더 이상 데이터가 없을 가능성
        }
      } else {
        // 초기 로드: 데이터 교체
        console.log('초기 데이터 로드, 개수:', data.length)
        setDisplayedAnimals(data)
        setCurrentPage(1)
        setEmptyDataCount(0) // 초기 로드 시 카운터 리셋
        
        // 데이터가 비어있거나 0개일 때만 hasMore를 false로 설정
        const hasMoreData = data.length > 0 && data.length >= 10
        setHasMore(hasMoreData)
        console.log('초기 로드 후 hasMore 설정:', hasMoreData)
      }
      
      // localStorage에 데이터 저장 (초기 로드시에만)
      if (!append) {
        localStorage.setItem('allAnimalsData', JSON.stringify(data))
      }
    } catch (err) {
      setError('동물 데이터를 불러오는 중 오류가 발생했습니다')
    } finally {
      if (append) {
        setIsLoadingMore(false)
      } else {
        setIsLoading(false)
      }
    }
  }

  const handleSearch = () => {
    // 검색 시 빈 데이터 카운터 리셋
    setEmptyDataCount(0)
    
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

  // 나이 텍스트 변환 (현재 시간에서 출생년도 빼고 1 더하기)
  const getAgeText = (age: string) => {
    if (!age) return '나이 미상'
    
    // "2025(60일미만) (년생)" 형태의 데이터에서 출생년도 추출
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
    
    // 다른 형태의 나이 데이터 처리
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

  // 품종 코드를 텍스트로 변환 (백엔드 API에 존재하는 품종만 표시)
  const getBreedText = (kindCd: string) => {
    if (!kindCd) return null
    
    // API에서 받아온 품종 데이터에서 찾기
    const breed = breeds.find(b => b.kindCd === kindCd)
    if (breed) {
      return breed.kindName
    }
    
    // 백엔드 API에 존재하지 않는 품종은 null 반환
    return null
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
          </div>

          <button onClick={handleSearch} className={styles.searchButton}>
            검색
          </button>
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
               // 동물이 있을 때
               displayedAnimals
                 .filter(animal => {
                   const breedText = getBreedText(animal.kindCd)
                   const shouldShow = breedText !== null
                   return shouldShow
                 }) // 백엔드 API에 존재하는 품종만 필터링
                 .map((animal, index) => {
                   const breedText = getBreedText(animal.kindCd)
                   if (!breedText) return null // 추가 안전장치
                   
                   return (
                     <div 
                       key={animal.desertionNo || index}
                       className={styles.animalCard}
                       onClick={() => handleCardClick(animal.desertionNo)}
                       style={{ cursor: 'pointer' }}
                     >
                       <div className={styles.animalImage}>
                         {(() => {
                           const imageUrl = getImageUrl(animal)
                           return imageUrl ? (
                             <img 
                               src={imageUrl} 
                               alt={breedText}
                               className={styles.animalImage}
                               onError={(e) => {
                                 console.log('Image load error for:', imageUrl)
                                 // 이미지 로드 실패 시 기본 이미지로 대체
                                 const target = e.target as HTMLImageElement
                                 target.style.display = 'none'
                                 // 에러 발생 시 noImage div 표시
                                 const parent = target.parentElement
                                 if (parent) {
                                   const noImageDiv = parent.querySelector(`.${styles.noImage}`) as HTMLElement
                                   if (noImageDiv) {
                                     noImageDiv.style.display = 'flex'
                                   }
                                 }
                               }}
                               onLoad={(e) => {
                                 console.log('Image loaded successfully:', imageUrl)
                                 // 이미지 로드 성공 시 noImage div 숨기기
                                 const target = e.target as HTMLImageElement
                                 const parent = target.parentElement
                                 if (parent) {
                                   const noImageDiv = parent.querySelector(`.${styles.noImage}`) as HTMLElement
                                   if (noImageDiv) {
                                     noImageDiv.style.display = 'none'
                                   }
                                 }
                               }}
                             />
                           ) : null
                         })()}
                         <div className={styles.noImage} style={{ display: getImageUrl(animal) ? 'none' : 'flex' }}>
                           <span>이미지 없음</span>
                         </div>
                       </div>
                       <div className={styles.animalInfo}>
                         <h3 className={styles.animalName}>
                           {breedText}
                         </h3>
                         <div className={styles.animalDetails}>
                           <p className={styles.animalDetail}>
                             {getSexText(animal.sexCd)}({getAgeText(animal.age)})
                           </p>
                           {(animal.weight || animal.size) && (
                             <p className={styles.animalDetail}>
                               {animal.weight ? getWeightText(animal.weight) : ''}
                               {animal.weight && animal.size ? '(' : ''}
                               {animal.size ? animal.size : ''}
                               {animal.weight && animal.size ? ')' : ''}
                             </p>
                           )}
                         </div>
                       </div>
                     </div>
                   )
                 })
                 .filter(Boolean) // null 값 제거
             ) : !isLoading ? (
               // 로딩이 완료되었지만 동물이 없을 때
               <div className={styles.noData}>
                 <p>등록된 동물이 없습니다.</p>
               </div>
             ) : null}
           </div>
         )}

                 {/* Loading Indicator for Infinite Scroll */}
         {hasMore && (
           <div ref={ref} className={styles.loadingIndicator}>
             {isLoadingMore ? (
               <div className={styles.loading}>
                 <p>더 많은 동물을 불러오는 중... ({currentPage}페이지)</p>
               </div>
             ) : (
               <div className={styles.loadMoreTrigger}>
                 <p>스크롤하여 더 보기 (현재 {displayedAnimals.length}마리)</p>
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