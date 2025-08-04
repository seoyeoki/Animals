'use client'

import React, { useState } from 'react'
import styles from './Chatbot.module.css'

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={styles.chatbot}>
      {isOpen && (
        <div className={styles.chatbotBubble}>
          <span className={styles.chatbotText}>챗봇 이름또는로고</span>
          <div className={styles.chatbotTail}></div>
        </div>
      )}
      <button className={styles.chatbotButton} onClick={handleToggle}>
        <img 
          src="https://api.builder.io/api/v1/image/assets/TEMP/c829a260964bfc445a8395b93b2849770b8c9ec9?width=158" 
          alt="ChatBot" 
          className={styles.chatbotIcon}
        />
      </button>
    </div>
  )
} 