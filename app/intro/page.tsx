import React from 'react'
import styles from './page.module.css'
import Image from 'next/image'

export default function IntroPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.titleContainer}>
          <Image
            src="/logo.png"
            alt="멍탐정 로고"
            width={80}
            height={80}
            className={styles.logo}
            priority
          />
          <h1 className={styles.title}>멍탐정이란?</h1>
        </div>
        
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <h2 className={styles.heroTitle}>멍탐정은 작은 발자국에서 시작합니다</h2>
            <p className={styles.heroDescription}>
              길 위에 남겨진 발자국, 아직 가족을 만나지 못한 강아지들.
              우리는 그 발자국을 따라가 새로운 인연을 이어주고 싶었습니다.
              멍탐정은 AI를 통해 유기견의 사진과 정보를 분석하여
              입양을 원하는 사람과 강아지가 더 쉽고 빠르게 만날 수 있도록 돕는 유기견 매칭 서비스입니다.
            </p>
          </div>
          <div className={styles.heroImage}>
            <Image
              src="/happy pets.jpg"
              alt="가족과 웰시코기가 함께하는 따뜻한 순간"
              width={400}
              height={300}
              className={styles.heroImageContent}
              priority
            />
          </div>
        </div>

        <div className={styles.features}>
          <h3 className={styles.sectionTitle}>🐶 멍탐정 이용 방법 🐶</h3>
          <p className={styles.methodDescription}>
            멍탐정에서는 단순히 목록을 보는 것뿐만 아니라,
            나에게 맞는 강아지를 직접 탐정처럼 찾아볼 수 있습니다.
          </p>
          
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Image
                  src="/step1.png"
                  alt="발견하기 아이콘"
                  width={48}
                  height={48}
                  className={styles.stepIcon}
                />
              </div>
              <h4 className={styles.featureTitle}>1. 발견하기</h4>
              <p className={styles.featureDescription}>
                먼저 보호소에 등록된 유기견들을 쭉 둘러봅니다.
                어떤 친구들이 새로운 가족을 기다리는지 확인하세요.
              </p>
            </div>
            
            <div className={styles.arrowDown}>
              <Image
                src="/arrow.png"
                alt="화살표"
                width={32}
                height={32}
                className={styles.arrowImage}
              />
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Image
                  src="/step2.png"
                  alt="설문 작성 아이콘"
                  width={48}
                  height={48}
                  className={styles.stepIcon}
                />
              </div>
              <h4 className={styles.featureTitle}>2. 탐정 설문 작성하기</h4>
              <p className={styles.featureDescription}>
                매칭 페이지에서 설문을 작성합니다.
              </p>
            </div>
            
            <div className={styles.arrowDown}>
              <Image
                src="/arrow.png"
                alt="화살표"
                width={32}
                height={32}
                className={styles.arrowImage}
              />
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Image
                  src="/step3.png"
                  alt="단서 남기기 아이콘"
                  width={48}
                  height={48}
                  className={styles.stepIcon}
                />
              </div>
              <h4 className={styles.featureTitle}>3. 추가 단서 남기기</h4>
              <p className={styles.featureDescription}>
                텍스트로 더 원하는 조건을 적거나,
                직접 사진을 업로드해서 닮은 친구를 찾아볼 수 있습니다.
              </p>
            </div>
            
            <div className={styles.arrowDown}>
              <Image
                src="/arrow.png"
                alt="화살표"
                width={32}
                height={32}
                className={styles.arrowImage}
              />
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Image
                  src="/step4.png"
                  alt="AI 추천 아이콘"
                  width={48}
                  height={48}
                  className={styles.stepIcon}
                />
              </div>
              <h4 className={styles.featureTitle}>4. 멍탐정의 추천 받기</h4>
              <p className={styles.featureDescription}>
                AI가 설문과 입력한 정보를 바탕으로
                당신에게 어울리는 강아지를 추천해 줍니다.
              </p>
            </div>
            
            <div className={styles.arrowDown}>
              <Image
                src="/arrow.png"
                alt="화살표"
                width={32}
                height={32}
                className={styles.arrowImage}
              />
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Image
                  src="/step5.png"
                  alt="만나기 아이콘"
                  width={48}
                  height={48}
                  className={styles.stepIcon}
                />
              </div>
              <h4 className={styles.featureTitle}>5. 만나기</h4>
              <p className={styles.featureDescription}>
                제공된 url에 들어가서 추천된 강아지의 상세 정보를 확인할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.stats}>
          <h3 className={styles.sectionTitle}>멍탐정의 성과 엿보기</h3>
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
