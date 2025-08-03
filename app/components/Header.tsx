'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import styles from './Header.module.css'

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLoginToggle = () => {
    setIsLoggedIn(!isLoggedIn)
  }

  return (
    <header className={styles.header}>
      {/* 상단 흰색 헤더 */}
      <div className={styles.topHeader}>
        <div className={styles.topHeaderContent}>
          <div className={styles.logoSection}>
            <div className={styles.logo}>Logo Here</div>
            <Link href="/" className={styles.title}>
              <h1>Webpage Title Here</h1>
            </Link>
          </div>
          <div className={styles.userSection}>
            <Link href="/mypage" className={styles.mypageButton}>
              마이 페이지
            </Link>
            <button 
              className={styles.loginButton}
              onClick={handleLoginToggle}
            >
              {isLoggedIn ? '로그아웃' : '로그인'}
            </button>
          </div>
        </div>
      </div>

      {/* 하단 파란색 네비게이션 바 */}
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
          <Link href="/register" className={styles.navItem}>
            입양동물 등록
          </Link>
        </div>
      </nav>
    </header>
  )
} 