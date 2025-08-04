'use client'

import React, { useState } from 'react'
import styles from './page.module.css'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Adoption() {
  const router = useRouter()
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedBreed, setSelectedBreed] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')

  const handleSearch = () => {
    // 검색 로직 구현
    console.log('Search filters:', {
      region: selectedRegion,
      category: selectedCategory,
      breed: selectedBreed,
      district: selectedDistrict
    })
  }

  const handleCardClick = (animalId: string) => {
    // 동물 카드 클릭 시 상세 페이지로 이동
    router.push(`/adoption-detail?id=${animalId}`)
  }

  return (
    <div className={styles.container}>
      {/* Main Content */}
      <main className={styles.main}>
        {/* Back Arrow */}
        <div className={styles.backArrow}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

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
              <label className={styles.filterLabel}>분류</label>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">전체</option>
                <option value="dog">강아지</option>
                <option value="cat">고양이</option>
                <option value="other">기타</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>품종</label>
              <select 
                value={selectedBreed} 
                onChange={(e) => setSelectedBreed(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">전체</option>
                <option value="mixed">믹스</option>
                <option value="labrador">래브라도</option>
                <option value="golden">골든리트리버</option>
                <option value="persian">페르시안</option>
                <option value="siamese">샴</option>
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

        {/* Animal Cards Grid */}
        <div className={styles.animalGrid}>
          {/* Sample Animal Cards */}
          <div 
            className={styles.animalCard}
            onClick={() => handleCardClick('dog1')}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.animalImage}></div>
            <div className={styles.animalInfo}>
              <h3 className={styles.animalName}>멍멍이</h3>
              <p className={styles.animalBreed}>믹스견</p>
              <p className={styles.animalLocation}>서울 강남구</p>
            </div>
          </div>

          <div 
            className={styles.animalCard}
            onClick={() => handleCardClick('cat1')}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.animalImage}></div>
            <div className={styles.animalInfo}>
              <h3 className={styles.animalName}>냥냥이</h3>
              <p className={styles.animalBreed}>페르시안</p>
              <p className={styles.animalLocation}>서울 서초구</p>
            </div>
          </div>

          <div 
            className={styles.animalCard}
            onClick={() => handleCardClick('dog2')}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.animalImage}></div>
            <div className={styles.animalInfo}>
              <h3 className={styles.animalName}>댕댕이</h3>
              <p className={styles.animalBreed}>래브라도</p>
              <p className={styles.animalLocation}>서울 마포구</p>
            </div>
          </div>

          <div 
            className={styles.animalCard}
            onClick={() => handleCardClick('cat2')}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.animalImage}></div>
            <div className={styles.animalInfo}>
              <h3 className={styles.animalName}>고양이</h3>
              <p className={styles.animalBreed}>샴</p>
              <p className={styles.animalLocation}>서울 홍대입구</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}