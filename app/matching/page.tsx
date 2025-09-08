'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './page.module.css'

export default function MatchingPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [survey, setSurvey] = useState('')
  const [extraText, setExtraText] = useState('')
  const [topk, setTopk] = useState<number | ''>('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [userProfile, setUserProfile] = useState<any>(null)

  const RECOMMEND_API = 'https://5650e60a6a7b.ngrok-free.app/recommend_with_survey'

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user')
      if (raw) {
        const parsed = JSON.parse(raw)
        setUserProfile(parsed)
      }
    } catch {}
  }, [])

  const handleSubmit = async () => {
    setError('')
    setResult('')
    const parsedTopk = typeof topk === 'string' ? parseInt(topk, 10) : topk
    if (!survey.trim()) {
      setError('첫 번째 항목을 입력해주세요.')
      return
    }
    // extra_text 는 선택 입력
    if (!parsedTopk || isNaN(parsedTopk)) {
      setError('추천 개수를 입력해주세요.')
      return
    }
    if (parsedTopk < 1 || parsedTopk > 20) {
      setError('추천 개수는 1~20 사이여야 합니다.')
      return
    }

    setIsLoading(true)
    try {
      // multipart/form-data 전송 (파일 업로드 지원)
      const form = new FormData()
      form.append('survey', survey.trim())
      form.append('extra_text', (extraText || '').trim())
      if (imageFile) {
        form.append('ref_image', imageFile)
      } else {
        // 서버가 필드 존재를 기대하는 경우를 대비해 빈 값 전송
        form.append('ref_image', new Blob([]), '')
      }

      const url = new URL(RECOMMEND_API)
      url.searchParams.set('topk', String(parsedTopk))

      const resp = await fetch(url.toString(), {
        method: 'POST',
        body: form,
      })
      if (resp.ok) {
        const ct = resp.headers.get('content-type') || ''
        if (ct.includes('application/json')) {
          const data = await resp.json()
          setResult(typeof data === 'string' ? data : JSON.stringify(data))
        } else {
          const text = await resp.text()
          setResult(text)
        }
      } else {
        const text = await resp.text().catch(() => '')
        setError(text ? `오류(${resp.status}): ${text}` : `오류(${resp.status})가 발생했습니다.`)
      }
    } catch (e) {
      setError('서버 요청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className={styles.container}>
      <section className={styles.contentWrapper}>
        <h1 className={styles.title}>매칭</h1>
        <p className={styles.subtitle}>나에게 맞는 반려견을 찾아보세요</p>

        <section className={styles.cards}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>원하는 강아지상 입력하기</h2>
            <p className={styles.cardDesc}>원하는 조건을 입력하고 추천을 받아보세요.</p>
            <button 
              className={styles.primaryButton}
              onClick={() => setIsFormOpen((v) => !v)}
              disabled={isLoading}
            >
              {isFormOpen ? '입력 닫기' : '입력 시작하기'}
            </button>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>나랑 꼭 맞는 강아지 찾기</h2>
            <p className={styles.cardDesc}>프로필 기반 강아지 추천을 받아보세요</p>
            <button 
              className={styles.primaryButton}
              onClick={() => setIsProfileOpen((v) => !v)}
              disabled={isLoading}
            >
              {isProfileOpen ? '프로필 접기' : '프로필 확인하기'}
            </button>
          </div>
        </section>
        {isFormOpen && (
          <div className={styles.formPanel}>
            <div className={styles.formGroup}>
              <label className={styles.label}>무조건 이런 강아지면 좋겠어요</label>
              <textarea 
                className={styles.textArea}
                placeholder="예: 활발하고 산책을 좋아하는 강아지"
                value={survey}
                onChange={(e) => setSurvey(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>이런 특성이 있다면 더 좋아요</label>
              <textarea 
                className={styles.textArea}
                placeholder="예: 사람과 친화적이며 분리불안이 적어요"
                value={extraText}
                onChange={(e) => setExtraText(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>참고 이미지 (선택)</label>
              <div className={styles.imageRow}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null
                    setImageFile(f)
                    if (f) {
                      const reader = new FileReader()
                      reader.onload = (ev) => setImagePreview(String(ev.target?.result || ''))
                      reader.readAsDataURL(f)
                    } else {
                      setImagePreview('')
                    }
                  }}
                  disabled={isLoading}
                />
                {imagePreview && (
                  <img src={imagePreview} alt="미리보기" className={styles.imagePreview} />
                )}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroupInline}>
                <label className={styles.label}>추천 개수</label>
                <input
                  className={styles.numberInput}
                  type="number"
                  min={1}
                  max={20}
                  placeholder="0~20"
                  value={topk}
                  onChange={(e) => {
                    const v = e.target.value
                    if (v === '') return setTopk('')
                    const n = Number(v)
                    if (!Number.isNaN(n)) setTopk(n)
                  }}
                  disabled={isLoading}
                />
              </div>
              <div className={styles.trailingText}>마리 추천 받을래요</div>
            </div>

            {error && <div className={styles.errorText}>{error}</div>}

            <button 
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? '요청 중...' : '추천 받기'}
            </button>

            {result && (
              <div className={styles.resultBox}>
                <pre className={styles.resultPre}>{result}</pre>
              </div>
            )}
          </div>
        )}
        {isProfileOpen && (
          <div className={styles.profilePanel}>
            <h3 className={styles.profileTitle}>내 프로필</h3>
            {userProfile ? (
              <div className={styles.profileContent}>
                <div className={styles.profileRow}><span className={styles.profileKey}>이름</span><span className={styles.profileVal}>{userProfile?.name ?? '정보 없음'}</span></div>
                <div className={styles.profileRow}><span className={styles.profileKey}>이메일</span><span className={styles.profileVal}>{userProfile?.email ?? '정보 없음'}</span></div>
                <div className={styles.profileRow}><span className={styles.profileKey}>기타</span><span className={styles.profileVal}><pre className={styles.profilePre}>{JSON.stringify(userProfile, null, 2)}</pre></span></div>
              </div>
            ) : (
              <div className={styles.profileEmpty}>로그인 정보가 없어요. 로그인 후 이용해 주세요.</div>
            )}
            <div className={styles.profileCtaWrap}>
              {userProfile ? (
                <Link href="/mypage" className={styles.beigeButton}>프로필 수정하러 가기</Link>
              ) : (
                <Link href="/login" className={styles.beigeButton}>로그인하러 가기</Link>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

