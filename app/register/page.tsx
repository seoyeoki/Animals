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
