'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function MatchingImagePage() {
  const router = useRouter();
  
  const [profileText, setProfileText] = useState('');
  const [refImage, setRefImage] = useState<File | null>(null);
  const [refImagePreview, setRefImagePreview] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async () => {
    if (!profileText.trim() || !refImage) {
      setError('모든 항목을 입력하고 사진을 첨부해주세요.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      
      // ✨ 1. curl 명령어에 맞춰 'profile'과 'ref_image' 필드를 추가합니다.
      formData.append('profile', profileText);
      formData.append('ref_image', refImage);

      // ✨ 디버깅을 위한 로그
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      // ✨ 2. 지정된 API 라우트('/api/profile-recommend')를 호출합니다.
      const response = await fetch('/api/profile-recommend?topk=6', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: '알 수 없는 오류가 발생했습니다.' }));
        throw new Error(errData.detail || errData.error || '추천에 실패했습니다.');
      }
      
      const results = await response.json();
      
      // ✨ 3. 결과를 별도의 키('matching_image_results')로 저장합니다.
      sessionStorage.setItem('matching_image_results', JSON.stringify(results));
      router.push('/matching/results');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>이미지와 닮은 강아지 찾기</h1>
        <div className={styles.formGroup}>
          <label htmlFor="profileText" className={styles.label}>저는 이런 입양자예요</label>
          <textarea
            id="profileText"
            value={profileText}
            onChange={(e) => setProfileText(e.target.value)}
            className={styles.textarea}
            placeholder="반려동물과 함께할 환경이나 입양 희망자분의 생활 패턴에 대해 자유롭게 알려주세요."
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="refImage" className={styles.label}>가장 마음에 드는 강아지 (사진)</label>
          <input type="file" id="refImage" accept="image/*" onChange={handleRefImageChange} className={styles.fileInput} />
          {refImagePreview && <img src={refImagePreview} alt="Preview" className={styles.imagePreview} />}
        </div>
        
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.buttonGroup}>
          <button onClick={() => router.back()} className={styles.prevButton} disabled={isLoading}>이전</button>
          <button onClick={handleSubmit} className={styles.submitButton} disabled={isLoading}>
            {isLoading ? '추천받는 중...' : '강아지 추천받기'}
          </button>
        </div>
      </div>
    </main>
  );
}