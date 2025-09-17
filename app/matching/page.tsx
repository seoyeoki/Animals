'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './page.module.css'
import { RECOMMEND_API_BASE } from '@/app/api-url';

// --- 인터페이스 정의 (기존과 동일) ---
interface UserData {
  id: string
  email: string
  nickname: string
}

interface PersonalInfo {
  age: number | '';
  gender: 'male' | 'female' | '';
  household: '1' | '2' | '3' | '4' | '5+' | '';
  walks: number | '';
  otherInfo: string;
  favDogImage: string | null;
}

interface DogDetail {
  desertionNo: string;
  kindCd: string;
  knm?: string;
  popfile: string;
  age: string;
  weight: string;
  sexCd: string;
  neuterYn: string;
  specialMark: string;
}

// Base64 문자열을 Blob 객체로 변환하는 헬퍼 함수
const dataURItoBlob = (dataURI: string) => {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
};

export default function MatchingPage() {
  // --- 상태(State) 정의 (기존과 동일) ---
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(true)
  const [survey, setSurvey] = useState('')
  const [extraText, setExtraText] = useState('')
  const [topk, setTopk] = useState<number | ''>('')
  const [surveyImageFile, setSurveyImageFile] = useState<File | null>(null)
  const [surveyImagePreview, setSurveyImagePreview] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [userData, setUserData] = useState<UserData | null>(null)
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null)
  const [dogDetails, setDogDetails] = useState<DogDetail[] | null>(null);

  const SURVEY_API = `/api/recommend-with-survey`
  const PROFILE_API = `/api/profile-recommend`

  useEffect(() => {
    try {
      const userRaw = localStorage.getItem('user')
      if (userRaw) {
        setUserData(JSON.parse(userRaw))
      }
      const personalInfoRaw = localStorage.getItem('personalInfo')
      if (personalInfoRaw) {
        setPersonalInfo(JSON.parse(personalInfoRaw))
      }
    } catch (e) {
      console.error("Failed to load data from localStorage", e)
    }
  }, [])

  // --- '설문으로 찾기' 관련 핸들러 함수들 ---
  const handleSurveyImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSurveyImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSurveyImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSurveyImagePreview('');
    }
  };
  
  // ✨✨✨ 추천 강아지 수 입력 핸들러 (1~5 사이 값만 허용) ✨✨✨
  const handleTopkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setTopk('');
      return;
    }

    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) {
      setTopk('');
      return;
    }

    if (numValue > 5) {
      setTopk(5); // 5보다 크면 5로 고정
    } else if (numValue < 1) {
      setTopk(''); // 1보다 작으면 (예: 0) 입력값을 비움
    } else {
      setTopk(numValue); // 1~5 사이면 그대로 설정
    }
  };

  const handleSubmit = async () => {
    setError('')
    setResult('')
    setDogDetails(null)
    
    // ✨✨✨ 입력값 검증 강화 ✨✨✨
    const parsedTopk = typeof topk === 'string' ? parseInt(topk, 10) : topk
    if (!survey.trim()) {
      setError('어떤 강아지를 찾는지 입력해주세요.')
      return
    }
    if (!parsedTopk || isNaN(parsedTopk) || parsedTopk < 1 || parsedTopk > 5) {
      setError('추천받을 강아지 수는 1에서 5 사이의 숫자로 입력해주세요.')
      return
    }

    setIsLoading(true)

    const form = new FormData();
    form.append('survey', survey.trim());
    form.append('extra_text', (extraText || '').trim());
    form.append('top_k', String(parsedTopk));

    if (surveyImageFile) {
      form.append('ref_image', surveyImageFile);
    }

    try {
      const resp = await fetch(SURVEY_API, {
        method: 'POST',
        body: form,
      });

      if (resp.ok) {
        const data = await resp.json()
        setResult(JSON.stringify(data, null, 2))
      } else {
        const text = await resp.text().catch(() => '')
        setError(text ? `오류(${resp.status}): ${text}` : `오류(${resp.status})가 발생했습니다.`)
      }
    } catch (err: any) {
      setError('서버 요청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  // '프로필로 찾기' 핸들러 함수 (기존과 동일)
  const handleProfileMatch = async () => {
    setError('');
    setResult('');
    setDogDetails(null);

    if (!personalInfo || !personalInfo.favDogImage) {
      setError('마이페이지에서 프로필 정보와 강아지 사진을 모두 등록해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const profileString = [
        personalInfo.age ? `나이: ${personalInfo.age}` : '',
        personalInfo.gender ? `성별: ${personalInfo.gender}` : '',
        personalInfo.household ? `가구원 수: ${personalInfo.household}` : '',
        personalInfo.walks ? `산책 횟수: ${personalInfo.walks}` : '',
        personalInfo.otherInfo || '',
      ].filter(Boolean).join(', ');

      const form = new FormData();
      form.append('profile', profileString);
      const imageBlob = dataURItoBlob(personalInfo.favDogImage);
      form.append('ref_image', imageBlob, 'dog_image.png');

      const response = await fetch(PROFILE_API, {
        method: 'POST',
        body: form,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'API 요청 실패' }));
        throw new Error(errorData.error || '추천 목록을 가져오는 데 실패했습니다.');
      }

      const finalDogDetails: DogDetail[] = await response.json();

      if (finalDogDetails.length === 0) {
        setResult('추천 조건에 맞는 강아지를 찾지 못했습니다.');
      } else {
        setDogDetails(finalDogDetails);
        setResult(`총 ${finalDogDetails.length}마리의 강아지를 추천합니다!`);
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderGender = (gender: 'male' | 'female' | '') => {
    if (gender === 'male') return '남성';
    if (gender === 'female') return '여성';
    return '정보 없음';
  }

  // --- 렌더링(JSX) 부분 ---
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>나랑 꼭 맞는 강아지 찾기</h1>
      <section className={styles.contentWrap}>
        <div className={styles.toggleWrap}>
          <button
            className={`${styles.toggleButton} ${isFormOpen ? styles.active : ''}`}
            onClick={() => {
              setIsFormOpen(true);
              setIsProfileOpen(false);
              setResult('');
              setError('');
              setDogDetails(null);
            }}
          >
            설문으로 찾기
          </button>
          <button
            className={`${styles.toggleButton} ${isProfileOpen ? styles.active : ''}`}
            onClick={() => {
              setIsProfileOpen(true);
              setIsFormOpen(false);
              setResult('');
              setError('');
              setDogDetails(null);
            }}
          >
            프로필로 찾기
          </button>
        </div>

        {isFormOpen && (
          <div className={styles.infoCard}>
            <h3 className={styles.infoTitle}>설문으로 찾기</h3>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="survey-textarea">
                1. 어떤 강아지를 찾고 계신가요?
              </label>
              <textarea
                id="survey-textarea"
                className={styles.formTextarea}
                value={survey}
                onChange={(e) => setSurvey(e.target.value)}
                placeholder="예) 활발하고 사람을 잘 따르는 작은 강아지를 원해요."
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="survey-image-input">
                2. 마음에 드는 강아지 사진이 있다면 올려주세요. (선택)
              </label>
              <div className={styles.fileInputContainer}>
                <input
                  type="file"
                  id="survey-image-input"
                  accept="image/*"
                  onChange={handleSurveyImageChange}
                  className={styles.fileInput}
                />
                <label htmlFor="survey-image-input" className={styles.fileInputLabel}>
                  파일 선택
                </label>
              </div>
              {surveyImagePreview && (
                <div className={styles.imagePreviewContainer}>
                  <img src={surveyImagePreview} alt="Preview" className={styles.imagePreview} />
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="extra-text-input">
                3. 기타 정보 (선택)
              </label>
              <input
                id="extra-text-input"
                type="text"
                className={styles.formInput}
                value={extraText}
                onChange={(e) => setExtraText(e.target.value)}
                placeholder="추가로 고려할 사항을 자유롭게 적어주세요."
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="topk-input">
                4. 몇 마리의 강아지를 추천받을까요? (1~5마리)
              </label>
              <input
                id="topk-input"
                type="number"
                className={styles.formInput}
                value={topk}
                // ✨✨✨ onChange 핸들러 변경 ✨✨✨
                onChange={handleTopkChange} 
                placeholder="1에서 5 사이의 숫자를 입력하세요"
                // ✨✨✨ 브라우저 기본 유효성 검사 추가 ✨✨✨
                min="1"
                max="5"
              />
            </div>

            <div className={styles.buttonWrap}>
              <button className={styles.primaryButton} onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? '찾는 중...' : '결과 보기'}
              </button>
            </div>
          </div>
        )}

        {isProfileOpen && (
          <div className={`${styles.infoCard} ${styles.profileCard}`}>
            <h3 className={styles.infoTitle}>내 프로필</h3>
            {userData ? (
              // 로그인 상태일 때만 프로필 정보 표시
              <>
                <div className={styles.infoItemNoBorder}>
                  <span className={styles.infoLabel}>닉네임:</span>
                  <span className={styles.infoValue}>{userData.nickname || '정보 없음'}</span>
                </div>
                {personalInfo && (
                  <div className={styles.personalInfoGroup}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>나이:</span>
                      <span className={styles.infoValue}>{personalInfo.age ? `${personalInfo.age}세` : '정보 없음'}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>성별:</span>
                      <span className={styles.infoValue}>{renderGender(personalInfo.gender)}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>가구원 수:</span>
                      <span className={styles.infoValue}>{personalInfo.household ? `${personalInfo.household}인 가구` : '정보 없음'}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>산책 가능 횟수:</span>
                      <span className={styles.infoValue}>{personalInfo.walks ? `주당 ${personalInfo.walks}회` : '정보 없음'}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>기타사항:</span>
                      <span className={styles.infoValue}>{personalInfo.otherInfo || '정보 없음'}</span>
                    </div>
                    {personalInfo.favDogImage && (
                      <div className={styles.infoItemImage}>
                        <span className={styles.infoLabelImage}>마음에 드는 강아지:</span>
                        <div className={styles.imagePreviewContainer}>
                          <img src={personalInfo.favDogImage} alt="마음에 드는 강아지" className={styles.imagePreview} />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              // 로그아웃 상태일 때 메시지 표시
              <div className={styles.profileEmpty}>로그인 정보가 없어요. 로그인 후 이용해 주세요.</div>
            )}

            {/* ✨✨✨ 변경된 부분 시작 ✨✨✨ */}
            <div className={styles.profileCtaWrap}>
              {/* userData가 있을 때만 '프로필로 강아지 추천받기' 버튼 렌더링 */}
              {userData && (
                <button
                  className={styles.primaryButton}
                  onClick={handleProfileMatch}
                  disabled={isLoading}
                >
                  {isLoading ? '추천 찾는 중...' : '프로필로 강아지 추천받기'}
                </button>
              )}
              {userData ? (
                <Link href="/mypage" className={styles.secondaryButton}>프로필 수정하러 가기</Link>
              ) : (
                <Link href="/login" className={styles.secondaryButton}>로그인하기</Link>
              )}
            </div>
            {/* ✨✨✨ 변경된 부분 끝 ✨✨✨ */}

          </div>
        )}

        {/* --- 결과 표시 영역 (공통 사용, 기존과 동일) --- */}
        <div className={styles.resultArea}>
          {error && (
            <div className={styles.errorBox}>
              <p className={styles.errorP}>{error}</p>
            </div>
          )}

          {dogDetails && dogDetails.length > 0 && (
            <div className={styles.recommendationsWrap}>
              <h4 className={styles.recommendationsTitle}>추천 강아지 목록</h4>
              <div className={styles.recommendationsGrid}>
                {dogDetails.map((dog, index) => (
                  <Link href={`/adoption-detail?desertion_no=${dog.desertionNo}`} key={dog.desertionNo} className={styles.recommendationItem}>
                    <img src={dog.popfile} alt={dog.kindCd} className={styles.recImage} />
                    <div className={styles.recRank}>No. {index + 1}</div>
                    <div className={styles.recInfo}>
                      <div className={styles.recBreed}>{dog.kindCd}</div>
                      <div className={styles.recDetail}>{`${dog.age} / ${dog.weight}`}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {result && (
            <div className={styles.recommendationTextWrap}>
              <pre className={styles.recommendationText}>{result}</pre>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}