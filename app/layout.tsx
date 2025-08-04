import type { Metadata } from 'next'
import { ABeeZee } from 'next/font/google'
import './globals.css'
import Header from './components/Header'
import Chatbot from './components/Chatbot'

const abeeZee = ABeeZee({ 
  weight: '400',
  subsets: ['latin'] 
})

export const metadata: Metadata = {
  title: 'Webpage Title Here',
  description: '가족을 찾고 있어요',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={abeeZee.className}>
        <Header />
        <main style={{ marginTop: '140px' }}>
          {children}
        </main>
        <Chatbot />
      </body>
    </html>
  )
}
