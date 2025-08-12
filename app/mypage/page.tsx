'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'
import Header from '../components/Header'

interface UserData {
  id: string
  email: string
  nickname: string
}

export default function MyPage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // 로그인 상태 확인
    const loginStatus = localStorage.getItem('isLoggedIn')
    const user = localStorage.getItem('user')
    
    if (loginStatus === 'true' && user) {
      try {
        const parsedUser = JSON.parse(user) as UserData
        setUserData(parsedUser)
      } catch (error) {
        console.error('Failed to parse user data:', error)
        router.push('/login')
        return
      }
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
    
    // Header 컴포넌트에 localStorage 변경 알림
    window.dispatchEvent(new Event('localStorageChange'))
    
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
      <Header />
      {/* Main Content */}
      <main className={styles.main}>
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