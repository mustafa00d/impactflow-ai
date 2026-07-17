/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { demoData } from '../data/demo'
import { translate, type TranslationKey } from '../i18n'
import { clearData, loadData, saveData } from '../lib/storage'
import { createId } from '../lib/utils'
import type { AppData, DocumentItem, Language, Project, Report, Transaction } from '../types'

interface AppContextValue {
  data: AppData
  language: Language
  darkMode: boolean
  authenticated: boolean
  t: (key: TranslationKey) => string
  setLanguage: (value: Language) => void
  setDarkMode: (value: boolean) => void
  login: () => void
  logout: () => void
  addProject: (value: Omit<Project, 'id'>) => void
  addReport: (value: Omit<Report, 'id'>) => void
  addTransaction: (value: Omit<Transaction, 'id'>) => void
  addDocument: (value: Omit<DocumentItem, 'id'>) => void
  markNotificationsRead: () => void
  resetDemo: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(loadData)
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('impactflow:language') as Language) || 'ar')
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('impactflow:theme') === 'dark')
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem('impactflow:auth') === 'true')

  useEffect(() => saveData(data), [data])
  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    localStorage.setItem('impactflow:language', language)
  }, [language])
  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light'
    localStorage.setItem('impactflow:theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const value = useMemo<AppContextValue>(() => ({
    data, language, darkMode, authenticated,
    t: (key) => translate(language, key),
    setLanguage,
    setDarkMode,
    login: () => { sessionStorage.setItem('impactflow:auth', 'true'); setAuthenticated(true) },
    logout: () => { sessionStorage.removeItem('impactflow:auth'); setAuthenticated(false) },
    addProject: (project) => setData((current) => ({ ...current, projects: [{ ...project, id: createId('p') }, ...current.projects] })),
    addReport: (report) => setData((current) => ({ ...current, reports: [{ ...report, id: createId('r') }, ...current.reports] })),
    addTransaction: (transaction) => setData((current) => ({ ...current, transactions: [{ ...transaction, id: createId('t') }, ...current.transactions] })),
    addDocument: (document) => setData((current) => ({ ...current, documents: [{ ...document, id: createId('d') }, ...current.documents] })),
    markNotificationsRead: () => setData((current) => ({ ...current, notifications: current.notifications.map((item) => ({ ...item, read: true })) })),
    resetDemo: () => { clearData(); setData(structuredClone(demoData)) },
  }), [data, language, darkMode, authenticated])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
