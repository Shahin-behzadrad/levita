'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { ValidLocale, defaultLocale, getMessages } from './settings'

type LanguageContextType = {
  locale: ValidLocale
  setLocale: (locale: ValidLocale) => void
  messages: Record<string, any>
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<ValidLocale>(defaultLocale)
  const [messages, setMessages] = useState(getMessages(defaultLocale))

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as ValidLocale
    if (savedLocale) {
      setLocale(savedLocale)
      setMessages(getMessages(savedLocale))
    }
  }, [])

  const handleSetLocale = (newLocale: ValidLocale) => {
    setLocale(newLocale)
    setMessages(getMessages(newLocale))
    localStorage.setItem('locale', newLocale)
  }

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale: handleSetLocale,
        messages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 