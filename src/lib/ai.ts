import type { AppData, Language } from '../types'
import { formatCurrency, percentage } from './utils'
import { supabase } from './supabase'

export interface AiInsight {
  id: string
  severity: 'critical' | 'warning' | 'positive' | 'info'
  title: string
  description: string
  action: string
}

export function analyseData(data: AppData, language: Language = 'ar'): AiInsight[] {
  const flagged = data.transactions.filter((item) => item.status === 'flagged')
  const incomplete = data.reports.filter((item) => item.completeness < 85)
  const atRisk = data.projects.filter((item) => item.status === 'at-risk')
  const verified = data.transactions.filter((item) => item.status === 'verified')
  const totalTransactions = data.transactions.reduce((sum, item) => sum + item.amount, 0)
  const verifiedAmount = verified.reduce((sum, item) => sum + item.amount, 0)

  if (language === 'en') {
    return [
      ...(flagged.length ? [{ id: 'flagged', severity: 'critical' as const, title: `${flagged.length} financial item requires review`, description: 'Evidence is missing or inconsistent with the recorded transaction.', action: 'Review finance' }] : []),
      ...(incomplete.length ? [{ id: 'reports', severity: 'warning' as const, title: `${incomplete.length} reports are below 85%`, description: 'Missing fields may delay donor approval.', action: 'Complete reports' }] : []),
      ...(atRisk.length ? [{ id: 'risk', severity: 'warning' as const, title: `${atRisk.length} project needs attention`, description: 'Spending or timing is outside the expected range.', action: 'View project' }] : []),
      { id: 'verified', severity: 'positive', title: `${percentage(verifiedAmount, totalTransactions)}% of transaction value verified`, description: `${formatCurrency(verifiedAmount, 'en')} is supported by reviewed evidence.`, action: 'View audit trail' },
    ]
  }

  return [
    ...(flagged.length ? [{ id: 'flagged', severity: 'critical' as const, title: `${flagged.length} معاملة مالية تحتاج المراجعة`, description: 'يوجد نقص أو تعارض بين المستندات والمعاملة المسجلة.', action: 'مراجعة المالية' }] : []),
    ...(incomplete.length ? [{ id: 'reports', severity: 'warning' as const, title: `${incomplete.length} تقرير دون نسبة اكتمال 85٪`, description: 'الحقول الناقصة قد تؤخر اعتماد التقارير من المانح.', action: 'إكمال التقارير' }] : []),
    ...(atRisk.length ? [{ id: 'risk', severity: 'warning' as const, title: `${atRisk.length} مشروع يحتاج إلى متابعة`, description: 'معدل الصرف أو الجدول الزمني خارج النطاق المتوقع.', action: 'عرض المشروع' }] : []),
    { id: 'verified', severity: 'positive', title: `تم التحقق من ${percentage(verifiedAmount, totalTransactions)}٪ من قيمة المعاملات`, description: `${formatCurrency(verifiedAmount)} مدعومة بأدلة تمت مراجعتها.`, action: 'عرض سجل التدقيق' },
  ]
}

function localAnswer(prompt: string, data: AppData, language: Language) {
  const totalBudget = data.projects.reduce((sum, item) => sum + item.budget, 0)
  const totalSpent = data.projects.reduce((sum, item) => sum + item.spent, 0)
  const totalBeneficiaries = data.projects.reduce((sum, item) => sum + item.beneficiaries, 0)
  const flagged = data.transactions.filter((item) => item.status === 'flagged')
  const normalized = prompt.toLowerCase()

  if (normalized.includes('مال') || normalized.includes('صرف') || normalized.includes('budget') || normalized.includes('finance')) {
    return language === 'ar'
      ? `بلغ إجمالي الميزانية ${formatCurrency(totalBudget)}، والمصروف ${formatCurrency(totalSpent)} بنسبة ${percentage(totalSpent, totalBudget)}٪. توجد ${flagged.length} معاملة معلّمة للمراجعة، وأوصي باستكمال أدلتها قبل اعتماد التقرير المالي.`
      : `The total budget is ${formatCurrency(totalBudget, 'en')}, with ${formatCurrency(totalSpent, 'en')} spent (${percentage(totalSpent, totalBudget)}%). ${flagged.length} transaction is flagged and should be supported before approval.`
  }

  if (normalized.includes('مستفيد') || normalized.includes('beneficiar')) {
    return language === 'ar'
      ? `تغطي المشروعات الحالية ${totalBeneficiaries.toLocaleString('ar-SD')} مستفيدًا. أعلى مشروع من حيث التغطية هو «${[...data.projects].sort((a, b) => b.beneficiaries - a.beneficiaries)[0]?.name}».`
      : `Current projects cover ${totalBeneficiaries.toLocaleString('en-US')} beneficiaries. The largest reach is “${[...data.projects].sort((a, b) => b.beneficiaries - a.beneficiaries)[0]?.name}”.`
  }

  if (normalized.includes('تقرير') || normalized.includes('report')) {
    const low = data.reports.filter((item) => item.completeness < 85)
    return language === 'ar'
      ? `يوجد ${data.reports.length} تقارير في النظام، منها ${low.length} تحتاج استكمالًا عاجلًا. ابدأ بتقرير «${[...low].sort((a, b) => a.completeness - b.completeness)[0]?.title ?? 'لا يوجد'}».`
      : `There are ${data.reports.length} reports, and ${low.length} require urgent completion. Start with “${[...low].sort((a, b) => a.completeness - b.completeness)[0]?.title ?? 'none'}”.`
  }

  return language === 'ar'
    ? `حللت ${data.projects.length} مشروعات و${data.reports.length} تقارير و${data.transactions.length} معاملات. أبرز أولوية الآن هي مراجعة المعاملات المعلّمة واستكمال التقارير التي تقل عن 85٪، ثم متابعة المشروعات القريبة من نهاية التنفيذ.`
    : `I analysed ${data.projects.length} projects, ${data.reports.length} reports and ${data.transactions.length} transactions. The main priorities are flagged transactions, reports below 85%, and projects approaching completion.`
}

export async function askAssistant(prompt: string, data: AppData, language: Language) {
  if (supabase) {
    try {
      const { data: response, error } = await supabase.functions.invoke('ai-assistant', { body: { prompt, language } })
      if (!error && response?.answer) return response.answer as string
    } catch {
      // The deterministic analyst below keeps the platform useful if AI is unavailable.
    }
  }
  await new Promise((resolve) => setTimeout(resolve, 500))
  return localAnswer(prompt, data, language)
}
