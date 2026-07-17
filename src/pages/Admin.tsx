import { BellRing, Building2, Database, Globe2, KeyRound, Palette, RotateCcw, ShieldCheck, UsersRound } from 'lucide-react'
import { useState } from 'react'
import { Badge, Button, PageHeader } from '../components/UI'
import { useApp } from '../context/AppContext'
import { isSupabaseConfigured } from '../lib/supabase'

export default function Admin() {
  const { data, language, resetDemo } = useApp()
  const [confirm, setConfirm] = useState(false)
  const sections = [
    { icon: Building2, title: language === 'ar' ? 'بيانات المؤسسة' : 'Organisation profile', body: data.organization.name, badge: data.organization.plan.toUpperCase() },
    { icon: UsersRound, title: language === 'ar' ? 'المستخدمون والصلاحيات' : 'Users & permissions', body: language === 'ar' ? '5 أدوار جاهزة مع صلاحيات دقيقة' : '5 predefined roles with granular access', badge: 'RBAC' },
    { icon: Database, title: language === 'ar' ? 'قاعدة البيانات' : 'Database', body: isSupabaseConfigured ? (language === 'ar' ? 'متصل بـ Supabase' : 'Connected to Supabase') : (language === 'ar' ? 'وضع محلي تجريبي' : 'Local demo mode'), badge: isSupabaseConfigured ? 'LIVE' : 'DEMO' },
    { icon: KeyRound, title: language === 'ar' ? 'الأمان والمصادقة' : 'Security & authentication', body: language === 'ar' ? 'التحقق المتعدد وسياسات الجلسات' : 'MFA and session policies', badge: 'RLS' },
    { icon: Globe2, title: language === 'ar' ? 'اللغة والمناطق' : 'Language & regions', body: language === 'ar' ? 'العربية والإنجليزية' : 'Arabic and English', badge: '2' },
    { icon: BellRing, title: language === 'ar' ? 'الإشعارات' : 'Notifications', body: language === 'ar' ? 'المواعيد والموافقات والتنبيهات' : 'Deadlines, approvals and alerts', badge: 'ON' },
    { icon: Palette, title: language === 'ar' ? 'الهوية والقوالب' : 'Branding & templates', body: language === 'ar' ? 'الشعار والألوان وقوالب التقارير' : 'Logo, colours and report templates', badge: 'PRO' },
    { icon: ShieldCheck, title: language === 'ar' ? 'سجل التدقيق' : 'Audit log', body: language === 'ar' ? 'توثيق التغييرات الحساسة' : 'Track sensitive changes', badge: 'SAFE' },
  ]
  return <>
    <PageHeader eyebrow={language === 'ar' ? 'الإعدادات والحوكمة' : 'Settings & governance'} title={language === 'ar' ? 'إدارة النظام' : 'System administration'} description={language === 'ar' ? 'اضبط المؤسسة والصلاحيات والأمان والتكاملات.' : 'Configure your organisation, access, security and integrations.'} />
    <section className="settings-grid">{sections.map(({ icon: Icon, title, body, badge }) => <button key={title} className="setting-card"><span><Icon size={21}/></span><div><strong>{title}</strong><p>{body}</p></div><Badge tone={badge === 'DEMO' ? 'warning' : 'neutral'}>{badge}</Badge></button>)}</section>
    <section className="card system-health"><header className="card__header"><div><h2>{language === 'ar' ? 'حالة النظام' : 'System health'}</h2><p>{language === 'ar' ? 'جاهزية الخدمات الأساسية' : 'Core service readiness'}</p></div><Badge tone="verified">{language === 'ar' ? 'يعمل جيدًا' : 'Operational'}</Badge></header><div className="health-list"><div><span/><strong>{language === 'ar' ? 'واجهة التطبيق' : 'Application UI'}</strong><small>100%</small></div><div><span/><strong>{language === 'ar' ? 'التخزين المحلي المشفر بواسطة المتصفح' : 'Browser local persistence'}</strong><small>100%</small></div><div className={!isSupabaseConfigured ? 'health-list--warning' : ''}><span/><strong>Supabase</strong><small>{isSupabaseConfigured ? 'Connected' : 'Not configured'}</small></div><div><span/><strong>{language === 'ar' ? 'المحلل الذكي المحلي' : 'Local intelligence engine'}</strong><small>Ready</small></div></div></section>
    <section className="danger-zone"><div><RotateCcw size={22}/><div><strong>{language === 'ar' ? 'إعادة ضبط البيانات التجريبية' : 'Reset demo data'}</strong><p>{language === 'ar' ? 'يحذف تعديلات هذا المتصفح ويعيد بيانات البداية.' : 'Removes browser changes and restores the starter dataset.'}</p></div></div>{confirm ? <div className="confirm-actions"><Button variant="secondary" onClick={() => setConfirm(false)}>{language === 'ar' ? 'تراجع' : 'Cancel'}</Button><Button variant="danger" onClick={() => { resetDemo(); setConfirm(false) }}>{language === 'ar' ? 'تأكيد إعادة الضبط' : 'Confirm reset'}</Button></div> : <Button variant="danger" onClick={() => setConfirm(true)}>{language === 'ar' ? 'إعادة الضبط' : 'Reset'}</Button>}</section>
  </>
}
