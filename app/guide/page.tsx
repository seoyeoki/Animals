import React from 'react'
import styles from './page.module.css'

export default function GuidePage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>이용 방법</h1>
        
        <div className={styles.intro}>
          <p className={styles.introText}>
            4단계로 간단히 새로운 가족을 만나보세요
          </p>
        </div>

        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>회원가입 및 프로필 작성</h3>
              <p className={styles.stepDescription}>
                기본 정보와 반려동물 선호도를 입력하여 프로필을 완성하세요. 
                생활 환경, 경험, 선호하는 동물 크기 등을 상세히 작성해주시면 
                더 정확한 매칭이 가능합니다. (아니면, 챗봇과 대화하며 자신도 모르던 반려동물 취향에 대해 알아가보세요!)
              </p>
              <div className={styles.stepImage}></div>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>입양 가능한 동물 둘러보기</h3>
              <p className={styles.stepDescription}>
                지역별, 종류별로 입양을 기다리는 동물들을 확인하세요. 
                각 동물의 상세 정보, 성격, 건강 상태 등을 자세히 살펴보고 
                마음에 드는 친구를 찾아보세요.
              </p>
              <div className={styles.stepImage}></div>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>입양 신청 및 상담</h3>
              <p className={styles.stepDescription}>
                마음에 드는 동물이 있다면 입양 신청서를 작성하세요. 
                반려동물 등록자와 1:1 상담을 하며 입양 준비사항과 
                주의사항을 자세히 안내받을 수 있습니다.
              </p>
              <div className={styles.stepImage}></div>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>4</div>
            <div className={styles.stepContent}>
              <h3 className={styles.stepTitle}>입양 완료 및 사후 관리</h3>
              <p className={styles.stepDescription}>
                입양이 확정되면 건강한 입양을 위한 준비물과 가이드를 제공합니다. 
                입양 후에도 지속적인 상담과 건강 관리 지원을 통해 
                행복한 반려생활을 도와드립니다.
              </p>
              <div className={styles.stepImage}></div>
            </div>
          </div>
        </div>

        <div className={styles.tips}>
          <h2 className={styles.tipsTitle}>입양 전 꼭 확인하세요</h2>
          <div className={styles.tipsList}>
            <div className={styles.tipItem}>
              <div className={styles.tipIcon}>✅</div>
              <div className={styles.tipText}>가족 구성원 모두가 동의하는지 확인</div>
            </div>
            <div className={styles.tipItem}>
              <div className={styles.tipIcon}>✅</div>
              <div className={styles.tipText}>충분한 시간과 경제적 여유 확보</div>
            </div>
            <div className={styles.tipItem}>
              <div className={styles.tipIcon}>✅</div>
              <div className={styles.tipText}>반려동물 용품 및 환경 준비</div>
            </div>
            <div className={styles.tipItem}>
              <div className={styles.tipIcon}>✅</div>
              <div className={styles.tipText}>근처 동물병원 정보 파악</div>
            </div>
          </div>
        </div>

        <div className={styles.cta}>
          <h3 className={styles.ctaTitle}>준비가 되셨나요?</h3>
          <p className={styles.ctaDescription}>지금 바로 새로운 가족을 만나러 가세요!</p>
          <button className={styles.ctaButton}>입양 동물 보러가기</button>
        </div>
      </div>
    </div>
  )
}
