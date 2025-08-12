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
      
             // 개발 환경에서만 디버깅 로그 출력
       if (process.env.NODE_ENV === 'development') {
         console.log('Header - Login status check:', { 
           loginStatus, 
           user,
           loginStatusType: typeof loginStatus,
           loginStatusStrict: loginStatus === 'true',
           userExists: !!user
         })
       }
      
      if (loginStatus === 'true' && user) {
                 try {
           const parsedUser = JSON.parse(user)
           if (process.env.NODE_ENV === 'development') {
             console.log('Header - Setting logged in state with user:', parsedUser)
           }
           setIsLoggedIn(true)
           setUserData(parsedUser)
         } catch (error) {
           console.error('Header - Failed to parse user data:', error)
           setIsLoggedIn(false)
           setUserData(null)
         }
             } else {
         if (process.env.NODE_ENV === 'development') {
           console.log('Header - Setting logged out state')
         }
         setIsLoggedIn(false)
         setUserData(null)
       }
    }

    // 초기 상태 확인
    checkLoginStatus()

    // localStorage 변경 감지 (다른 탭에서의 변경)
    window.addEventListener('storage', checkLoginStatus)
    
         // 같은 탭에서의 localStorage 변경 감지를 위한 커스텀 이벤트 리스너
     const handleStorageChange = () => {
       if (process.env.NODE_ENV === 'development') {
         console.log('Header - localStorageChange event received')
       }
       checkLoginStatus()
     }
    
    window.addEventListener('localStorageChange', handleStorageChange)
    
    // 주기적으로 상태 확인 (추가 안전장치)
    const interval = setInterval(checkLoginStatus, 1000)
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus)
      window.removeEventListener('localStorageChange', handleStorageChange)
      clearInterval(interval)
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
     if (process.env.NODE_ENV === 'development') {
       console.log('Header - MyPage button clicked, isLoggedIn:', isLoggedIn)
     }
     
     if (isLoggedIn) {
       // 로그인된 상태면 마이페이지로 이동
       if (process.env.NODE_ENV === 'development') {
         console.log('Header - Redirecting to /mypage')
       }
       router.push('/mypage')
     } else {
       // 로그인되지 않은 상태면 로그인 페이지로 이동
       if (process.env.NODE_ENV === 'development') {
         console.log('Header - Redirecting to /login')
       }
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
                width={50} 
                height={50}
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
                         {/* 개발 환경에서만 디버깅용 로그인 상태 표시 */}
             {process.env.NODE_ENV === 'development' && (
               <div style={{ fontSize: '10px', color: 'red', marginTop: '5px' }}>
                 Debug: {isLoggedIn ? 'LOGGED IN' : 'LOGGED OUT'}
               </div>
             )}
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