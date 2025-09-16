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
        try {
          const parsedUser = JSON.parse(user)
          setIsLoggedIn(true)
          setUserData(parsedUser)
        } catch (error) {
          console.error("Failed to parse user data from localStorage", error)
          setIsLoggedIn(false)
          setUserData(null)
        }
      } else {
        setIsLoggedIn(false)
        setUserData(null)
      }
    }

    checkLoginStatus() // 초기 마운트 시 한 번 실행

    // localStorage 변경 이벤트를 감지하여 로그인 상태를 동기화
    window.addEventListener('localStorageChange', checkLoginStatus)

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('localStorageChange', checkLoginStatus)
    }
  }, [])

  const handleMyPageClick = () => {
    if (isLoggedIn) {
      router.push('/mypage')
    } else {
      router.push('/login')
    }
  }

  const handleLoginClick = () => {
    if (isLoggedIn) {
      // 로그아웃 로직
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('isLoggedIn')
      window.dispatchEvent(new Event('localStorageChange'))
      router.push('/')
    } else {
      // 로그인 페이지로 이동
      router.push('/login')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.logoSection}>
          <div className={styles.logoWrap}>
            <Image
              src="/logo.png"
              alt="Mung Detective"
              width={50}
              height={50}
              priority
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
          <Link href="/matching" className={styles.navItem}>
            매칭
          </Link>
        </div>
      </nav>
    </div>
  )
}