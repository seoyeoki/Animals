'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

// 타입 정의
interface MatchingProfile {
  age: number | '';
  gender: 'male' | 'female' | '';
  household: '1' | '2' | '3' | '4' | '5+' | '';
  livingSituation: '아파트' | '주택' | '빌라' | '원룸' | '기타' | ''; // ✨ '여기서 살아요' 상태 추가
  livingSituationOther: string; // ✨ '기타' 입력 상태 추가
  walks: number | '';
  walkDuration: number | '';
  dogSize: '소형' | '중형' | '대형' | '';
  dogPersonalities: string[];
  extraInfo: string;
}

const personalityOptions = ["순한", "똑똑한", "활발한", "사람따름", "호기심", "장난선호"];

export default function MatchingPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<MatchingProfile>({
    age: '',
    gender: '',
    household: '',
    livingSituation: '', // ✨ '여기서 살아요' 초기값 추가
    livingSituationOther: '', // ✨ '기타' 입력 초기값 추가
    walks: '',
    walkDuration: '',
    dogSize: '',
    dogPersonalities: [],
    extraInfo: '',
  });
  // ✨ 사진 첨부 관련 상태 추가
  const [refImage, setRefImage] = useState<File | null>(null);
  const [refImagePreview, setRefImagePreview] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if ((name === 'age' || name === 'walks' || name === 'walkDuration') && Number(value) < 0) return;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePersonalityToggle = (p: string) => {
    setProfile(prev => {
      const isSelected = prev.dogPersonalities.includes(p);
      if (!isSelected && prev.dogPersonalities.length >= 2) {
        alert('성격은 최대 2개까지만 선택할 수 있습니다.');
        return prev;
      }
      const newPersonalities = isSelected
        ? prev.dogPersonalities.filter(item => item !== p)
        : [...prev.dogPersonalities, p];
      return { ...prev, dogPersonalities: newPersonalities };
    });
  };

  // ✨ 사진 첨부 핸들러 함수 추가
  const handleRefImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setRefImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setRefImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setRefImagePreview('');
    }
  };

  // ✨ '다음' 버튼 클릭 시 API 호출하는 함수로 변경
  const handleSubmit = async () => {
    setError(null);
    if (!profile.age || !profile.gender || !profile.household || !profile.walks || !profile.walkDuration || !profile.dogSize || !profile.livingSituation || (profile.livingSituation === '기타' && !profile.livingSituationOther.trim())) {
      setError('모든 필수 항목을 선택 및 입력해주세요.');
      return;
    }
    setIsLoading(true);

    try {
      // ✨ /api/recommend-with-survey에 맞는 형식으로 데이터 구성
      const surveyData = {
        living: profile.livingSituation === '기타' ? profile.livingSituationOther : profile.livingSituation,
        family: `${profile.household === '5+' ? '5인 이상' : `${profile.household}인`} 가구`,
        walk_time: `주 ${profile.walks}회 ${profile.walkDuration}분`,
        dog_size: profile.dogSize,
        preferred_personality: profile.dogPersonalities.join(', '),
      };

      const formData = new FormData();
      formData.append('survey', JSON.stringify(surveyData));
      formData.append('extra_text', profile.extraInfo);
      if (refImage) {
        formData.append('ref_image', refImage);
      }

      const response = await fetch('/api/recommend-with-survey', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: '알 수 없는 오류가 발생했습니다.' }));
        throw new Error(errData.detail || errData.error || '추천에 실패했습니다.');
      }

      const results = await response.json();

      sessionStorage.setItem('matching_survey_results', JSON.stringify(results));
      router.push('/matching-image');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>나랑 맞는 강아지 찾기</h1>

        <div className={styles.formGroup}>
          <label htmlFor="age" className={styles.label}>내 나이는</label>
          <input type="number" name="age" id="age" value={profile.age} onChange={handleInputChange} className={styles.input} placeholder="만 나이" />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>내 성별은</label>
          <div className={styles.radioGroup}>
            <button onClick={() => setProfile(p => ({ ...p, gender: 'male' }))} className={`${styles.radioButton} ${profile.gender === 'male' ? styles.active : ''}`}>남성</button>
            <button onClick={() => setProfile(p => ({ ...p, gender: 'female' }))} className={`${styles.radioButton} ${profile.gender === 'female' ? styles.active : ''}`}>여성</button>
          </div>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>가구원 수</label>
          <div className={styles.radioGroup}>
            {['1', '2', '3', '4', '5'].map(val => (
              <button key={val} onClick={() => setProfile(p => ({ ...p, household: val as any }))} className={`${styles.radioButton} ${profile.household === val ? styles.active : ''}`}>{val}{val === '5' ? '인+' : '인'}</button>
            ))}
          </div>
        </div>

        {/* '여기서 살아요' 섹션 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>여기서 살아요</label>
          <div className={styles.radioGroup}>
            {['아파트', '주택', '빌라', '원룸', '기타'].map(type => (
              <button key={type} onClick={() => setProfile(p => ({ ...p, livingSituation: type as any }))} className={`${styles.radioButton} ${profile.livingSituation === type ? styles.active : ''}`}>{type}</button>
            ))}
          </div>
          {profile.livingSituation === '기타' && (
            <input type="text" name="livingSituationOther" value={profile.livingSituationOther} onChange={handleInputChange} className={styles.input} placeholder="거주 형태를 직접 입력하세요" style={{ marginTop: '10px' }} />
          )}
        </div>

        {/* 산책 정보 섹션 */}
        <div className={`${styles.formGroup} ${styles.inlineGroup}`}>
          <label htmlFor="walks" className={styles.label}>일주일에 산책</label>
          <div className={styles.inputWithUnit}>
            <input type="number" name="walks" id="walks" value={profile.walks} onChange={handleInputChange} className={styles.input} />
            <span>회</span>
          </div>
        </div>
        <div className={`${styles.formGroup} ${styles.inlineGroup}`}>
          <label htmlFor="walkDuration" className={styles.label}>한 번에 산책</label>
          <div className={styles.inputWithUnit}>
            <input type="number" name="walkDuration" id="walkDuration" value={profile.walkDuration} onChange={handleInputChange} className={styles.input} step="5" />
            <span>분</span>
          </div>
        </div>

        {/* 강아지 선호 정보 섹션 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>선호하는 강아지 크기</label>
          <div className={styles.radioGroup}>
            {['소형', '중형', '대형'].map(size => (
              <button key={size} onClick={() => setProfile(p => ({ ...p, dogSize: size as any }))} className={`${styles.radioButton} ${profile.dogSize === size ? styles.active : ''}`}>{size}</button>
            ))}
          </div>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>선호하는 강아지 성격 (최대 2개)</label>
          <div className={styles.tagGroup}>
            {personalityOptions.map(p => (
              <button key={p} onClick={() => handlePersonalityToggle(p)} className={`${styles.tagButton} ${profile.dogPersonalities.includes(p) ? styles.active : ''}`}>{p}</button>
            ))}
          </div>
        </div>

        {/* 추가 정보 및 사진 첨부 섹션 */}
        <div className={styles.formGroup}>
          <label htmlFor="extraInfo" className={styles.label}>이런 강아지면 더 좋겠어요 (선택)</label>
          <textarea name="extraInfo" id="extraInfo" value={profile.extraInfo} onChange={handleInputChange} className={styles.textarea} placeholder="특별히 원하는 강아지의 특징이나 환경에 대해 자유롭게 알려주세요." />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="refImage" className={styles.label}>이런 강아지를 키우고 싶어요 (선택)</label>
          <input type="file" id="refImage" accept="image/*" onChange={handleRefImageChange} className={styles.fileInput} />
          {refImagePreview && <img src={refImagePreview} alt="Preview" className={styles.imagePreview} />}
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.buttonGroup}>
          <button onClick={handleSubmit} className={styles.nextButton} disabled={isLoading}>
            {isLoading ? '다음으로 넘어가는 중...' : '다음'}
          </button>
        </div>
      </div>
    </main>
  );
}