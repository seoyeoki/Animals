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
  popfile1?: string  // 백엔드에서 실제로 주는 필드
}

export default function Home() {
  const router = useRouter()
  const [animals, setAnimals] = useState<AnimalData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [breeds, setBreeds] = useState<{ kindCd: string; kindName: string }[]>([])

  // 컴포넌트 마운트 시 동물 데이터와 품종 데이터 가져오기
  useEffect(() => {
    fetchRandomAnimals()
    fetchBreeds()
  }, [])

  const fetchBreeds = async () => {
    try {
      const response = await fetch('/api/breeds')
      if (response.ok) {
        const data = await response.json()
        setBreeds(data)
      }
    } catch (err) {
      console.error('품종 데이터 로딩 오류:', err)
    }
  }

  const fetchRandomAnimals = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      // 첫 페이지만 호출
      const url = '/api/rescue/dogs?page=1'
      
      console.log('API 호출:', url)
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('동물 데이터를 가져오는데 실패했습니다')
      }
      
      const data = await response.json()
      
      console.log('받은 데이터:', data.length, '개')
      
      // 최대 6마리까지만 표시
      const limitedData = data.slice(0, 6)
      setAnimals(limitedData)
      
      // localStorage에 데이터 저장 (상세 페이지에서 사용)
      localStorage.setItem('allAnimalsData', JSON.stringify(data))
      
    } catch (err) {
      console.error('오류:', err)
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
    
    // "2019 (년생)" 형태인 경우 나이로 변환
    if (age.includes('년생')) {
      const yearMatch = age.match(/(\d{4})/)
      if (yearMatch) {
        const birthYear = parseInt(yearMatch[1])
        const currentYear = new Date().getFullYear()
        const ageInYears = currentYear - birthYear
        return `${ageInYears}세`
      }
    }
    
    // 이미 나이 형태인 경우 그대로 반환
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

  return (
    <div className={styles.container}>
      <Header />
      <section className={styles.content}>
        <h1 className={styles.mainTitle}>가족을 찾고 있어요</h1>
        
        <div className={styles.animalGrid}>
          {animals.length > 0 ? (
            animals
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
                        // 백엔드에서 popfile1 필드로 데이터를 주므로 이를 사용
                        const filename = animal.popfile1 || animal.filename
                        
                        if (filename && filename.trim() !== '') {
                          // URL이 완전한 형태인지 확인하고 프록시 사용
                          const imageUrl = filename.startsWith('http://') || filename.startsWith('https://') 
                            ? `/api/proxy-image?url=${encodeURIComponent(filename)}`
                            : filename
                          
                          return (
                            <img 
                              src={imageUrl} 
                              alt={breedText}
                              className={styles.animalImage}
                              onError={(e) => {
                                console.log('Main page image load failed:', filename)
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                                // 이미지 로드 실패 시 placeholder 표시
                                const container = target.parentElement
                                if (container) {
                                  const placeholder = document.createElement('div')
                                  placeholder.className = styles.noImage
                                  placeholder.innerHTML = '<span>이미지를 불러올 수 없습니다</span>'
                                  container.appendChild(placeholder)
                                }
                              }}
                              onLoad={() => {
                                console.log('Main page image loaded successfully:', filename)
                              }}
                            />
                          )
                        } else {
                          return (
                            <div className={styles.noImage}>
                              <span>이미지 없음</span>
                            </div>
                          )
                        }
                      })()}
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
      </section>
    </div>
  )
}
