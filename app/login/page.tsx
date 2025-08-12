'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'
import Link from 'next/link'
import Header from '../components/Header'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('') // 에러 메시지 초기화
    setIsLoading(true)

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      })

      if (response.ok) {
        // 로그인 성공 (200)
        const userData = await response.json()
        console.log('Login successful:', userData)
        
        // 백엔드 응답: {id: , email: , password: , nickname: }
        // 로컬 스토리지에 사용자 정보 저장 (비밀번호 포함)
        localStorage.setItem('user', JSON.stringify({
          id: userData.id,
          email: userData.email,
          password: userData.password, // 백엔드에서 받은 비밀번호
          nickname: userData.nickname
        }))
        
        // 로그인 상태를 전역으로 설정 (Header 컴포넌트에서 사용)
        localStorage.setItem('isLoggedIn', 'true')
        
        // Header 컴포넌트에 localStorage 변경 알림
        window.dispatchEvent(new Event('localStorageChange'))
        
        // 홈 화면으로 이동
        router.push('/')
      } else {
        // 로그인 실패 (200이 아닌 모든 상태)
        setErrorMessage('잘못된 로그인 정보입니다')
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrorMessage('로그인 중 오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <Header />
      {/* Main Content */}
      <main className={styles.main}>
        {/* Page Title */}
        <div className={styles.pageTitle}>
          <h1 className={styles.title}>로그인</h1>
        </div>

        {/* Login Form */}
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className={styles.errorMessage}>
              {errorMessage}
            </div>
          )}
          
          <button 
            type="submit" 
            className={styles.submitButton} 
            disabled={isLoading}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>
        
        <div className={styles.links}>
          <span className={styles.linkText}>회원이 아니신가요?</span>
          <Link href="/register" className={styles.link}>
            회원가입
          </Link>
        </div>
      </main>
    </div>
  )
} 