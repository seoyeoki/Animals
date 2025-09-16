'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'
import Header from '../components/Header'

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

export default function MyPage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [age, setAge] = useState<number | ''>('')
  const [gender, setGender] = useState<'male' | 'female' | ''>('')
  const [household, setHousehold] = useState<'1' | '2' | '3' | '4' | '5+' | ''>('')
  const [walks, setWalks] = useState<number | ''>('')
  const [otherInfo, setOtherInfo] = useState('')
  const [favDogImage, setFavDogImage] = useState<File | null>(null)
  const [favDogImagePreview, setFavDogImagePreview] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loginStatus = localStorage.getItem('isLoggedIn')
    const user = localStorage.getItem('user')
    const personalInfo = localStorage.getItem('personalInfo')

    if (loginStatus === 'true' && user) {
      try {
        const parsedUser = JSON.parse(user) as UserData
        setUserData(parsedUser)
        
        if (personalInfo) {
          const parsedInfo = JSON.parse(personalInfo) as PersonalInfo;
          setAge(parsedInfo.age || '');
          setGender(parsedInfo.gender || '');
          setHousehold(parsedInfo.household || '');
          setWalks(parsedInfo.walks || '');
          setOtherInfo(parsedInfo.otherInfo || '');
          setFavDogImagePreview(parsedInfo.favDogImage || null);
        }
        
      } catch (error) {
        console.error('Failed to parse user data:', error)
        router.push('/login')
        return
      }
    } else {
      router.push('/login')
      return
    }
    
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('isLoggedIn')
    window.dispatchEvent(new Event('localStorageChange'))
    router.push('/')
  }

  const handleSaveInfo = () => {
    const personalInfo = {
      age,
      gender,
      household,
      walks,
      otherInfo,
      favDogImage: favDogImagePreview // Base64 string is already in preview state
    };
    
    localStorage.setItem('personalInfo', JSON.stringify(personalInfo));
    
    alert('개인 정보가 저장되었습니다.');
    setIsEditing(false);
  }

  const handleEditInfo = () => {
    setIsEditing(true);
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFavDogImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFavDogImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFavDogImagePreview(null);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.loading}>로딩 중...</div>
        </main>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.pageTitle}>
          <h1 className={styles.title}>마이 페이지</h1>
        </div>

        <div className={styles.userInfo}>
          <div className={styles.infoCard}>
            <h2 className={styles.infoTitle}>사용자 정보</h2>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>닉네임:</span>
              <span className={styles.infoValue}>{userData?.nickname || '별명 없음'}</span>
            </div>
          </div>
        </div>

        <div className={styles.personalInfoSection}>
          <div className={`${styles.infoCard} ${isEditing ? styles.editMode : ''}`}>
            <h2 className={styles.infoTitle}>반려견과의 행복한 생활을 위한 정보</h2>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>나이</label>
              <input 
                type="text"
                value={age}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '') {
                    setAge('');
                  } else {
                    const num = parseInt(val, 10);
                    if (!isNaN(num) && num >= 0 && num <= 130) {
                      setAge(num);
                    }
                  }
                }}
                className={styles.formInput}
                placeholder="나이를 입력하세요"
                disabled={!isEditing}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>성별</label>
              <div className={styles.genderSelect}>
                <button 
                  onClick={() => setGender('male')} 
                  className={`${styles.genderButton} ${gender === 'male' ? styles.selected : ''}`}
                  disabled={!isEditing}
                >
                  남
                </button>
                <button 
                  onClick={() => setGender('female')} 
                  className={`${styles.genderButton} ${gender === 'female' ? styles.selected : ''}`}
                  disabled={!isEditing}
                >
                  여
                </button>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>가구원 수</label>
              <div className={styles.householdSelect}>
                {['1', '2', '3', '4', '5+'].map(val => (
                  <button
                    key={val}
                    onClick={() => setHousehold(val as '1' | '2' | '3' | '4' | '5+')}
                    className={`${styles.householdButton} ${household === val ? styles.selected : ''}`}
                    disabled={!isEditing}
                  >
                    {val === '5+' ? '5인 이상' : `${val}인 가구`}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>산책 가능 횟수</label>
              <div className={styles.walksGroup}>
                <span className={styles.walksPrefix}>주당</span>
                <select
                  value={walks}
                  onChange={(e) => setWalks(parseInt(e.target.value, 10))}
                  className={styles.walksSelect}
                  disabled={!isEditing}
                >
                  <option value="">선택</option>
                  {[...Array(8).keys()].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <span className={styles.walksSuffix}>회</span>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>기타사항</label>
              <textarea 
                value={otherInfo}
                onChange={(e) => setOtherInfo(e.target.value)}
                className={styles.formTextarea}
                placeholder="주거형태, 근무형태, 생활습관, 특이사항 등을 입력해주세요"
                disabled={!isEditing}
              />
            </div>

            {/* 마음에 드는 강아지 사진 입력 필드 */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>마음에 드는 강아지</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={styles.fileInput}
                disabled={!isEditing}
              />
              {favDogImagePreview && (
                <div className={styles.imagePreviewContainer}>
                  <img src={favDogImagePreview} alt="마음에 드는 강아지 미리보기" className={styles.imagePreview} />
                </div>
              )}
            </div>
            
            {!isEditing ? (
              <button className={styles.editButton} onClick={handleEditInfo}>
                정보 수정하기
              </button>
            ) : (
              <button className={styles.saveButton} onClick={handleSaveInfo}>
                정보 저장하기
              </button>
            )}
          </div>
        </div>
        
        <div className={styles.actionButtons}>
          <button className={styles.logoutButton} onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </main>
    </div>
  )
}