'use client'

import React, { useState, useRef, useEffect } from 'react'
import styles from './Chatbot.module.css'



interface ApiResponse {
  recommendation: string
  similar: Array<{
    idx: number
    sim: number
    url: string
  }>
}

interface Message {
  id: string
  type: 'user' | 'bot'
  text: string
  image?: string
  similarImages?: Array<{
    idx: number
    sim: number
    url: string
  }>
  timestamp: Date
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [message, setMessage] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      text: '안녕하세요! 반려동물 입양에 대해 궁금한 점이 있으시면 언제든 물어보세요. 🐕🐱\n\n📸 강아지 사진을 업로드하고\n💬 원하는 조건을 입력해주시면\n🤖 AI가 적합한 품종을 추천해드릴게요!',
      timestamp: new Date()
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [isServerHealthy, setIsServerHealthy] = useState<boolean | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null)

  const scrollToBottom = () => {
    try {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    } catch (error) {
      console.error('스크롤 오류:', error)
    }
  }

  // 백엔드 서버 헬스 체크 함수
  const checkServerHealth = async (): Promise<boolean> => {
    try {
      console.log('헬스 체크 시작: /api/health')
      
      const response = await fetch('/api/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      console.log('헬스 체크 응답 상태:', response.status, response.statusText)

      if (response.ok) {
        const data = await response.json()
        console.log('헬스 체크 응답 데이터:', data)
        const isHealthy = data.ok === true
        console.log('서버 상태:', isHealthy ? '정상' : '비정상')
        return isHealthy
      } else {
        console.error('헬스 체크 실패 - HTTP 상태:', response.status)
        return false
      }
    } catch (error) {
      console.error('서버 헬스 체크 실패:', error)
      return false
    }
  }

  useEffect(() => {
    // 메시지가 추가될 때마다 스크롤
    scrollToBottom()
  }, [messages])

  // 컴포넌트 마운트 시 서버 헬스 체크
  useEffect(() => {
    let isMounted = true
    
    const checkHealth = async () => {
      try {
        console.log('컴포넌트 마운트 시 헬스 체크 시작')
        const isHealthy = await checkServerHealth()
        console.log('헬스 체크 결과:', isHealthy)
        if (isMounted) {
          setIsServerHealthy(isHealthy)
          console.log('서버 상태 업데이트:', isHealthy ? '연결됨' : '연결 불가')
        }
      } catch (error) {
        console.error('헬스 체크 중 오류:', error)
        if (isMounted) {
          setIsServerHealthy(false)
          console.log('오류로 인해 서버 상태를 연결 불가로 설정')
        }
      }
    }
    
    checkHealth()
    
    return () => {
      isMounted = false
    }
  }, [])

  // 로딩 상태가 변경될 때도 스크롤
  useEffect(() => {
    if (isLoading) {
      scrollToBottom()
    }
  }, [isLoading])

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current)
      }
    }
  }, [])

  const handleToggle = () => {
    if (isAnimating) return // 애니메이션 중에는 클릭 무시
    
    // 기존 타이머 정리
    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current)
    }
    
    setIsAnimating(true)
    
    if (!isOpen) {
      // 채팅창 열기
      setIsOpen(true)
      animationTimerRef.current = setTimeout(() => {
        setIsAnimating(false)
      }, 300) // 애니메이션 시간과 동일
    } else {
      // 채팅창 닫기
      setIsOpen(false)
      animationTimerRef.current = setTimeout(() => {
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

  const handleSendMessage = async () => {
    // 텍스트와 이미지 모두 필수
    if (!message.trim()) {
      alert('메시지를 입력해주세요.')
      return
    }
    
    if (!selectedImage) {
      alert('강아지 사진을 업로드해주세요.')
      return
    }
    
    // 사용자 메시지 추가
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: message,
      image: imagePreview || undefined,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    
    let isMounted = true
    
    try {
      // 먼저 서버 헬스 체크 수행
      console.log('메시지 전송 전 헬스 체크 시작')
      const isHealthy = await checkServerHealth()
      console.log('메시지 전송 전 헬스 체크 결과:', isHealthy)
      
      if (isMounted) {
        setIsServerHealthy(isHealthy)
      }
      
      if (!isHealthy) {
        console.log('서버가 비정상 상태이므로 메시지 전송 중단')
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          text: '죄송합니다. AI 서버가 현재 사용할 수 없습니다. 잠시 후 다시 시도해주세요.',
          timestamp: new Date()
        }
        if (isMounted) {
          setMessages(prev => [...prev, errorMessage])
        }
        return
      }

             // FormData 생성
       const formData = new FormData()
       formData.append('user_text', message.trim()) // 공백 제거
       formData.append('image', selectedImage)
       formData.append('top_k', '5')

      // 백엔드 API 호출 (프록시 사용)
      const response = await fetch('/api/recommend-and-search', {
        method: 'POST',
        body: formData
      })

             if (response.ok) {
         const data: ApiResponse = await response.json()
         
         // 봇 응답 생성
         const botMessage: Message = {
           id: (Date.now() + 1).toString(),
           type: 'bot',
           text: data.recommendation,
           similarImages: data.similar,
           timestamp: new Date()
         }
         
         if (isMounted) {
           setMessages(prev => [...prev, botMessage])
         }
      } else {
        const errorData = await response.json()
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          text: `죄송합니다. ${errorData.error}`,
          timestamp: new Date()
        }
        if (isMounted) {
          setMessages(prev => [...prev, errorMessage])
        }
      }
    } catch (error) {
      console.error('API 호출 오류:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: '서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.',
        timestamp: new Date()
      }
      if (isMounted) {
        setMessages(prev => [...prev, errorMessage])
      }
    } finally {
      if (isMounted) {
        setIsLoading(false)
        // 메시지와 이미지 전송 후 초기화
        setMessage('')
        setSelectedImage(null)
        setImagePreview(null)
      }
    }
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
          <div className={styles.headerContent}>
            <h3 className={styles.chatbotTitle}>AI 상담사</h3>
            {isServerHealthy === false && (
              <div className={styles.serverStatus}>
                <span className={styles.statusIndicator} style={{ backgroundColor: '#ff4444' }}></span>
                <span className={styles.statusText}>서버 연결 불가</span>
              </div>
            )}
            {isServerHealthy === true && (
              <div className={styles.serverStatus}>
                <span className={styles.statusIndicator} style={{ backgroundColor: '#44ff44' }}></span>
                <span className={styles.statusText}>서버 연결됨</span>
              </div>
            )}
          </div>
          <button className={styles.closeButton} onClick={handleToggle}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className={styles.chatbotContent}>
          <div className={styles.messagesContainer}>
                         {messages.map((msg) => (
               <div key={msg.id} className={`${styles.messageItem} ${msg.type === 'user' ? styles.userMessage : styles.botMessage}`}>
                 <div className={styles.messageBubble}>
                   {msg.image && (
                     <div className={styles.messageImage}>
                       <img src={msg.image} alt="업로드된 이미지" />
                     </div>
                   )}
                   <div className={styles.messageText}>{msg.text}</div>
                   
                                       {/* 유사한 이미지들 표시 */}
                    {msg.similarImages && msg.similarImages.length > 0 && (
                      <div className={styles.similarImagesContainer}>
                        <div className={styles.similarImagesTitle}>원하는 강아지와 비슷한 유기견들을 만나보세요</div>
                        <div className={styles.similarImagesScroll}>
                         {msg.similarImages.map((similar, index) => (
                           <div key={index} className={styles.similarImageItem}>
                             <img 
                               src={`/api/proxy-image?url=${encodeURIComponent(similar.url)}`}
                               alt={`유사한 강아지 ${index + 1}`}
                               className={styles.similarImage}
                               onError={(e) => {
                                 const target = e.target as HTMLImageElement
                                 target.style.display = 'none'
                               }}
                             />
                             <div className={styles.similarityScore}>
                               {(similar.sim * 100).toFixed(1)}%
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   )}
                   
                   <div className={styles.messageTime}>
                     {msg.timestamp.toLocaleTimeString('ko-KR', { 
                       hour: '2-digit', 
                       minute: '2-digit' 
                     })}
                   </div>
                 </div>
               </div>
             ))}
            {isLoading && (
              <div className={`${styles.messageItem} ${styles.botMessage}`}>
            <div className={styles.messageBubble}>
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
            </div>
          </div>
            )}
            <div ref={messagesEndRef} />
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
                disabled={isLoading}
              />
              
              {/* 이미지 업로드 버튼 */}
              <label className={styles.imageUploadButton}>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  disabled={isLoading}
                />
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" fill="currentColor"/>
                </svg>
              </label>
              
                             <button 
                 className={styles.sendButton} 
                 onClick={handleSendMessage}
                 disabled={isLoading || !message.trim() || !selectedImage || isServerHealthy === false}
               >
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