import { CalendarDays, Filter, FolderKanban, MapPin, Plus, Search } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import { Badge, Button, Field, Modal, PageHeader, Progress } from '../components/UI'
import { useApp } from '../context/AppContext'
import { formatCurrency, projectStatusLabel } from '../lib/utils'

export default function Projects() {
  const { data, language, addProject, t } = useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const filtered = useMemo(() => data.projects.filter((project) => (status === 'all' || project.status === status) && `${project.name} ${project.code} ${project.location}`.toLowerCase().includes(search.toLowerCase())), [data.projects, search, status])

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    const budget = Number(values.get('budget'))
    addProject({
      name: String(values.get('name')), code: String(values.get('code')), sector: String(values.get('sector')),
      location: String(values.get('location')), donor: String(values.get('donor')), partner: String(values.get('partner')),
      budget, spent: 0, beneficiaries: Number(values.get('beneficiaries')), startDate: String(values.get('startDate')),
      endDate: String(values.get('endDate')), status: 'draft', progress: 0,
    })
    setModalOpen(false)
  }

  return <>
    <PageHeader eyebrow={language === 'ar' ? 'إدارة دورة المشروع' : 'Project lifecycle'} title={t('projects')} description={language === 'ar' ? 'خطط ونفّذ وتابع جميع المشروعات من مكان واحد.' : 'Plan, deliver and monitor every project from one place.'} actions={<Button onClick={() => setModalOpen(true)} icon={<Plus size={18}/>}>{t('newProject')}</Button>} />
    <div className="toolbar"><label className="toolbar-search"><Search size={18}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('search')}/></label><label className="filter-select"><Filter size={17}/><select value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">{language === 'ar' ? 'كل الحالات' : 'All statuses'}</option><option value="active">{t('active')}</option><option value="completed">{t('completed')}</option><option value="at-risk">{t('atRisk')}</option><option value="draft">{t('draft')}</option></select></label></div>
    <section className="project-cards">{filtered.map((project) => <article className="project-card" key={project.id}><header><span className={`project-symbol project-symbol--${project.status}`}><FolderKanban size={22}/></span><Badge tone={project.status}>{projectStatusLabel(project.status, language)}</Badge></header><div className="project-card__body"><span className="project-code">{project.code}</span><h2>{project.name}</h2><p><MapPin size={15}/>{project.location} · {project.sector}</p></div><div className="project-meta"><div><span>{t('donor')}</span><strong>{project.donor}</strong></div><div><span>{language === 'ar' ? 'المستفيدون' : 'Beneficiaries'}</span><strong>{project.beneficiaries.toLocaleString()}</strong></div></div><div className="project-budget"><div><span>{t('spent')}</span><strong>{formatCurrency(project.spent, language)}</strong></div><span>{formatCurrency(project.budget, language)}</span></div><Progress value={project.progress} tone={project.status === 'at-risk' ? 'warning' : 'primary'}/><footer><span><CalendarDays size={15}/>{project.startDate}</span><span>{project.progress}%</span></footer></article>)}</section>
    {filtered.length === 0 && <div className="empty-simple"><Search size={28}/><h3>{t('noResults')}</h3></div>}

    <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={t('newProject')}>
      <form className="form-grid" onSubmit={submit}><Field label={language === 'ar' ? 'اسم المشروع' : 'Project name'}><input name="name" required /></Field><Field label={language === 'ar' ? 'رمز المشروع' : 'Project code'}><input name="code" required placeholder="IF-2026-001" /></Field><Field label={language === 'ar' ? 'القطاع' : 'Sector'}><select name="sector"><option>{language === 'ar' ? 'الأمن الغذائي' : 'Food security'}</option><option>{language === 'ar' ? 'التعليم' : 'Education'}</option><option>{language === 'ar' ? 'الصحة' : 'Health'}</option><option>{language === 'ar' ? 'الإيواء' : 'Shelter'}</option></select></Field><Field label={t('location')}><input name="location" required /></Field><Field label={t('donor')}><input name="donor" required /></Field><Field label={language === 'ar' ? 'الشريك' : 'Partner'}><input name="partner" required /></Field><Field label={t('budget')}><input name="budget" type="number" min="0" required /></Field><Field label={t('beneficiaries')}><input name="beneficiaries" type="number" min="0" required /></Field><Field label={language === 'ar' ? 'تاريخ البداية' : 'Start date'}><input name="startDate" type="date" required /></Field><Field label={language === 'ar' ? 'تاريخ النهاية' : 'End date'}><input name="endDate" type="date" required /></Field><div className="form-actions"><Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>{t('cancel')}</Button><Button type="submit">{t('save')}</Button></div></form>
    </Modal>
  </>
}
