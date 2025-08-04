'use client'

import React, { useState } from 'react'
import styles from './page.module.css'
import Link from 'next/link'

export default function AdoptionRegister() {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedBreed, setSelectedBreed] = useState('')
  const [address, setAddress] = useState('')

  const handleSubmit = () => {
    // 등록 로직 구현
    console.log('Registration data:', {
      address,
      category: selectedCategory,
      breed: selectedBreed
    })
  }

  return (
    <div className={styles.container}>
      {/* Main Content */}
      <main className={styles.main}>
        {/* Page Title */}
        <div className={styles.pageTitle}>
          <h1 className={styles.title}>입양동물 등록</h1>
        </div>

        {/* Address Section */}
        <div className={styles.addressSection}>
          <label className={styles.addressLabel}>주소</label>
          <div className={styles.addressInputContainer}>
            <input 
              type="text" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="주소를 입력하세요"
              className={styles.addressInput}
            />
            <button className={styles.searchButton}>검색</button>
          </div>
        </div>

        {/* Category and Breed Section */}
        <div className={styles.filtersSection}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>분류</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">분류를 선택하세요</option>
              <option value="dog">강아지</option>
              <option value="cat">고양이</option>
              <option value="other">기타</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>품종</label>
            <select 
              value={selectedBreed} 
              onChange={(e) => setSelectedBreed(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">품종을 선택하세요</option>
              <option value="mixed">믹스</option>
              <option value="labrador">래브라도</option>
              <option value="golden">골든리트리버</option>
              <option value="persian">페르시안</option>
              <option value="siamese">샴</option>
            </select>
          </div>
        </div>

        {/* Content Area */}
        <div className={styles.contentArea}>
          <div className={styles.toolbar}>
            <span className={styles.toolbarText}>ToolBar</span>
          </div>
          
          <div className={styles.contentBox}>
            {/* 여기에 실제 등록 폼 내용이 들어갈 예정 */}
            <p className={styles.placeholderText}>등록 폼이 여기에 표시됩니다</p>
          </div>
        </div>

        {/* Submit Button */}
        <div className={styles.submitSection}>
          <button onClick={handleSubmit} className={styles.submitButton}>
            등록
          </button>
        </div>
      </main>
    </div>
  )
}