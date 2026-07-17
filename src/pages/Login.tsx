import { ArrowLeft, ArrowRight, BarChart3, Bot, CheckCircle2, FileCheck2, Globe2, ShieldCheck } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useApp } from '../context/AppContext'
import { Button, Field } from '../components/UI'

export default function Login() {
  const { language, setLanguage, login } = useApp()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('demo@impactflow.app')
  const [password, setPassword] = useState('demo-access')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setTimeout(login, 450)
  }

  const Arrow = language === 'ar' ? ArrowLeft : ArrowRight
  return <main className="login-page">
    <section className="login-story">
      <div className="login-story__glow login-story__glow--one" /><div className="login-story__glow login-story__glow--two" />
      <div className="login-brand"><img src="/logo.svg" alt="" /><strong>ImpactFlow AI</strong></div>
      <div className="login-story__content">
        <span className="login-kicker"><Bot size={16} />{language === 'ar' ? 'منصة تشغيل مدعومة بالذكاء الاصطناعي' : 'AI-powered operations platform'}</span>
        <h1>{language === 'ar' ? 'حوّل البيانات المتفرقة إلى أثر يمكن إثباته.' : 'Turn scattered data into impact you can prove.'}</h1>
        <p>{language === 'ar' ? 'أدر المشروعات والميزانيات والمستفيدين والتقارير من مساحة واحدة، واترك للذكاء الاصطناعي مهمة اكتشاف النواقص قبل أن تتحول إلى مشكلات.' : 'Manage projects, budgets, beneficiaries and reports from one place—while AI identifies gaps before they become problems.'}</p>
        <div className="login-benefits">
          <div><FileCheck2 /><span>{language === 'ar' ? 'تقارير جاهزة للمانحين' : 'Donor-ready reports'}</span></div>
          <div><BarChart3 /><span>{language === 'ar' ? 'تحليل لحظي للأداء' : 'Live performance insights'}</span></div>
          <div><ShieldCheck /><span>{language === 'ar' ? 'صلاحيات وسجل تدقيق' : 'Permissions and audit trail'}</span></div>
        </div>
      </div>
      <div className="login-trust"><div className="avatar-stack"><span>م</span><span>ع</span><span>هـ</span></div><p>{language === 'ar' ? 'مصمم للفرق التي تعمل في الميدان' : 'Built for teams working in the field'}</p></div>
    </section>
    <section className="login-panel">
      <button className="language-button" onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}><Globe2 size={18} />{language === 'ar' ? 'English' : 'العربية'}</button>
      <form className="login-form" onSubmit={submit}>
        <div className="login-form__logo"><img src="/logo.svg" alt="" /></div>
        <h2>{language === 'ar' ? 'مرحبًا بعودتك' : 'Welcome back'}</h2>
        <p>{language === 'ar' ? 'ادخل إلى مساحة العمل التجريبية الكاملة' : 'Enter the fully-featured demo workspace'}</p>
        <div className="demo-banner"><CheckCircle2 size={18} /><span>{language === 'ar' ? 'البيانات تجريبية ويمكن إعادة ضبطها من الإعدادات.' : 'Demo data can be reset from system settings.'}</span></div>
        <Field label={language === 'ar' ? 'البريد الإلكتروني' : 'Email address'}><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></Field>
        <Field label={language === 'ar' ? 'كلمة المرور' : 'Password'}><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></Field>
        <Button type="submit" disabled={loading} icon={<Arrow size={18} />}>{loading ? (language === 'ar' ? 'جارٍ الدخول…' : 'Signing in…') : (language === 'ar' ? 'الدخول إلى المنصة' : 'Enter workspace')}</Button>
        <small className="login-note">{language === 'ar' ? 'في وضع الإنتاج يُستبدل الدخول التجريبي بمصادقة Supabase الآمنة.' : 'Production mode replaces demo access with secure Supabase authentication.'}</small>
      </form>
    </section>
  </main>
}
