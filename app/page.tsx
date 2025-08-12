'use client'

import React, { useState, useEffect } from 'react'
import styles from './page.module.css'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from './components/Header'

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

export default function Home() {
  const router = useRouter()
  const [animals, setAnimals] = useState<AnimalData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // 컴포넌트 마운트 시 동물 데이터 가져오기
  useEffect(() => {
    fetchRandomAnimals()
  }, [])

  const fetchRandomAnimals = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      // 랜덤 품종과 크기 설정
      const breeds = ['000245', '000054', '000056', '000055', '000118', '000249', '000115']
      const sizes = ['소형', '중형', '대형']
      
      const randomBreed = breeds[Math.floor(Math.random() * breeds.length)]
      const randomSize = sizes[Math.floor(Math.random() * sizes.length)]
      const randomPage = Math.floor(Math.random() * 10) + 1 // 1-10 페이지 중 랜덤
      
      // URL 파라미터 구성
      const params = new URLSearchParams()
      params.append('page', randomPage.toString())
      params.append('kindCd', randomBreed)
      params.append('size', randomSize)
      
      const url = `/api/rescue/dogs?${params.toString()}`
      
      console.log('Fetching random animals from URL:', url)
      console.log('Random filters:', { breed: randomBreed, size: randomSize, page: randomPage })
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('동물 데이터를 가져오는데 실패했습니다')
      }
      
      const data = await response.json()
      
      // 최대 6마리까지만 표시 (강서 3마리 + 중구 3마리)
      const limitedData = data.slice(0, 6)
      setAnimals(limitedData)
      
      // localStorage에 데이터 저장 (상세 페이지에서 사용)
      localStorage.setItem('allAnimalsData', JSON.stringify(data))
      
    } catch (err) {
      console.error('Error fetching animals:', err)
      setError('동물 데이터를 불러오는 중 오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
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
    if (!weight) return ''
    
    const weightMatch = weight.match(/(\d+\.?\d*)/)
    if (weightMatch) {
      return `${weightMatch[1]}kg`
    }
    
    return weight
  }

  // 품종 코드를 텍스트로 변환
  const getBreedText = (kindCd: string) => {
    if (!kindCd) return '품종 미상'
    
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
    
    if (happenPlace.includes('구')) {
      const parts = happenPlace.split(' ')
      return parts[0]
    }
    
    return happenPlace
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Header />
        <section className={styles.content}>
          <h1 className={styles.mainTitle}>가족을 찾고 있어요</h1>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>동물들을 불러오는 중...</p>
          </div>
        </section>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <Header />
        <section className={styles.content}>
          <h1 className={styles.mainTitle}>가족을 찾고 있어요</h1>
          <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
            <p>{error}</p>
          </div>
        </section>
      </div>
    )
  }

  // 강서구와 중구로 나누어 표시
  const gangseoAnimals = animals.slice(0, 3)
  const jungguAnimals = animals.slice(3, 6)

  return (
    <div className={styles.container}>
      <Header />
      <section className={styles.content}>
        <h1 className={styles.mainTitle}>가족을 찾고 있어요</h1>
        
        <div className={styles.locationSection}>
          <div className={styles.locationHeader}>
            <span className={styles.locationText}>서울 강서</span>
            <div className={styles.locationUnderline}></div>
          </div>
          
          <div className={styles.cardGrid}>
            {gangseoAnimals.length > 0 ? (
              gangseoAnimals.map((animal, index) => (
                <div 
                  key={animal.desertionNo || index} 
                  className={styles.card}
                  onClick={() => handleCardClick(animal.desertionNo)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles.cardImage}>
                    {animal.filename ? (
                      <img 
                        src={animal.filename} 
                        alt={getBreedText(animal.kindCd)}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div style={{ 
                        width: '100%', 
                        height: '100%', 
                        background: 'var(--Medium-Beige)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#8b4513'
                      }}>
                        이미지 없음
                      </div>
                    )}
                  </div>
                  <div className={styles.cardInfo}>
                    <h3 className={styles.animalName}>{getBreedText(animal.kindCd)}</h3>
                    <p className={styles.animalBreed}>{getBreedText(animal.kindCd)}</p>
                    <p className={styles.animalLocation}>{getLocationText(animal.happenPlace)}</p>
                    <p style={{ fontSize: '0.9rem', color: '#666', margin: '5px 0' }}>
                      {getSexText(animal.sexCd)} • {getAgeText(animal.age)}
                    </p>
                    {animal.weight && (
                      <p style={{ fontSize: '0.8rem', color: '#666' }}>
                        체중: {getWeightText(animal.weight)}
                      </p>
                    )}
                    {animal.size && (
                      <p style={{ fontSize: '0.8rem', color: '#666' }}>
                        크기: {animal.size}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              [...Array(3)].map((_, index) => (
                <div 
                  key={index} 
                  className={styles.card}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles.cardImage}></div>
                  <div className={styles.cardInfo}>
                    <h3 className={styles.animalName}>데이터 없음</h3>
                    <p className={styles.animalBreed}>-</p>
                    <p className={styles.animalLocation}>-</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.locationSection}>
          <div className={styles.locationHeader}>
            <span className={styles.locationText}>서울 중구</span>
            <div className={styles.locationUnderline}></div>
          </div>
          
          <div className={styles.cardGrid}>
            {jungguAnimals.length > 0 ? (
              jungguAnimals.map((animal, index) => (
                <div 
                  key={animal.desertionNo || index} 
                  className={styles.card}
                  onClick={() => handleCardClick(animal.desertionNo)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles.cardImage}>
                    {animal.filename ? (
                      <img 
                        src={animal.filename} 
                        alt={getBreedText(animal.kindCd)}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div style={{ 
                        width: '100%', 
                        height: '100%', 
                        background: 'var(--Medium-Beige)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#8b4513'
                      }}>
                        이미지 없음
                      </div>
                    )}
                  </div>
                  <div className={styles.cardInfo}>
                    <h3 className={styles.animalName}>{getBreedText(animal.kindCd)}</h3>
                    <p className={styles.animalBreed}>{getBreedText(animal.kindCd)}</p>
                    <p className={styles.animalLocation}>{getLocationText(animal.happenPlace)}</p>
                    <p style={{ fontSize: '0.9rem', color: '#666', margin: '5px 0' }}>
                      {getSexText(animal.sexCd)} • {getAgeText(animal.age)}
                    </p>
                    {animal.weight && (
                      <p style={{ fontSize: '0.8rem', color: '#666' }}>
                        체중: {getWeightText(animal.weight)}
                      </p>
                    )}
                    {animal.size && (
                      <p style={{ fontSize: '0.8rem', color: '#666' }}>
                        크기: {animal.size}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              [...Array(3)].map((_, index) => (
                <div 
                  key={index} 
                  className={styles.card}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles.cardImage}></div>
                  <div className={styles.cardInfo}>
                    <h3 className={styles.animalName}>데이터 없음</h3>
                    <p className={styles.animalBreed}>-</p>
                    <p className={styles.animalLocation}>-</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
