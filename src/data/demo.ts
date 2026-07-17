import type { AppData } from '../types'

export const demoData: AppData = {
  organization: {
    id: 'org-1',
    name: 'مؤسسة جسور التجريبية',
    country: 'بيئة تجريبية',
    sector: 'إدارة الأثر التجريبية',
    plan: 'professional',
  },
  currentUser: {
    id: 'user-1',
    name: 'مدير العرض التجريبي',
    email: 'demo@impactflow.example',
    role: 'admin',
    organizationId: 'org-1',
  },
  projects: [
    {
      id: 'p-1', name: 'مشروع تجريبي للأمن الغذائي', code: 'DEMO-FS-001', sector: 'الأمن الغذائي',
      location: 'المنطقة ألف', donor: 'المانح التجريبي أ', partner: 'الشريك التجريبي أ', budget: 240000, spent: 186000,
      beneficiaries: 1200, startDate: '2026-06-01', endDate: '2026-08-30', status: 'active', progress: 78,
    },
    {
      id: 'p-2', name: 'مشروع تجريبي لدعم التعليم', code: 'DEMO-EDU-002', sector: 'التعليم',
      location: 'المنطقة باء', donor: 'المانح التجريبي ب', partner: 'الشريك التجريبي ب', budget: 225000, spent: 207000,
      beneficiaries: 980, startDate: '2026-05-15', endDate: '2026-07-31', status: 'at-risk', progress: 92,
    },
    {
      id: 'p-3', name: 'مشروع تجريبي لمواد الإيواء', code: 'DEMO-SHL-003', sector: 'الإيواء',
      location: 'المنطقة جيم', donor: 'المانح التجريبي ج', partner: 'الشريك التجريبي ج', budget: 185000, spent: 132000,
      beneficiaries: 850, startDate: '2026-06-20', endDate: '2026-09-15', status: 'active', progress: 61,
    },
    {
      id: 'p-4', name: 'مشروع تجريبي للرعاية الأولية', code: 'DEMO-HLT-004', sector: 'الصحة',
      location: 'المنطقة دال', donor: 'المانح التجريبي د', partner: 'الشريك التجريبي د', budget: 148000, spent: 148000,
      beneficiaries: 620, startDate: '2026-03-01', endDate: '2026-06-30', status: 'completed', progress: 100,
    },
  ],
  reports: [
    { id: 'r-1', projectId: 'p-1', title: 'التقرير البرامجي النهائي', type: 'F5', period: 'يوليو 2026', owner: 'مستخدم تجريبي 1', status: 'review', completeness: 94 },
    { id: 'r-2', projectId: 'p-1', title: 'التقرير المالي', type: 'F4', period: 'يوليو 2026', owner: 'مستخدم تجريبي 2', status: 'approved', completeness: 100, submittedAt: '2026-07-14' },
    { id: 'r-3', projectId: 'p-2', title: 'متابعة مشروع التعليم', type: 'F5', period: 'يونيو 2026', owner: 'مستخدم تجريبي 3', status: 'returned', completeness: 82 },
    { id: 'r-4', projectId: 'p-3', title: 'مقترح مواد الإيواء', type: 'F1', period: 'يونيو 2026', owner: 'مستخدم تجريبي 4', status: 'approved', completeness: 100, submittedAt: '2026-06-18' },
    { id: 'r-5', projectId: 'p-4', title: 'السرد الختامي للمشروع', type: 'Narrative', period: 'الربع الثاني', owner: 'مستخدم تجريبي 5', status: 'draft', completeness: 64 },
  ],
  transactions: [
    { id: 't-1', projectId: 'p-1', description: 'شراء مواد السلة الغذائية', vendor: 'المورد التجريبي أ', category: 'مشتريات', amount: 128500, date: '2026-07-08', status: 'verified', evidenceCount: 3 },
    { id: 't-2', projectId: 'p-1', description: 'تكلفة الترحيل والتوزيع', vendor: 'المورد التجريبي ب', category: 'لوجستيات', amount: 31000, date: '2026-07-10', status: 'pending', evidenceCount: 1 },
    { id: 't-3', projectId: 'p-2', description: 'حوافز المعلمين', vendor: 'المورد التجريبي ج', category: 'حوافز', amount: 56000, date: '2026-06-29', status: 'verified', evidenceCount: 4 },
    { id: 't-4', projectId: 'p-2', description: 'شراء مستلزمات دراسية', vendor: 'المورد التجريبي د', category: 'مشتريات', amount: 42000, date: '2026-06-28', status: 'flagged', evidenceCount: 1 },
    { id: 't-5', projectId: 'p-3', description: 'مواد إيواء أساسية', vendor: 'المورد التجريبي هـ', category: 'مشتريات', amount: 105000, date: '2026-07-02', status: 'verified', evidenceCount: 5 },
  ],
  beneficiaries: [
    { id: 'b-1', projectId: 'p-1', location: 'المنطقة ألف', households: 120, men: 225, women: 280, boys: 140, girls: 160, peopleWithDisabilities: 25 },
    { id: 'b-2', projectId: 'p-1', location: 'المنطقة باء', households: 95, men: 180, women: 210, boys: 100, girls: 115, peopleWithDisabilities: 18 },
    { id: 'b-3', projectId: 'p-2', location: 'المنطقة جيم', households: 245, men: 210, women: 245, boys: 255, girls: 260, peopleWithDisabilities: 30 },
  ],
  documents: [
    { id: 'd-1', projectId: 'p-1', name: 'إشعار_تحويل_تجريبي.pdf', type: 'receipt', size: '1.2 MB', uploadedBy: 'مستخدم تجريبي 2', uploadedAt: '2026-07-10', verified: true },
    { id: 'd-2', projectId: 'p-1', name: 'كشف_مستفيدين_تجريبي.xlsx', type: 'report', size: '864 KB', uploadedBy: 'مستخدم تجريبي 1', uploadedAt: '2026-07-11', verified: true },
    { id: 'd-3', projectId: 'p-2', name: 'فاتورة_تجريبية.jpg', type: 'invoice', size: '2.4 MB', uploadedBy: 'مستخدم تجريبي 3', uploadedAt: '2026-06-29', verified: false },
    { id: 'd-4', projectId: 'p-3', name: 'اتفاقية_مورد_تجريبية.pdf', type: 'agreement', size: '980 KB', uploadedBy: 'مستخدم تجريبي 4', uploadedAt: '2026-07-01', verified: true },
  ],
  notifications: [
    { id: 'n-1', title: 'تقرير يحتاج مراجعتك', body: 'التقرير البرامجي لمشروع الاستجابة الغذائية مكتمل بنسبة 94٪.', time: 'منذ 12 دقيقة', read: false, tone: 'warning' },
    { id: 'n-2', title: 'تمت مطابقة معاملة', body: 'تم التحقق من شراء مواد السلة الغذائية مع ثلاثة مستندات.', time: 'منذ ساعة', read: false, tone: 'success' },
    { id: 'n-3', title: 'موعد تسليم قريب', body: 'يتبقى 3 أيام على تسليم تقرير مشروع التعليم.', time: 'أمس', read: true, tone: 'info' },
  ],
}
