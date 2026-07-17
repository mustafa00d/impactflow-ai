import { ArrowUpLeft, ArrowUpRight, Bot, CircleDollarSign, FileCheck2, FolderKanban, Lightbulb, MoreHorizontal, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Badge, Button, PageHeader, Progress } from '../components/UI'
import { useApp } from '../context/AppContext'
import { analyseData } from '../lib/ai'
import { formatCurrency, formatNumber, percentage, projectStatusLabel, reportStatusLabel } from '../lib/utils'

export default function Dashboard() {
  const { data, language, t } = useApp()
  const Arrow = language === 'ar' ? ArrowUpLeft : ArrowUpRight
  const activeProjects = data.projects.filter((item) => item.status === 'active' || item.status === 'at-risk').length
  const beneficiaries = data.projects.reduce((sum, item) => sum + item.beneficiaries, 0)
  const budget = data.projects.reduce((sum, item) => sum + item.budget, 0)
  const averageCompletion = Math.round(data.reports.reduce((sum, item) => sum + item.completeness, 0) / data.reports.length)
  const insights = analyseData(data, language).slice(0, 3)
  const trend = [
    { month: language === 'ar' ? 'مارس' : 'Mar', planned: 42, actual: 34 },
    { month: language === 'ar' ? 'أبريل' : 'Apr', planned: 53, actual: 46 },
    { month: language === 'ar' ? 'مايو' : 'May', planned: 66, actual: 62 },
    { month: language === 'ar' ? 'يونيو' : 'Jun', planned: 78, actual: 73 },
    { month: language === 'ar' ? 'يوليو' : 'Jul', planned: 89, actual: 81 },
  ]
  const sectorData = data.projects.map((item, index) => ({ name: item.sector, value: item.spent, color: ['#0f766e', '#14b8a6', '#f59e0b', '#6366f1'][index % 4] }))

  const stats = [
    { label: t('activeProjects'), value: activeProjects, note: language === 'ar' ? '+2 هذا الشهر' : '+2 this month', icon: FolderKanban, tone: 'teal' },
    { label: t('totalBeneficiaries'), value: formatNumber(beneficiaries, language), note: language === 'ar' ? '+12.4٪ عن الشهر السابق' : '+12.4% month-on-month', icon: UsersRound, tone: 'blue' },
    { label: t('totalBudget'), value: formatCurrency(budget, language), note: `${percentage(data.projects.reduce((s, p) => s + p.spent, 0), budget)}% ${language === 'ar' ? 'تم صرفه' : 'utilized'}`, icon: CircleDollarSign, tone: 'amber' },
    { label: t('completion'), value: `${averageCompletion}%`, note: language === 'ar' ? 'أعلى من الشهر السابق' : 'Improved this month', icon: FileCheck2, tone: 'violet' },
  ]

  return <>
    <PageHeader eyebrow={language === 'ar' ? 'الجمعة، 17 يوليو 2026' : 'Friday, 17 July 2026'} title={`${t('welcome')}، ${data.currentUser.name.split(' ')[0]} 👋`} description={t('overview')} actions={<Link to="/ai"><Button icon={<Bot size={18} />}>{language === 'ar' ? 'اسأل مساعد Impact' : 'Ask Impact assistant'}</Button></Link>} />
    <section className="stats-grid">
      {stats.map(({ label, value, note, icon: Icon, tone }) => <article className="stat-card" key={label}><div className={`stat-card__icon stat-card__icon--${tone}`}><Icon size={22} /></div><div><span>{label}</span><strong>{value}</strong><small><Arrow size={14} />{note}</small></div></article>)}
    </section>

    <section className="dashboard-grid dashboard-grid--charts">
      <article className="card chart-card chart-card--wide">
        <header className="card__header"><div><h2>{t('projectPerformance')}</h2><p>{language === 'ar' ? 'التقدم المخطط مقابل التنفيذ الفعلي' : 'Planned progress versus actual delivery'}</p></div><select aria-label="period"><option>{language === 'ar' ? 'آخر 5 أشهر' : 'Last 5 months'}</option></select></header>
        <div className="chart-legend"><span><i className="legend-dot legend-dot--teal" />{language === 'ar' ? 'فعلي' : 'Actual'}</span><span><i className="legend-dot legend-dot--muted" />{language === 'ar' ? 'مخطط' : 'Planned'}</span></div>
        <div className="chart-container"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trend} margin={{ top: 8, right: 0, bottom: 0, left: -16 }}><defs><linearGradient id="actualGradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#0f766e" stopOpacity={0.28}/><stop offset="100%" stopColor="#0f766e" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--border)"/><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 12 }}/><YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 12 }}/><Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)' }}/><Area type="monotone" dataKey="planned" stroke="#aab4b1" fill="transparent" strokeDasharray="5 5" strokeWidth={2}/><Area type="monotone" dataKey="actual" stroke="#0f766e" fill="url(#actualGradient)" strokeWidth={3}/></AreaChart></ResponsiveContainer></div>
      </article>
      <article className="card chart-card">
        <header className="card__header"><div><h2>{t('spending')}</h2><p>{language === 'ar' ? 'توزيع المصروفات الحالية' : 'Current expenditure distribution'}</p></div><button className="icon-button"><MoreHorizontal size={20}/></button></header>
        <div className="donut-wrap"><ResponsiveContainer width="100%" height={190}><PieChart><Pie data={sectorData} dataKey="value" innerRadius={58} outerRadius={80} paddingAngle={4} stroke="none">{sectorData.map((entry) => <Cell key={entry.name} fill={entry.color}/>)}</Pie><Tooltip formatter={(value) => formatCurrency(Number(value), language)} contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)' }}/></PieChart></ResponsiveContainer><div className="donut-center"><strong>{percentage(data.projects.reduce((s,p) => s + p.spent, 0), budget)}%</strong><span>{language === 'ar' ? 'مصروف' : 'spent'}</span></div></div>
        <div className="sector-legend">{sectorData.map((item) => <div key={item.name}><span><i style={{ background: item.color }}/>{item.name}</span><strong>{Math.round(item.value / 1000000)}M</strong></div>)}</div>
      </article>
    </section>

    <section className="dashboard-grid">
      <article className="card projects-overview">
        <header className="card__header"><div><h2>{language === 'ar' ? 'المشروعات ذات الأولوية' : 'Priority projects'}</h2><p>{language === 'ar' ? 'متابعة التنفيذ والصرف' : 'Delivery and budget tracking'}</p></div><Link to="/projects">{t('viewAll')} <Arrow size={15}/></Link></header>
        <div className="project-list">{data.projects.slice(0, 3).map((project) => <div className="project-row" key={project.id}><span className={`project-symbol project-symbol--${project.status}`}><FolderKanban size={19}/></span><div className="project-row__main"><div><strong>{project.name}</strong><small>{project.code} · {project.location}</small></div><div className="project-row__progress"><span>{project.progress}%</span><Progress value={project.progress} tone={project.status === 'at-risk' ? 'warning' : 'primary'} /></div></div><Badge tone={project.status}>{projectStatusLabel(project.status, language)}</Badge></div>)}</div>
      </article>
      <article className="card ai-insights">
        <header className="card__header"><div><h2><span className="sparkle"><Bot size={18}/></span>{language === 'ar' ? 'رؤى Impact AI' : 'Impact AI insights'}</h2><p>{language === 'ar' ? 'تحليل تلقائي لبياناتك' : 'Automatic analysis of your data'}</p></div><Badge tone="ai">LIVE</Badge></header>
        <div className="insight-list">{insights.map((insight) => <div className={`insight insight--${insight.severity}`} key={insight.id}><span><Lightbulb size={18}/></span><div><strong>{insight.title}</strong><p>{insight.description}</p><Link to={insight.id === 'flagged' ? '/finance' : insight.id === 'reports' ? '/reports' : '/projects'}>{insight.action} <Arrow size={14}/></Link></div></div>)}</div>
      </article>
    </section>

    <section className="card recent-table">
      <header className="card__header"><div><h2>{t('recentReports')}</h2><p>{language === 'ar' ? 'آخر التحديثات على التقارير' : 'Latest reporting activity'}</p></div><Link to="/reports">{t('viewAll')} <Arrow size={15}/></Link></header>
      <div className="table-scroll"><table><thead><tr><th>{language === 'ar' ? 'اسم التقرير' : 'Report'}</th><th>{language === 'ar' ? 'المشروع' : 'Project'}</th><th>{t('owner')}</th><th>{t('completeness')}</th><th>{t('status')}</th></tr></thead><tbody>{data.reports.slice(0, 4).map((report) => { const project = data.projects.find((item) => item.id === report.projectId); return <tr key={report.id}><td><div className="table-title"><span><FileCheck2 size={17}/></span><div><strong>{report.title}</strong><small>{report.type} · {report.period}</small></div></div></td><td>{project?.name}</td><td>{report.owner}</td><td><div className="completion-cell"><Progress value={report.completeness} tone={report.completeness < 85 ? 'warning' : 'primary'} /><span>{report.completeness}%</span></div></td><td><Badge tone={report.status}>{reportStatusLabel(report.status, language)}</Badge></td></tr>})}</tbody></table></div>
    </section>
  </>
}
