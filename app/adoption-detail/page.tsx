'use client'

import React, { useState } from 'react'
import styles from './page.module.css'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdoptionDetail() {
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(false)
  const [isShared, setIsShared] = useState(false)

  // 샘플 데이터
  const animalData = {
    name: '멍멍이',
    breed: '믹스견',
    age: '3살',
    gender: '수컷',
    weight: '12kg',
    location: '서울 강남구',
    description: '활발하고 친근한 성격의 강아지입니다. 산책을 좋아하고 사람들과 잘 어울립니다. 예방접종을 모두 완료했고 건강합니다.',
    characteristics: ['친근함', '활발함', '산책 좋아함', '사람 좋아함'],
    healthInfo: ['예방접종 완료', '중성화 완료', '건강검진 완료'],
    images: ['/sample1.jpg', '/sample2.jpg', '/sample3.jpg']
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
    console.log('Contact clicked')
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <span className={styles.logo}>logo here</span>
        </div>
        <div className={styles.headerTitle}>
          <span>Webpage Title Here</span>
        </div>
        <div className={styles.headerButtons}>
          <span className={styles.headerText}>마이 페이지</span>
          <Link href="/login" className={styles.loginButton}>로그인</Link>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className={styles.navigation}>
        <div className={styles.navContainer}>
          <div className={styles.backIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className={styles.navItems}>
            <div className={styles.navItem}>소개</div>
            <div className={styles.navItem}>이용법</div>
            <div className={styles.navItem}>입양 및 입소</div>
            <div className={styles.navItem}>입양동물 등록</div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Back Button */}
        <div className={styles.backButton} onClick={() => router.back()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          뒤로가기
        </div>

        {/* Animal Detail Section */}
        <div className={styles.detailContainer}>
          {/* Title and Actions */}
          <div className={styles.titleSection}>
            <div className={styles.titleInfo}>
              <h1 className={styles.title}>{animalData.name} - {animalData.breed}</h1>
              <p className={styles.location}>{animalData.location}</p>
            </div>
            <div className={styles.actionButtons}>
              <button className={styles.editButton} onClick={handleEdit}>수정</button>
              <button className={styles.deleteButton} onClick={handleDelete}>삭제</button>
            </div>
          </div>

          {/* Image Gallery */}
          <div className={styles.imageGallery}>
            <div className={styles.mainImage}>
              <div className={styles.imagePlaceholder}></div>
            </div>
            <div className={styles.thumbnailGrid}>
              {animalData.images.map((image, index) => (
                <div key={index} className={styles.thumbnail}></div>
              ))}
            </div>
          </div>

          {/* Animal Information */}
          <div className={styles.infoSection}>
            <div className={styles.basicInfo}>
              <h2 className={styles.sectionTitle}>기본 정보</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>나이</span>
                  <span className={styles.infoValue}>{animalData.age}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>성별</span>
                  <span className={styles.infoValue}>{animalData.gender}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>체중</span>
                  <span className={styles.infoValue}>{animalData.weight}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>위치</span>
                  <span className={styles.infoValue}>{animalData.location}</span>
                </div>
              </div>
            </div>

            <div className={styles.description}>
              <h2 className={styles.sectionTitle}>소개</h2>
              <p className={styles.descriptionText}>{animalData.description}</p>
            </div>

            <div className={styles.characteristics}>
              <h2 className={styles.sectionTitle}>특징</h2>
              <div className={styles.tagList}>
                {animalData.characteristics.map((char, index) => (
                  <span key={index} className={styles.tag}>{char}</span>
                ))}
              </div>
            </div>

            <div className={styles.healthInfo}>
              <h2 className={styles.sectionTitle}>건강 정보</h2>
              <div className={styles.healthList}>
                {animalData.healthInfo.map((info, index) => (
                  <div key={index} className={styles.healthItem}>
                    <span className={styles.checkIcon}>✓</span>
                    <span>{info}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actionSection}>
            <div className={styles.socialButtons}>
              <button 
                className={`${styles.socialButton} ${isLiked ? styles.liked : ''}`}
                onClick={handleLike}
              >
                <span className={styles.buttonIcon}>❤️</span>
                좋아요
              </button>
              <button 
                className={`${styles.socialButton} ${isShared ? styles.shared : ''}`}
                onClick={handleShare}
              >
                <span className={styles.buttonIcon}>📤</span>
                공유하기
              </button>
            </div>
            <button className={styles.contactButton} onClick={handleContact}>
              연락하기
            </button>
          </div>

          {/* AI Recommendation */}
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
        </div>
      </main>
    </div>
  )
}
