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

  // 컴포넌트 마운트 시 품종 데이터를 먼저 가져온 후 동물 데이터 가져오기
  useEffect(() => {
    const initializeData = async () => {
      const breedsData = await fetchBreeds()
      await fetchRandomAnimals(breedsData)
    }
    initializeData()
  }, [])

  const fetchBreeds = async () => {
    try {
      const response = await fetch('/api/breeds')
      if (response.ok) {
        const data = await response.json()
        setBreeds(data)
        return data
      }
    } catch (err) {
      console.error('품종 데이터 로딩 오류:', err)
    }
    return []
  }

  const fetchRandomAnimals = async (breedsData: { kindCd: string; kindName: string }[] = []) => {
    try {
      setIsLoading(true)
      setError('')
      
      let allAnimals: AnimalData[] = []
      let currentPage = 1
      const maxPages = 10 // 최대 10페이지까지 시도 (안전장치)
      
      // 유효한 품종을 가진 동물이 6마리 이상이 될 때까지 또는 최대 페이지에 도달할 때까지 반복
      while (currentPage <= maxPages) {
        const url = `/api/rescue/dogs?page=${currentPage}`
        
        console.log(`API 호출 (페이지 ${currentPage}):`, url)
        
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error(`페이지 ${currentPage}에서 동물 데이터를 가져오는데 실패했습니다`)
        }
        
        const pageData = await response.json()
        
        console.log(`페이지 ${currentPage}에서 받은 데이터:`, pageData.length, '개')
        
        // 현재 페이지의 데이터를 전체 배열에 추가
        allAnimals = [...allAnimals, ...pageData]
        
        // 만약 현재 페이지에 데이터가 없다면 더 이상 페이지가 없는 것
        if (pageData.length === 0) {
          console.log(`페이지 ${currentPage}에 데이터가 없음. 페이징 중단.`)
          break
        }
        
        // 현재까지 수집된 데이터에서 유효한 품종을 가진 동물이 6마리 이상인지 확인
        const validAnimalsCount = allAnimals.filter(animal => {
          const breedText = getBreedTextWithData(animal.kindCd, breedsData)
          return breedText !== null
        }).length
        
        console.log(`현재까지 유효한 동물: ${validAnimalsCount}마리`)
        
        // 유효한 동물이 6마리 이상이면 루프 종료
        if (validAnimalsCount >= 6) {
          console.log('유효한 동물이 6마리 이상 수집됨. 페이징 중단.')
          break
        }
        
        currentPage++
      }
      
      console.log('총 수집된 데이터:', allAnimals.length, '개')
      
      // 유효한 품종을 가진 동물들만 필터링하여 최대 6마리까지 표시
      const validAnimals = allAnimals
        .filter(animal => {
          const breedText = getBreedTextWithData(animal.kindCd, breedsData)
          return breedText !== null
        })
        .slice(0, 6)
      
      console.log('유효한 품종을 가진 동물:', validAnimals.length, '개')
      
      setAnimals(validAnimals)
      
      // localStorage에 전체 데이터 저장 (상세 페이지에서 사용)
      localStorage.setItem('allAnimalsData', JSON.stringify(allAnimals))
      
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

  // 품종 코드를 텍스트로 변환 (매개변수로 받은 breeds 데이터 사용)
  const getBreedTextWithData = (kindCd: string, breedsData: { kindCd: string; kindName: string }[]) => {
    if (!kindCd) return null
    
    // 매개변수로 받은 품종 데이터에서 찾기
    const breed = breedsData.find(b => b.kindCd === kindCd)
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
