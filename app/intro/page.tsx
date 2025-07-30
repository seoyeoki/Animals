import React from 'react'
import styles from './page.module.css'

export default function IntroPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>서비스 소개</h1>
        
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <h2 className={styles.heroTitle}>새로운 가족을 만나세요</h2>
            <p className={styles.heroDescription}>
              우리는 사랑이 필요한 동물들과 따뜻한 가정을 연결하는 플��폼입니다. 
              모든 동물이 행복한 가정을 찾을 수 있도록 돕고 있습니다.
            </p>
          </div>
          <div className={styles.heroImage}></div>
        </div>

        <div className={styles.features}>
          <h3 className={styles.sectionTitle}>우리의 특징</h3>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🐾</div>
              <h4 className={styles.featureTitle}>안전한 입양</h4>
              <p className={styles.featureDescription}>
                모든 동물은 건강 검진을 받고 예방접종을 완료한 상태입니다.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>💕</div>
              <h4 className={styles.featureTitle}>매칭 시스템</h4>
              <p className={styles.featureDescription}>
                생활 환경과 성향을 고려하여 최적의 반려동물을 추천합니다.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🏠</div>
              <h4 className={styles.featureTitle}>사후 관리</h4>
              <p className={styles.featureDescription}>
                입양 후에도 지속적인 상담과 지원을 제공합니다.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.stats}>
          <h3 className={styles.sectionTitle}>우리의 성과</h3>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>1,250+</div>
              <div className={styles.statLabel}>성공한 입양</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>850+</div>
              <div className={styles.statLabel}>행복한 가정</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>24/7</div>
              <div className={styles.statLabel}>지원 서비스</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
