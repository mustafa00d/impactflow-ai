import { demoData } from '../data/demo'
import type { AppData } from '../types'

const DATA_KEY = 'impactflow:data:v1'

export function loadData(): AppData {
  try {
    const stored = localStorage.getItem(DATA_KEY)
    return stored ? JSON.parse(stored) as AppData : structuredClone(demoData)
  } catch {
    return structuredClone(demoData)
  }
}

export function saveData(data: AppData) {
  localStorage.setItem(DATA_KEY, JSON.stringify(data))
}

export function clearData() {
  localStorage.removeItem(DATA_KEY)
}
