'use client'

import React, { useState, useRef, useEffect } from 'react'
import styles from './Chatbot.module.css'



interface ChatApiResponse {
  reply?: string
  message?: string
  answer?: string
  content?: string
  text?: string
  [key: string]: unknown
}

interface Message {
  id: string
  type: 'user' | 'bot'
  text: string
  timestamp: Date
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      text: '안녕하세요! 반려동물 입양에 대해 궁금한 점을 텍스트로 입력해 주세요.\n\n💬 질문을 보내면 AI가 답변해드려요.',
      timestamp: new Date()
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null)
  const CHAT_API_BASE = 'https://5650e60a6a7b.ngrok-free.app'

  const scrollToBottom = () => {
    try {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    } catch (error) {
      console.error('스크롤 오류:', error)
    }
  }

  useEffect(() => {
    // 메시지가 추가될 때마다 스크롤
    scrollToBottom()
  }, [messages])

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

  const handleSendMessage = async () => {
    if (!message.trim()) {
      alert('메시지를 입력해주세요.')
      return
    }
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: message,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    
    let isMounted = true
    
    try {
      const toReadableError = (err: unknown): string => {
        try {
          if (typeof err === 'string') return err
          if (Array.isArray(err)) {
            const parts = err
              .map((e) => toReadableError(e))
              .filter(Boolean)
            return parts.join(' | ')
          }
          if (err && typeof err === 'object') {
            const anyErr = err as any
            const candidates: Array<unknown> = [
              anyErr.message,
              anyErr.detail,
              anyErr.error,
              anyErr.errors,
              anyErr.reason
            ]
            for (const c of candidates) {
              const str = toReadableError(c)
              if (str) return str
            }
            // fallback pretty json
            return JSON.stringify(err)
          }
          return ''
        } catch {
          return ''
        }
      }
      const formBody = new URLSearchParams()
      formBody.set('message', message.trim())

      const response = await fetch(`${CHAT_API_BASE}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Accept': 'application/json'
        },
        body: formBody.toString()
      })

      if (response.ok) {
        let botText = ''
        const contentType = response.headers.get('content-type') || ''
        if (contentType.includes('application/json')) {
          const data: ChatApiResponse | string = await response.json()
          botText = typeof data === 'string' ? data : ((data.reply || data.message || data.answer || data.content || data.text || '') as string)
        } else {
          // text/plain 등의 경우에도 JSON 문자열일 수 있으니 시도
          const raw = await response.text()
          try {
            const parsed = JSON.parse(raw) as ChatApiResponse | string
            botText = typeof parsed === 'string' ? parsed : ((parsed.reply || parsed.message || parsed.answer || parsed.content || parsed.text || '') as string)
            if (!botText) botText = raw
          } catch {
            botText = raw
          }
        }

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          text: botText || '답변을 가져오지 못했습니다.',
          timestamp: new Date()
        }
        if (isMounted) {
          setMessages(prev => [...prev, botMessage])
        }
      } else {
        let errorText = ''
        let errorObj: any = undefined
        try {
          const ct = response.headers.get('content-type') || ''
          if (ct.includes('application/json')) {
            const err = await response.json()
            errorObj = err
            errorText = toReadableError(err)
          } else {
            const raw = await response.text()
            try {
              const parsed = JSON.parse(raw)
              errorObj = parsed
              errorText = toReadableError(parsed)
            } catch {
              errorText = raw
            }
          }
        } catch {}

        // 422이며 body.message 필수 에러이면 JSON 페이로드로 재시도
        const needsJsonRetry = response.status === 422 && (
          (errorObj && Array.isArray(errorObj) && errorObj.some((e: any) => Array.isArray(e?.loc) && e.loc.join('.') === 'body.message')) ||
          (errorObj && Array.isArray(errorObj?.loc) && errorObj.loc.join('.') === 'body.message') ||
          (typeof errorText === 'string' && /body\.message/i.test(errorText))
        )

        if (needsJsonRetry) {
          const jsonResp = await fetch(`${CHAT_API_BASE}/chat`, {
        method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message.trim() })
          })

          if (jsonResp.ok) {
            const ct2 = jsonResp.headers.get('content-type') || ''
            let botText = ''
            if (ct2.includes('application/json')) {
              const data2: ChatApiResponse | string = await jsonResp.json()
              botText = typeof data2 === 'string' ? data2 : ((data2.reply || data2.message || data2.answer || data2.content || data2.text || '') as string)
            } else {
              const raw2 = await jsonResp.text()
              try {
                const parsed2 = JSON.parse(raw2) as ChatApiResponse | string
                botText = typeof parsed2 === 'string' ? parsed2 : ((parsed2.reply || parsed2.message || parsed2.answer || parsed2.content || parsed2.text || '') as string)
                if (!botText) botText = raw2
              } catch {
                botText = raw2
              }
            }
         const botMessage: Message = {
           id: (Date.now() + 1).toString(),
           type: 'bot',
              text: botText || '답변을 가져오지 못했습니다.',
           timestamp: new Date()
         }
         if (isMounted) {
           setMessages(prev => [...prev, botMessage])
         }
      } else {
            // 재시도도 실패
            let errText2 = ''
            try {
              const ct2 = jsonResp.headers.get('content-type') || ''
              if (ct2.includes('application/json')) {
                const err2 = await jsonResp.json()
                errText2 = toReadableError(err2)
              } else {
                const raw2 = await jsonResp.text()
                try {
                  const parsed2 = JSON.parse(raw2)
                  errText2 = toReadableError(parsed2)
                } catch {
                  errText2 = raw2
                }
              }
            } catch {}
            const errorMessage: Message = {
              id: (Date.now() + 1).toString(),
              type: 'bot',
              text: errText2 ? `오류(${jsonResp.status}): ${errText2}` : `오류(${jsonResp.status})가 발생했습니다.`,
              timestamp: new Date()
            }
            if (isMounted) {
              setMessages(prev => [...prev, errorMessage])
            }
          }
        } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
            text: errorText ? `오류(${response.status}): ${errorText}` : `오류(${response.status})가 발생했습니다.`,
          timestamp: new Date()
        }
        if (isMounted) {
          setMessages(prev => [...prev, errorMessage])
          }
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
        setMessage('')
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
                   <div className={styles.messageText}>{msg.text}</div>
                   
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
              
                             <button 
                 className={styles.sendButton} 
                 onClick={handleSendMessage}
                disabled={isLoading || !message.trim()}
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

