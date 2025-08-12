'use client'

import React, { useState, useEffect } from 'react'
import styles from './page.module.css'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

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

export default function AdoptionDetail() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLiked, setIsLiked] = useState(false)
  const [isShared, setIsShared] = useState(false)
  const [animalId, setAnimalId] = useState<string | null>(null)
  const [animalData, setAnimalData] = useState<AnimalData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  
  // 품종 데이터 상태
  const [breeds, setBreeds] = useState<Array<{kindCd: string, kindName: string}>>([])
  const [breedsError, setBreedsError] = useState(false)

  // URL 파라미터에서 동물 ID 가져오기
  useEffect(() => {
    const id = searchParams.get('id')
    setAnimalId(id)
    if (id) {
      fetchAnimalData(id)
    }
    fetchBreeds()
  }, [searchParams])

  // 품종 데이터 가져오기
  const fetchBreeds = async () => {
    try {
      setBreedsError(false)
      
      const response = await fetch('/api/breeds')
      
      if (!response.ok) {
        throw new Error(`품종 데이터를 가져오는데 실패했습니다: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (Array.isArray(data) && data.length > 0) {
        console.log('품종 데이터 로드 성공:', data.length, '개')
        setBreeds(data)
      } else {
        throw new Error('품종 데이터가 비어있습니다')
      }
    } catch (err) {
      console.error('Error fetching breeds:', err)
      setBreedsError(true)
                    // 품종 데이터 로드 실패 시 기본 데이터 사용
        setBreeds([
          { kindCd: '000245', kindName: '고든 세터' },
          { kindCd: '000054', kindName: '골든 리트리버' },
          { kindCd: '000056', kindName: '그레이 하운드' },
          { kindCd: '000055', kindName: '그레이트 덴' },
          { kindCd: '000118', kindName: '그레이트 피레니즈' },
          { kindCd: '000249', kindName: '그리펀 벨지언' },
          { kindCd: '000115', kindName: '기타' }
        ])
    }
  }

  // 동물 데이터 가져오기
  const fetchAnimalData = async (id: string) => {
    try {
      setIsLoading(true)
      setError('')
      
      // localStorage에서 데이터 가져오기
      const cachedData = localStorage.getItem('allAnimalsData')
      if (!cachedData) {
        setError('동물 데이터를 찾을 수 없습니다. 목록 페이지로 이동해주세요.')
        setIsLoading(false)
        return
      }
      
      const allAnimals = JSON.parse(cachedData)
      const animal = allAnimals.find((a: AnimalData) => a.desertionNo === id)
      
      if (animal) {
        setAnimalData(animal)
      } else {
        setError('해당 동물을 찾을 수 없습니다')
      }
    } catch (err) {
      console.error('Error fetching animal data:', err)
      setError('동물 데이터를 불러오는 중 오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
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

  // 나이 텍스트 변환
  const getAgeText = (age: string) => {
    if (!age) return '나이 미상'
    
    if (age.includes('년생')) {
      return age.replace(' (년생)', '')
    }
    
    return age
  }

  // 체중 텍스트 변환
  const getWeightText = (weight: string) => {
    if (!weight) return '체중 미상'
    
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
      '000037': '꼬똥 드 뚤레아',
      '000081': '네오폴리탄 마스티프',
      '000204': '노르포크 테리어',
      '000083': '노리치 테리어',
      '000082': '뉴펀들랜드',
      '000039': '달마시안',
      '000040': '댄디 딘몬트 테리어',
      '000043': '도고 까니리오',
      '000153': '도고 아르젠티노',
      '000042': '도고 아르젠티노',
      '000041': '도베르만',
      '000120': '도사',
      '000219': '도사 믹스견',
      '000155': '동경견',
      '000247': '라고토 로마그놀로',
      '000069': '라브라도 리트리버',
      '000071': '라사 압소',
      '000093': '래빗 닥스훈트',
      '000167': '랫 테리어',
      '000251': '러시안 토이',
      '000228': '러프콜리',
      '000070': '레이크랜드 테리어'
    }
    
    return breedMap[kindCd] || kindCd
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

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    if (!dateString) return '날짜 미상'
    
    const year = dateString.substring(0, 4)
    const month = dateString.substring(4, 6)
    const day = dateString.substring(6, 8)
    
    return `${year}.${month}.${day}`
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  const handleShare = () => {
    setIsShared(!isShared)
    console.log('Share clicked')
  }

  const handleEdit = () => {
    console.log('Edit clicked')
  }

  const handleDelete = () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      console.log('Delete confirmed')
    }
  }

  const handleContact = () => {
    if (animalData?.careTel) {
      window.open(`tel:${animalData.careTel}`)
    } else {
      alert('연락처 정보가 없습니다.')
    }
  }

  const handleBackClick = () => {
    router.back()
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.loading}>
            <p>동물 정보를 불러오는 중...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        </main>
      </div>
    )
  }

  if (!animalData) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.error}>
            <p>동물 정보를 찾을 수 없습니다.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Main Content */}
      <main className={styles.main}>
        {/* Page Title */}
        <div className={styles.pageTitle}>
          <h1 className={styles.title}>{getBreedText(animalData.kindCd)} 상세정보</h1>
        </div>

        {/* Post Info */}
        <div className={styles.postInfo}>
          <span className={styles.modifiedDate}>
            공고기간: {formatDate(animalData.noticeSdt)} ~ {formatDate(animalData.noticeEdt)}
          </span>
          <div className={styles.actionButtons}>
            <button className={styles.editButton} onClick={handleEdit}>수정</button>
            <span className={styles.separator}>|</span>
            <button className={styles.deleteButton} onClick={handleDelete}>삭제</button>
          </div>
        </div>

        {/* Content Area */}
        <div className={styles.contentArea}>
          {/* Main Content Box */}
          <div className={styles.mainContent}>
            <div className={styles.contentBox}>
              <div className={styles.animalInfo}>
                <h2 className={styles.animalName}>{getBreedText(animalData.kindCd)}</h2>
                
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>품종:</span>
                    <span className={styles.infoValue}>{getBreedText(animalData.kindCd)}</span>
                  </div>
                  
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
                    <span className={styles.infoLabel}>크기:</span>
                    <span className={styles.infoValue}>{animalData.size || '크기 미상'}</span>
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
                  
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>공고기간:</span>
                    <span className={styles.infoValue}>
                      {formatDate(animalData.noticeSdt)} ~ {formatDate(animalData.noticeEdt)}
                    </span>
                  </div>
                </div>
                
                {animalData.specialMark && (
                  <div className={styles.specialMark}>
                    <h3 className={styles.specialTitle}>특이사항</h3>
                    <p className={styles.specialText}>{animalData.specialMark}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className={styles.imageSection}>
            <div className={styles.imageContainer}>
              {animalData.filename ? (
                <img 
                  src={animalData.filename} 
                  alt={getBreedText(animalData.kindCd)}
                  className={styles.animalImage}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              ) : (
                <div className={styles.imagePlaceholder}>
                  <span>이미지 없음</span>
                </div>
              )}
            </div>
          </div>

          {/* Contact Button */}
          <div className={styles.contactSection}>
            <button className={styles.contactButton} onClick={handleContact}>
              {animalData.careTel ? '전화연락하기' : '연락하기'}
            </button>
          </div>
        </div>

        {/* AI Recommendation */}
        <div className={styles.aiSection}>
          <div className={styles.aiCard}>
            <div className={styles.aiContent}>
              <h3 className={styles.aiTitle}>어떤 반려동물을 만나면 좋을지 알아보세요!</h3>
            </div>
            <div className={styles.aiButton}>
              <div className={styles.aiIcon}>🤖</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
