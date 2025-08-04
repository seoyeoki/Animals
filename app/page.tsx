'use client'

import React from 'react'
import styles from './page.module.css'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const handleCardClick = (animalId: string) => {
    // 동물 카드 클릭 시 상세 페이지로 이동
    router.push(`/adoption-detail?id=${animalId}`)
  }

  return (
    <div className={styles.container}>
      <section className={styles.content}>
        <h1 className={styles.mainTitle}>가족을 찾고 있어요</h1>
        
        <div className={styles.locationSection}>
          <div className={styles.locationHeader}>
            <span className={styles.locationText}>서울 강서</span>
            <div className={styles.locationUnderline}></div>
          </div>
          
          <div className={styles.cardGrid}>
            {[...Array(3)].map((_, index) => (
              <div 
                key={index} 
                className={styles.card}
                onClick={() => handleCardClick(`gangseo-${index + 1}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.cardImage}></div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.animalName}>강서 {index + 1}번</h3>
                  <p className={styles.animalBreed}>믹스견</p>
                  <p className={styles.animalLocation}>서울 강서구</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.locationSection}>
          <div className={styles.locationHeader}>
            <span className={styles.locationText}>서울 중구</span>
            <div className={styles.locationUnderline}></div>
          </div>
          
          <div className={styles.cardGrid}>
            {[...Array(3)].map((_, index) => (
              <div 
                key={index} 
                className={styles.card}
                onClick={() => handleCardClick(`junggu-${index + 1}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.cardImage}></div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.animalName}>중구 {index + 1}번</h3>
                  <p className={styles.animalBreed}>페르시안</p>
                  <p className={styles.animalLocation}>서울 중구</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
