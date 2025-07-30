import React from 'react'
import styles from './page.module.css'

export default function AdoptionPage() {
  // Sample data for available pets
  const pets = [
    { id: 1, name: '몽이', type: '강아지', age: '2세', location: '서울 강서', gender: '수컷', size: '중형견' },
    { id: 2, name: '나비', type: '고양이', age: '1세', location: '서울 중구', gender: '암컷', size: '소형' },
    { id: 3, name: '초코', type: '강아지', age: '3세', location: '서울 강남', gender: '암컷', size: '소형견' },
    { id: 4, name: '루이', type: '고양이', age: '4세', location: '서울 서초', gender: '수컷', size: '중형' },
    { id: 5, name: '별이', type: '강아지', age: '1세', location: '서울 종로', gender: '암컷', size: '대형견' },
    { id: 6, name: '코코', type: '고양이', age: '2세', location: '서울 마포', gender: '수컷', size: '소형' }
  ]

  const locations = ['전체', '서울 강서', '서울 중구', '서울 강남', '서울 서초', '서울 종로', '서울 마포']
  const types = ['전체', '강아지', '고양이']
  const ages = ['전체', '1세', '2세', '3세', '4세']

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>입양 및 입소</h1>
        
        <div className={styles.subtitle}>
          <p>사랑이 필요한 친구들이 여러분을 기다리고 있어요</p>
        </div>

        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>지역</label>
            <select className={styles.filterSelect}>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>종류</label>
            <select className={styles.filterSelect}>
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>나이</label>
            <select className={styles.filterSelect}>
              {ages.map(age => (
                <option key={age} value={age}>{age}</option>
              ))}
            </select>
          </div>

          <button className={styles.searchButton}>검색</button>
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{pets.length}</span>
            <span className={styles.statLabel}>마리가 기다리고 있어요</span>
          </div>
        </div>

        <div className={styles.petGrid}>
          {pets.map(pet => (
            <div key={pet.id} className={styles.petCard}>
              <div className={styles.petImage}></div>
              <div className={styles.petInfo}>
                <h3 className={styles.petName}>{pet.name}</h3>
                <div className={styles.petDetails}>
                  <span className={styles.petDetail}>{pet.type}</span>
                  <span className={styles.petDetail}>{pet.age}</span>
                  <span className={styles.petDetail}>{pet.gender}</span>
                </div>
                <div className={styles.petLocation}>
                  <span className={styles.locationIcon}>📍</span>
                  <span>{pet.location}</span>
                </div>
                <div className={styles.petSize}>
                  <span className={styles.sizeTag}>{pet.size}</span>
                </div>
                <button className={styles.adoptButton}>입양 신청</button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.emergency}>
          <h2 className={styles.emergencyTitle}>긴급 입양이 필요해요</h2>
          <p className={styles.emergencyDescription}>
            특별한 관심이 필요하거나 긴급한 상황의 동물들입니다
          </p>
          <div className={styles.emergencyGrid}>
            <div className={styles.emergencyCard}>
              <div className={styles.emergencyBadge}>긴급</div>
              <div className={styles.emergencyImage}></div>
              <div className={styles.emergencyInfo}>
                <h4 className={styles.emergencyName}>토토</h4>
                <p className={styles.emergencyDesc}>수술이 필요한 강아지입니다</p>
                <button className={styles.emergencyButton}>긴급 입양 신청</button>
              </div>
            </div>
            <div className={styles.emergencyCard}>
              <div className={styles.emergencyBadge}>긴급</div>
              <div className={styles.emergencyImage}></div>
              <div className={styles.emergencyInfo}>
                <h4 className={styles.emergencyName}>미미</h4>
                <p className={styles.emergencyDesc}>노령묘, 특별한 보살핌 필요</p>
                <button className={styles.emergencyButton}>긴급 입양 신청</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
