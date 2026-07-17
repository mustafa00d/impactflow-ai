import { CalendarDays, CheckCircle2, Download, MapPin, ShieldCheck, UsersRound } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { Badge, Button, Progress } from '../components/UI'
import { demoData } from '../data/demo'
import { formatCurrency } from '../lib/utils'

export default function PublicShare() {
  const { token } = useParams()
  const project = demoData.projects[0]
  return <main className="share-page"><header><div className="login-brand"><img src="/logo.svg" alt=""/><strong>ImpactFlow AI</strong></div><Badge tone="verified"><ShieldCheck size={14}/>رابط مشاركة موثوق</Badge></header><section className="share-hero"><span>PROJECT IMPACT BRIEF</span><h1>{project.name}</h1><p>ملخص عام آمن يوضح تقدم المشروع وأثره دون عرض بيانات شخصية أو مالية حساسة.</p><div><Badge tone="active">نشط</Badge><small>مرجع المشاركة: {token?.slice(0, 8) || 'demo'}</small></div></section><section className="share-stats"><article><UsersRound/><div><strong>{project.beneficiaries.toLocaleString('ar-SD')}</strong><span>مستفيدًا</span></div></article><article><MapPin/><div><strong>{project.location}</strong><span>منطقة التنفيذ</span></div></article><article><CalendarDays/><div><strong>{project.endDate}</strong><span>تاريخ الانتهاء</span></div></article></section><section className="card share-progress"><header><div><h2>تقدم التنفيذ</h2><p>آخر تحديث: 17 يوليو 2026</p></div><strong>{project.progress}%</strong></header><Progress value={project.progress}/><div><span>الميزانية المعتمدة: {formatCurrency(project.budget)}</span><span>عدد الأنشطة المكتملة: 7 من 9</span></div></section><section className="card share-results"><h2>أبرز النتائج</h2><div><p><CheckCircle2/>إكمال حصر الأسر والتحقق من قوائم المستفيدين.</p><p><CheckCircle2/>تأمين وشراء مواد السلة الغذائية وفق خطة المشروع.</p><p><CheckCircle2/>بدء التوزيع بالتنسيق مع اللجان المجتمعية.</p></div><Button variant="secondary" icon={<Download size={17}/>}>تنزيل الملخص PDF</Button></section><footer>تم إنشاء هذا الملخص عبر ImpactFlow AI · لا يحتوي الرابط على بيانات شخصية للمستفيدين.</footer></main>
}
