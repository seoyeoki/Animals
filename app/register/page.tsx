'use client'

import React, { useState } from 'react'
import styles from './page.module.css'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Register() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 회원가입 로직 구현
    console.log('Register attempt:', formData)
  }

  const handleBackClick = () => {
    router.back()
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
        <div className={styles.registerContainer}>
          <form className={styles.registerForm} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>이름 *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>이메일 *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>아이디 *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>비밀번호 *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>비밀번호 확인 *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>
            
            <div className={styles.buttonContainer}>
              <button type="submit" className={styles.submitButton}>
                가입하기
              </button>
              <Link href="/login" className={styles.loginLink}>
                이미 계정이 있으신가요?
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
