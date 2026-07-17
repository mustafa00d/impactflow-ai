import { Download, FileBarChart, Filter, MoreHorizontal, Plus, Search, Share2 } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import { Badge, Button, Field, Modal, PageHeader, Progress } from '../components/UI'
import { useApp } from '../context/AppContext'
import { reportStatusLabel } from '../lib/utils'

export default function Reports() {
  const { data, language, addReport, t } = useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const reports = useMemo(() => data.reports.filter((report) => (status === 'all' || report.status === status) && `${report.title} ${report.type} ${report.owner}`.toLowerCase().includes(search.toLowerCase())), [data.reports, search, status])

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const form = new FormData(event.currentTarget)
    addReport({ projectId: String(form.get('project')), title: String(form.get('title')), type: form.get('type') as 'F1' | 'F4' | 'F5' | 'Narrative', period: String(form.get('period')), owner: data.currentUser.name, status: 'draft', completeness: 10 })
    setModalOpen(false)
  }
  const exportCsv = () => {
    const rows = [['title','type','period','owner','status','completeness'], ...reports.map(r => [r.title,r.type,r.period,r.owner,r.status,String(r.completeness)])]
    const blob = new Blob([rows.map(r => r.map(v => `"${v.replaceAll('"','""')}"`).join(',')).join('\n')], { type: 'text/csv;charset=utf-8' })
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'impactflow-reports.csv'; link.click(); URL.revokeObjectURL(link.href)
  }

  return <>
    <PageHeader eyebrow={language === 'ar' ? 'مركز التقارير' : 'Reporting hub'} title={t('reports')} description={language === 'ar' ? 'أنشئ التقارير وراجع اكتمالها وشارك النسخ المعتمدة.' : 'Create, review and share donor-ready reports.'} actions={<><Button variant="secondary" onClick={exportCsv} icon={<Download size={17}/>}>{t('export')}</Button><Button onClick={() => setModalOpen(true)} icon={<Plus size={18}/>}>{t('newReport')}</Button></>} />
    <div className="report-kpis"><div><span>{data.reports.length}</span><small>{language === 'ar' ? 'إجمالي التقارير' : 'Total reports'}</small></div><div><span>{data.reports.filter(r => r.status === 'approved').length}</span><small>{t('approved')}</small></div><div><span>{data.reports.filter(r => r.status === 'review').length}</span><small>{t('review')}</small></div><div><span>{Math.round(data.reports.reduce((s,r) => s+r.completeness,0)/data.reports.length)}%</span><small>{t('completeness')}</small></div></div>
    <div className="toolbar"><label className="toolbar-search"><Search size={18}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('search')}/></label><label className="filter-select"><Filter size={17}/><select value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">{language === 'ar' ? 'كل الحالات' : 'All statuses'}</option><option value="draft">{t('draft')}</option><option value="review">{t('review')}</option><option value="approved">{t('approved')}</option><option value="returned">{t('returned')}</option></select></label></div>
    <section className="card"><div className="table-scroll"><table><thead><tr><th>{language === 'ar' ? 'التقرير' : 'Report'}</th><th>{language === 'ar' ? 'المشروع' : 'Project'}</th><th>{t('owner')}</th><th>{language === 'ar' ? 'الفترة' : 'Period'}</th><th>{t('completeness')}</th><th>{t('status')}</th><th></th></tr></thead><tbody>{reports.map((report) => <tr key={report.id}><td><div className="table-title"><span><FileBarChart size={17}/></span><div><strong>{report.title}</strong><small>{report.type}</small></div></div></td><td>{data.projects.find(p => p.id === report.projectId)?.name}</td><td>{report.owner}</td><td>{report.period}</td><td><div className="completion-cell"><Progress value={report.completeness} tone={report.completeness < 85 ? 'warning' : 'primary'}/><span>{report.completeness}%</span></div></td><td><Badge tone={report.status}>{reportStatusLabel(report.status, language)}</Badge></td><td><div className="row-actions"><button title={t('share')}><Share2 size={17}/></button><button><MoreHorizontal size={18}/></button></div></td></tr>)}</tbody></table></div></section>
    <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={t('newReport')}><form onSubmit={submit} className="form-grid"><Field label={language === 'ar' ? 'عنوان التقرير' : 'Report title'}><input name="title" required /></Field><Field label={language === 'ar' ? 'نوع النموذج' : 'Template type'}><select name="type"><option>F1</option><option>F4</option><option>F5</option><option value="Narrative">Narrative</option></select></Field><Field label={t('projects')}><select name="project">{data.projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></Field><Field label={language === 'ar' ? 'فترة التقرير' : 'Reporting period'}><input name="period" required placeholder={language === 'ar' ? 'يوليو 2026' : 'July 2026'}/></Field><div className="form-actions"><Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>{t('cancel')}</Button><Button type="submit">{t('save')}</Button></div></form></Modal>
  </>
}
