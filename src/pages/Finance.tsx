import { AlertTriangle, CheckCircle2, CircleDollarSign, Download, FileWarning, Plus, Search } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import { Badge, Button, Field, Modal, PageHeader, Progress } from '../components/UI'
import { useApp } from '../context/AppContext'
import { formatCurrency, percentage, reportStatusLabel } from '../lib/utils'

export default function Finance() {
  const { data, language, addTransaction, t } = useApp()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const transactions = useMemo(() => data.transactions.filter((item) => `${item.description} ${item.vendor} ${item.category}`.toLowerCase().includes(search.toLowerCase())), [data.transactions, search])
  const budget = data.projects.reduce((sum, item) => sum + item.budget, 0)
  const spent = data.projects.reduce((sum, item) => sum + item.spent, 0)
  const verified = data.transactions.filter((item) => item.status === 'verified').reduce((sum, item) => sum + item.amount, 0)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const form = new FormData(event.currentTarget)
    addTransaction({ projectId: String(form.get('project')), description: String(form.get('description')), vendor: String(form.get('vendor')), category: String(form.get('category')), amount: Number(form.get('amount')), date: String(form.get('date')), status: 'pending', evidenceCount: 0 })
    setOpen(false)
  }

  return <>
    <PageHeader eyebrow={language === 'ar' ? 'الرقابة المالية' : 'Financial control'} title={t('finance')} description={language === 'ar' ? 'راقب الميزانيات وطابق المصروفات مع أدلة الدفع.' : 'Track budgets and reconcile expenditure with supporting evidence.'} actions={<><Button variant="secondary" icon={<Download size={17}/>}>{t('export')}</Button><Button onClick={() => setOpen(true)} icon={<Plus size={18}/>}>{t('newTransaction')}</Button></>} />
    <section className="finance-summary">
      <article><span className="finance-icon finance-icon--teal"><CircleDollarSign/></span><div><small>{t('totalBudget')}</small><strong>{formatCurrency(budget, language)}</strong><p>{data.projects.length} {language === 'ar' ? 'مشروعات ممولة' : 'funded projects'}</p></div></article>
      <article><span className="finance-icon finance-icon--blue"><CheckCircle2/></span><div><small>{language === 'ar' ? 'إجمالي المصروف' : 'Total spent'}</small><strong>{formatCurrency(spent, language)}</strong><p>{percentage(spent, budget)}% {language === 'ar' ? 'من الميزانية' : 'of budget'}</p></div></article>
      <article><span className="finance-icon finance-icon--amber"><FileWarning/></span><div><small>{language === 'ar' ? 'قيمة تم التحقق منها' : 'Verified value'}</small><strong>{formatCurrency(verified, language)}</strong><p>{data.transactions.filter(t => t.status === 'flagged').length} {language === 'ar' ? 'تحتاج مراجعة' : 'require review'}</p></div></article>
    </section>
    <section className="card budget-utilization"><header className="card__header"><div><h2>{language === 'ar' ? 'استخدام ميزانيات المشروعات' : 'Project budget utilization'}</h2><p>{language === 'ar' ? 'تنبيه تلقائي عند تجاوز النطاق المتوقع' : 'Automatic alert outside the expected range'}</p></div></header><div className="budget-bars">{data.projects.map(project => { const value = percentage(project.spent, project.budget); return <div key={project.id}><div><strong>{project.name}</strong><span>{formatCurrency(project.spent, language)} / {formatCurrency(project.budget, language)}</span></div><Progress value={value} tone={value > 90 && project.status !== 'completed' ? 'warning' : 'primary'}/><small>{value}%</small></div>})}</div></section>
    <div className="toolbar"><label className="toolbar-search"><Search size={18}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('search')}/></label></div>
    <section className="card"><div className="table-scroll"><table><thead><tr><th>{language === 'ar' ? 'المعاملة' : 'Transaction'}</th><th>{language === 'ar' ? 'المورد' : 'Vendor'}</th><th>{language === 'ar' ? 'الفئة' : 'Category'}</th><th>{language === 'ar' ? 'التاريخ' : 'Date'}</th><th>{language === 'ar' ? 'الأدلة' : 'Evidence'}</th><th>{language === 'ar' ? 'المبلغ' : 'Amount'}</th><th>{t('status')}</th></tr></thead><tbody>{transactions.map(item => <tr key={item.id}><td><div className="table-title"><span className={item.status === 'flagged' ? 'table-icon--danger' : ''}>{item.status === 'flagged' ? <AlertTriangle size={17}/> : <CircleDollarSign size={17}/>}</span><div><strong>{item.description}</strong><small>{data.projects.find(p => p.id === item.projectId)?.code}</small></div></div></td><td>{item.vendor}</td><td>{item.category}</td><td>{item.date}</td><td>{item.evidenceCount} {language === 'ar' ? 'مستند' : 'files'}</td><td><strong>{formatCurrency(item.amount, language)}</strong></td><td><Badge tone={item.status}>{reportStatusLabel(item.status, language)}</Badge></td></tr>)}</tbody></table></div></section>
    <Modal open={open} onClose={() => setOpen(false)} title={t('newTransaction')}><form className="form-grid" onSubmit={submit}><Field label={language === 'ar' ? 'وصف المعاملة' : 'Description'}><input name="description" required/></Field><Field label={language === 'ar' ? 'المشروع' : 'Project'}><select name="project">{data.projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></Field><Field label={language === 'ar' ? 'المورد' : 'Vendor'}><input name="vendor" required/></Field><Field label={language === 'ar' ? 'الفئة' : 'Category'}><select name="category"><option>{language === 'ar' ? 'مشتريات' : 'Procurement'}</option><option>{language === 'ar' ? 'لوجستيات' : 'Logistics'}</option><option>{language === 'ar' ? 'حوافز' : 'Incentives'}</option><option>{language === 'ar' ? 'خدمات' : 'Services'}</option></select></Field><Field label={language === 'ar' ? 'المبلغ' : 'Amount'}><input name="amount" type="number" min="1" required/></Field><Field label={language === 'ar' ? 'التاريخ' : 'Date'}><input name="date" type="date" required/></Field><div className="form-actions"><Button type="button" variant="secondary" onClick={() => setOpen(false)}>{t('cancel')}</Button><Button type="submit">{t('save')}</Button></div></form></Modal>
  </>
}
