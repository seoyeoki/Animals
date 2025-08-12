'use client'

import React, { useState } from 'react'
import styles from './Chatbot.module.css'

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [message, setMessage] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleToggle = () => {
    if (isAnimating) return // 애니메이션 중에는 클릭 무시
    
    setIsAnimating(true)
    
    if (!isOpen) {
      // 채팅창 열기
      setIsOpen(true)
      setTimeout(() => {
        setIsAnimating(false)
      }, 300) // 애니메이션 시간과 동일
    } else {
      // 채팅창 닫기
      setIsOpen(false)
      setTimeout(() => {
        setIsAnimating(false)
      }, 300) // 애니메이션 시간과 동일
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // 파일 타입 검증
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.')
        return
      }
      
      // 파일 크기 검증 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하여야 합니다.')
        return
      }
      
      setSelectedImage(file)
      
      // 이미지 미리보기 생성
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
  }

  const handleSendMessage = () => {
    if (!message.trim() && !selectedImage) return
    
    console.log('메시지 전송:', message)
    if (selectedImage) {
      console.log('이미지 전송:', selectedImage.name)
    }
    
    // 메시지와 이미지 전송 후 초기화
    setMessage('')
    setSelectedImage(null)
    setImagePreview(null)
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className={styles.chatbot}>
      {/* 채팅창 */}
      <div className={`${styles.chatbotWindow} ${isOpen ? styles.show : styles.hide}`}>
        <div className={styles.chatbotHeader}>
          <h3 className={styles.chatbotTitle}>AI 상담사</h3>
          <button className={styles.closeButton} onClick={handleToggle}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className={styles.chatbotContent}>
          <div className={styles.chatbotMessage}>
            <div className={styles.messageBubble}>
              안녕하세요! 반려동물 입양에 대해 궁금한 점이 있으시면 언제든 물어보세요. 🐕🐱
            </div>
          </div>
          <div className={styles.chatbotInput}>
            {/* 이미지 미리보기 */}
            {imagePreview && (
              <div className={styles.imagePreview}>
                <img src={imagePreview} alt="미리보기" className={styles.previewImage} />
                <button className={styles.removeImageButton} onClick={removeImage}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            )}
            
            <div className={styles.inputContainer}>
              <input 
                type="text" 
                placeholder="메시지를 입력하세요..."
                className={styles.inputField}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              
              {/* 이미지 업로드 버튼 */}
              <label className={styles.imageUploadButton}>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" fill="currentColor"/>
                </svg>
              </label>
              
              <button className={styles.sendButton} onClick={handleSendMessage}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 챗봇 버튼 */}
      <button 
        className={`${styles.chatbotButton} ${isOpen ? styles.buttonMoved : ''}`} 
        onClick={handleToggle}
        disabled={isAnimating}
      >
        <img 
          src="https://api.builder.io/api/v1/image/assets/TEMP/c829a260964bfc445a8395b93b2849770b8c9ec9?width=158" 
          alt="ChatBot" 
          className={styles.chatbotIcon}
        />
      </button>
    </div>
  )
} 