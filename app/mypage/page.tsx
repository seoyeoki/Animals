'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

export default function MyPage() {
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // 로그인 상태 확인
    const loginStatus = localStorage.getItem('isLoggedIn')
    const user = localStorage.getItem('user')
    
    if (loginStatus === 'true' && user) {
      setUserData(JSON.parse(user))
    } else {
      // 로그인되지 않은 상태면 로그인 페이지로 이동
      router.push('/login')
      return
    }
    
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('isLoggedIn')
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.loading}>로딩 중...</div>
        </main>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Main Content */}
      <main className={styles.main}>
        {/* Back Arrow */}
        <div className={styles.backArrow}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="#1D1A20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Page Title */}
        <div className={styles.pageTitle}>
          <h1 className={styles.title}>마이 페이지</h1>
        </div>

        {/* User Info */}
        <div className={styles.userInfo}>
          <div className={styles.infoCard}>
            <h2 className={styles.infoTitle}>사용자 정보</h2>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>이름:</span>
              <span className={styles.infoValue}>{userData?.nickname || '별명 없음'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>이메일:</span>
              <span className={styles.infoValue}>{userData?.email}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>사용자 ID:</span>
              <span className={styles.infoValue}>{userData?.id}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <button className={styles.logoutButton} onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </main>
    </div>
  )
} 