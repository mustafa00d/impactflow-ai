import type { Language } from './types'

const dictionary = {
  ar: {
    dashboard: 'نظرة عامة', projects: 'المشروعات', reports: 'التقارير', finance: 'المالية',
    beneficiaries: 'المستفيدون', documents: 'المستندات', ai: 'مركز الذكاء', admin: 'إدارة النظام',
    welcome: 'مرحبًا بك', overview: 'هذه أهم مؤشرات العمل اليوم', search: 'ابحث في النظام…',
    newProject: 'مشروع جديد', newReport: 'تقرير جديد', newTransaction: 'معاملة جديدة', upload: 'رفع مستند',
    activeProjects: 'المشروعات النشطة', totalBeneficiaries: 'إجمالي المستفيدين', totalBudget: 'إجمالي الميزانية', completion: 'اكتمال التقارير',
    recentReports: 'أحدث التقارير', projectPerformance: 'أداء المشروعات', spending: 'الإنفاق حسب القطاع',
    viewAll: 'عرض الكل', status: 'الحالة', progress: 'التقدم', budget: 'الميزانية', spent: 'المصروف',
    donor: 'المانح', location: 'الموقع', owner: 'المسؤول', completeness: 'الاكتمال', actions: 'الإجراءات',
    approved: 'معتمد', review: 'قيد المراجعة', draft: 'مسودة', returned: 'مُعاد للتعديل',
    active: 'نشط', completed: 'مكتمل', atRisk: 'يحتاج متابعة',
    verified: 'متحقق', pending: 'معلق', flagged: 'ملاحظة',
    logout: 'تسجيل الخروج', notifications: 'الإشعارات', language: 'English', darkMode: 'الوضع الداكن',
    save: 'حفظ', cancel: 'إلغاء', close: 'إغلاق', add: 'إضافة', export: 'تصدير', share: 'مشاركة',
    demoMode: 'وضع تجريبي', roleAdmin: 'مدير النظام', noResults: 'لا توجد نتائج مطابقة',
  },
  en: {
    dashboard: 'Overview', projects: 'Projects', reports: 'Reports', finance: 'Finance',
    beneficiaries: 'Beneficiaries', documents: 'Documents', ai: 'AI Center', admin: 'System Admin',
    welcome: 'Welcome back', overview: 'Here are today’s key operational indicators', search: 'Search the platform…',
    newProject: 'New project', newReport: 'New report', newTransaction: 'New transaction', upload: 'Upload document',
    activeProjects: 'Active projects', totalBeneficiaries: 'Total beneficiaries', totalBudget: 'Total budget', completion: 'Report completion',
    recentReports: 'Recent reports', projectPerformance: 'Project performance', spending: 'Spending by sector',
    viewAll: 'View all', status: 'Status', progress: 'Progress', budget: 'Budget', spent: 'Spent',
    donor: 'Donor', location: 'Location', owner: 'Owner', completeness: 'Completeness', actions: 'Actions',
    approved: 'Approved', review: 'In review', draft: 'Draft', returned: 'Returned',
    active: 'Active', completed: 'Completed', atRisk: 'Needs attention',
    verified: 'Verified', pending: 'Pending', flagged: 'Flagged',
    logout: 'Sign out', notifications: 'Notifications', language: 'العربية', darkMode: 'Dark mode',
    save: 'Save', cancel: 'Cancel', close: 'Close', add: 'Add', export: 'Export', share: 'Share',
    demoMode: 'Demo mode', roleAdmin: 'System administrator', noResults: 'No matching results',
  },
} as const

export type TranslationKey = keyof typeof dictionary.ar
export const translate = (language: Language, key: TranslationKey) => dictionary[language][key]
