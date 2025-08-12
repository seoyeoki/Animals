'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import styles from './Header.module.css'

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState(null)
  const router = useRouter()

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = () => {
      const loginStatus = localStorage.getItem('isLoggedIn')
      const user = localStorage.getItem('user')
      
      if (loginStatus === 'true' && user) {
        setIsLoggedIn(true)
        setUserData(JSON.parse(user))
      } else {
        setIsLoggedIn(false)
        setUserData(null)
      }
    }

    checkLoginStatus()

    // localStorage 변경 감지
    window.addEventListener('storage', checkLoginStatus)
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus)
    }
  }, [])

  const handleLoginClick = () => {
    if (isLoggedIn) {
      // 로그아웃 처리
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('isLoggedIn')
      setIsLoggedIn(false)
      setUserData(null)
      
      // 홈 화면으로 이동
      router.push('/')
    } else {
      // 로그인 페이지로 이동
      router.push('/login')
    }
  }

  const handleMyPageClick = () => {
    if (isLoggedIn) {
      // 로그인된 상태면 마이페이지로 이동
      router.push('/mypage')
    } else {
      // 로그인되지 않은 상태면 로그인 페이지로 이동
      router.push('/login')
    }
  }

  return (
    <header className={styles.header}>
      {/* 상단 베이지 헤더 */}
      <div className={styles.topHeader}>
        <div className={styles.topHeaderContent}>
          <div className={styles.logoSection}>
            <div className={styles.logo}>
              <Image 
                src="/logo.png" 
                alt="멍탐정 로고" 
                width={40} 
                height={40}
                className={styles.logoImage}
              />
            </div>
            <Link href="/" className={styles.title}>
              <h1>멍탐정</h1>
            </Link>
          </div>
          <div className={styles.userSection}>
            <button 
              className={styles.mypageButton}
              onClick={handleMyPageClick}
            >
              마이 페이지
            </button>
            <button 
              className={styles.loginButton}
              onClick={handleLoginClick}
            >
              {isLoggedIn ? '로그아웃' : '로그인'}
            </button>
          </div>
        </div>
      </div>

      {/* 하단 우드 톤 네비게이션 바 */}
      <nav className={styles.navigation}>
        <div className={styles.navContent}>
          <Link href="/intro" className={styles.navItem}>
            소개
          </Link>
          <Link href="/guide" className={styles.navItem}>
            이용법
          </Link>
          <Link href="/adoption" className={styles.navItem}>
            입양 및 입소
          </Link>
        </div>
      </nav>
    </header>
  )
} 