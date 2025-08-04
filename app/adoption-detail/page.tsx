'use client'

import React, { useState, useEffect } from 'react'
import styles from './page.module.css'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AdoptionDetail() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLiked, setIsLiked] = useState(false)
  const [isShared, setIsShared] = useState(false)
  const [animalId, setAnimalId] = useState<string | null>(null)

  // URL 파라미터에서 동물 ID 가져오기
  useEffect(() => {
    const id = searchParams.get('id')
    setAnimalId(id)
    console.log('Animal ID:', id)
  }, [searchParams])

  // 샘플 데이터 (나중에 실제 데이터로 교체 예정)
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
    images: ['/sample1.jpg', '/sample2.jpg', '/sample3.jpg'],
    modifiedDate: '2024.01.15'
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

  const handleBackClick = () => {
    router.back()
  }

  return (
    <div className={styles.container}>
      {/* Main Content */}
      <main className={styles.main}>
        {/* Back Arrow */}
        <div className={styles.backArrow} onClick={handleBackClick}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="#1D1A20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Page Title */}
        <div className={styles.pageTitle}>
          <h1 className={styles.title}>입양 구인글 제목</h1>
        </div>

        {/* Post Info */}
        <div className={styles.postInfo}>
          <span className={styles.modifiedDate}>{animalData.modifiedDate}</span>
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
              <p className={styles.placeholderText}>입양 구인글 내용이 여기에 표시됩니다</p>
              {animalId && (
                <p className={styles.animalIdText}>동물 ID: {animalId}</p>
              )}
            </div>
          </div>

          {/* Image Section */}
          <div className={styles.imageSection}>
            <div className={styles.imageContainer}>
              <div className={styles.imagePlaceholder}></div>
            </div>
            <div className={styles.imageContainer}>
              <div className={styles.imagePlaceholder}></div>
            </div>
          </div>

          {/* Contact Button */}
          <div className={styles.contactSection}>
            <button className={styles.contactButton} onClick={handleContact}>
              연락하기
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
