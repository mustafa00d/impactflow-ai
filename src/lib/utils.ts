import type { Language } from '../types'

export const formatCurrency = (amount: number, language: Language = 'ar') =>
  new Intl.NumberFormat(language === 'ar' ? 'ar-SD' : 'en-US', {
    maximumFractionDigits: 0,
  }).format(amount) + (language === 'ar' ? ' ج.س' : ' SDG')

export const formatNumber = (value: number, language: Language = 'ar') =>
  new Intl.NumberFormat(language === 'ar' ? 'ar-SD' : 'en-US', { maximumFractionDigits: 0 }).format(value)

export const percentage = (part: number, total: number) => total === 0 ? 0 : Math.round((part / total) * 100)

export const createId = (prefix: string) => `${prefix}-${crypto.randomUUID()}`

export const projectStatusLabel = (status: string, language: Language) => {
  const labels: Record<string, [string, string]> = {
    active: ['نشط', 'Active'], completed: ['مكتمل', 'Completed'], draft: ['مسودة', 'Draft'],
    'at-risk': ['يحتاج متابعة', 'Needs attention'],
  }
  return labels[status]?.[language === 'ar' ? 0 : 1] ?? status
}

export const reportStatusLabel = (status: string, language: Language) => {
  const labels: Record<string, [string, string]> = {
    approved: ['معتمد', 'Approved'], review: ['قيد المراجعة', 'In review'], draft: ['مسودة', 'Draft'], returned: ['مُعاد للتعديل', 'Returned'],
    verified: ['متحقق', 'Verified'], pending: ['معلق', 'Pending'], flagged: ['ملاحظة', 'Flagged'],
  }
  return labels[status]?.[language === 'ar' ? 0 : 1] ?? status
}
