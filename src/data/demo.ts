import type { AppData } from '../types'

export const demoData: AppData = {
  organization: {
    id: 'org-1',
    name: 'غرفة طوارئ شمال دارفور',
    country: 'السودان',
    sector: 'الاستجابة الإنسانية',
    plan: 'professional',
  },
  currentUser: {
    id: 'user-1',
    name: 'مصطفى عوض داود',
    email: 'mustafa@impactflow.app',
    role: 'admin',
    organizationId: 'org-1',
  },
  projects: [
    {
      id: 'p-1', name: 'الاستجابة الغذائية للأسر المتأثرة', code: 'NDF-FS-026', sector: 'الأمن الغذائي',
      location: 'محلية الواحة', donor: 'LCCND', partner: 'غرف الطوارئ', budget: 23437500, spent: 18750000,
      beneficiaries: 1240, startDate: '2026-06-01', endDate: '2026-08-30', status: 'active', progress: 78,
    },
    {
      id: 'p-2', name: 'دعم التعليم في حالات الطوارئ', code: 'NDF-EDU-014', sector: 'التعليم',
      location: 'دامرة الشيخ', donor: 'Education Fund', partner: 'لجنة المدرسة', budget: 22500000, spent: 20735230,
      beneficiaries: 988, startDate: '2026-05-15', endDate: '2026-07-31', status: 'at-risk', progress: 92,
    },
    {
      id: 'p-3', name: 'توفير مواد الإيواء الأساسية', code: 'NDF-SHL-009', sector: 'الإيواء',
      location: 'بورسعيد', donor: 'Rapid Response', partner: 'غرفة طوارئ بورسعيد', budget: 18500000, spent: 13200000,
      beneficiaries: 850, startDate: '2026-06-20', endDate: '2026-09-15', status: 'active', progress: 61,
    },
    {
      id: 'p-4', name: 'تعزيز خدمات الرعاية الأولية', code: 'NDF-HLT-004', sector: 'الصحة',
      location: 'القبة الرباط', donor: 'Health Alliance', partner: 'المركز الصحي', budget: 14750000, spent: 14750000,
      beneficiaries: 620, startDate: '2026-03-01', endDate: '2026-06-30', status: 'completed', progress: 100,
    },
  ],
  reports: [
    { id: 'r-1', projectId: 'p-1', title: 'التقرير البرامجي النهائي', type: 'F5', period: 'يوليو 2026', owner: 'مصطفى عوض داود', status: 'review', completeness: 94 },
    { id: 'r-2', projectId: 'p-1', title: 'التقرير المالي', type: 'F4', period: 'يوليو 2026', owner: 'عوض داود محمد', status: 'approved', completeness: 100, submittedAt: '2026-07-14' },
    { id: 'r-3', projectId: 'p-2', title: 'متابعة مشروع التعليم', type: 'F5', period: 'يونيو 2026', owner: 'هاشم أحمد أبو بكر', status: 'returned', completeness: 82 },
    { id: 'r-4', projectId: 'p-3', title: 'مقترح مواد الإيواء', type: 'F1', period: 'يونيو 2026', owner: 'يوسف صالح علي', status: 'approved', completeness: 100, submittedAt: '2026-06-18' },
    { id: 'r-5', projectId: 'p-4', title: 'السرد الختامي للمشروع', type: 'Narrative', period: 'الربع الثاني', owner: 'الحبوة حمدان', status: 'draft', completeness: 64 },
  ],
  transactions: [
    { id: 't-1', projectId: 'p-1', description: 'شراء مواد السلة الغذائية', vendor: 'متجر البركة', category: 'مشتريات', amount: 12850000, date: '2026-07-08', status: 'verified', evidenceCount: 3 },
    { id: 't-2', projectId: 'p-1', description: 'تكلفة الترحيل والتوزيع', vendor: 'النور للترحيل', category: 'لوجستيات', amount: 3100000, date: '2026-07-10', status: 'pending', evidenceCount: 1 },
    { id: 't-3', projectId: 'p-2', description: 'حوافز المعلمين', vendor: 'لجنة مدرسة دامرة الشيخ', category: 'حوافز', amount: 5600000, date: '2026-06-29', status: 'verified', evidenceCount: 4 },
    { id: 't-4', projectId: 'p-2', description: 'شراء مستلزمات دراسية', vendor: 'أحمد محمد حسين', category: 'مشتريات', amount: 4235230, date: '2026-06-28', status: 'flagged', evidenceCount: 1 },
    { id: 't-5', projectId: 'p-3', description: 'مشمعات وجركانات وفرشات', vendor: 'سوق كتم الكبير', category: 'مشتريات', amount: 10500000, date: '2026-07-02', status: 'verified', evidenceCount: 5 },
  ],
  beneficiaries: [
    { id: 'b-1', projectId: 'p-1', location: 'دامرة الشيخ', households: 124, men: 231, women: 284, boys: 142, girls: 163, peopleWithDisabilities: 28 },
    { id: 'b-2', projectId: 'p-1', location: 'بورسعيد', households: 96, men: 184, women: 216, boys: 104, girls: 116, peopleWithDisabilities: 19 },
    { id: 'b-3', projectId: 'p-2', location: 'دامرة الشيخ', households: 247, men: 214, women: 250, boys: 258, girls: 266, peopleWithDisabilities: 31 },
  ],
  documents: [
    { id: 'd-1', projectId: 'p-1', name: 'إشعار التحويل البنكي.pdf', type: 'receipt', size: '1.2 MB', uploadedBy: 'عوض داود', uploadedAt: '2026-07-10', verified: true },
    { id: 'd-2', projectId: 'p-1', name: 'كشف المستفيدين.xlsx', type: 'report', size: '864 KB', uploadedBy: 'مصطفى عوض', uploadedAt: '2026-07-11', verified: true },
    { id: 'd-3', projectId: 'p-2', name: 'فاتورة أحمد محمد حسين.jpg', type: 'invoice', size: '2.4 MB', uploadedBy: 'هاشم أحمد', uploadedAt: '2026-06-29', verified: false },
    { id: 'd-4', projectId: 'p-3', name: 'اتفاقية المورد.pdf', type: 'agreement', size: '980 KB', uploadedBy: 'يوسف صالح', uploadedAt: '2026-07-01', verified: true },
  ],
  notifications: [
    { id: 'n-1', title: 'تقرير يحتاج مراجعتك', body: 'التقرير البرامجي لمشروع الاستجابة الغذائية مكتمل بنسبة 94٪.', time: 'منذ 12 دقيقة', read: false, tone: 'warning' },
    { id: 'n-2', title: 'تمت مطابقة معاملة', body: 'تم التحقق من شراء مواد السلة الغذائية مع ثلاثة مستندات.', time: 'منذ ساعة', read: false, tone: 'success' },
    { id: 'n-3', title: 'موعد تسليم قريب', body: 'يتبقى 3 أيام على تسليم تقرير مشروع التعليم.', time: 'أمس', read: true, tone: 'info' },
  ],
}
