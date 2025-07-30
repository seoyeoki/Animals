'use client'

import React, { useState } from 'react'
import styles from './page.module.css'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 로그인 로직 구현
    console.log('Login attempt:', { email, password })
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
          <button className={styles.loginButton}>로그인</button>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className={styles.navigation}>
        <div className={styles.navContainer}>
          <div className={styles.navItem}>소개</div>
          <div className={styles.navItem}>이용법</div>
          <div className={styles.navItem}>입양 및 입소</div>
          <div className={styles.navItem}>입양동물 등록</div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Back Arrow */}
        <div className={styles.backArrow}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Login Form */}
        <div className={styles.loginContainer}>
          <h1 className={styles.title}>로그인</h1>
          
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
            
            <button type="submit" className={styles.submitButton}>
              로그인
            </button>
          </form>
          
          <div className={styles.links}>
            <span className={styles.linkText}>회원이 아니신가요?</span>
            <Link href="/register" className={styles.link}>
              회원가입
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
} 