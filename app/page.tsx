import React from 'react'
import styles from './page.module.css'
import Link from 'next/link'

export default function Home() {
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

      {/* 네비게이션 바 */}
      <nav className={styles.navigationBar}>
        <div className={styles.navContainer}>
          <div className={styles.navItem}>소개</div>
          <div className={styles.navItem}>이용법</div>
          <div className={styles.navItem}>입양 및 입소</div>
          <div className={styles.navItem}>입양동물 등록</div>
        </div>
      </nav>
      
      <section className={styles.content}>
        <h1 className={styles.mainTitle}>가족을 찾고 있어요</h1>
        
        <div className={styles.locationSection}>
          <div className={styles.locationHeader}>
            <span className={styles.locationText}>서울 강서</span>
            <div className={styles.locationUnderline}></div>
          </div>
          
          <div className={styles.cardGrid}>
            {[...Array(3)].map((_, index) => (
              <div key={index} className={styles.card}>
                <div className={styles.cardImage}></div>
                <div className={styles.cardInfo}></div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.locationSection}>
          <div className={styles.locationHeader}>
            <span className={styles.locationText}>서울 중구</span>
            <div className={styles.locationUnderline}></div>
          </div>
          
          <div className={styles.cardGrid}>
            {[...Array(3)].map((_, index) => (
              <div key={index} className={styles.card}>
                <div className={styles.cardImage}></div>
                <div className={styles.cardInfo}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.chatbot}>
        <div className={styles.chatbotBubble}>
          <span className={styles.chatbotText}>챗봇 이름또는로고</span>
          <div className={styles.chatbotTail}></div>
        </div>
        <button className={styles.chatbotButton}>
          <img 
            src="https://api.builder.io/api/v1/image/assets/TEMP/c829a260964bfc445a8395b93b2849770b8c9ec9?width=158" 
            alt="ChatBot" 
            className={styles.chatbotIcon}
          />
        </button>
      </div>
    </div>
  )
}
