import {
  Bell, Bot, BriefcaseBusiness, ChevronDown, CircleDollarSign, FileBarChart, FileText,
  FolderKanban, Languages, LayoutDashboard, LogOut, Menu, Moon, Search, Settings, Sun, UsersRound, X,
} from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Badge } from './UI'

export default function Layout() {
  const { data, language, setLanguage, darkMode, setDarkMode, logout, t, markNotificationsRead } = useApp()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const location = useLocation()
  const unread = data.notifications.filter((item) => !item.read).length

  const nav = [
    { to: '/', label: t('dashboard'), icon: LayoutDashboard },
    { to: '/projects', label: t('projects'), icon: FolderKanban },
    { to: '/reports', label: t('reports'), icon: FileBarChart },
    { to: '/finance', label: t('finance'), icon: CircleDollarSign },
    { to: '/beneficiaries', label: t('beneficiaries'), icon: UsersRound },
    { to: '/documents', label: t('documents'), icon: FileText },
    { to: '/ai', label: t('ai'), icon: Bot, special: true },
    { to: '/admin', label: t('admin'), icon: Settings },
  ]

  const closeMobile = () => setSidebarOpen(false)

  return <div className="app-shell">
    <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
      <div className="brand">
        <img src="/logo.svg" alt="" />
        <div><strong>ImpactFlow</strong><span>AI Operations</span></div>
        <button className="icon-button sidebar__close" onClick={closeMobile}><X size={20} /></button>
      </div>
      <div className="workspace-switcher">
        <span className="workspace-switcher__icon"><BriefcaseBusiness size={18} /></span>
        <div><small>{language === 'ar' ? 'مساحة العمل' : 'Workspace'}</small><strong>{data.organization.name}</strong></div>
        <ChevronDown size={16} />
      </div>
      <nav className="sidebar__nav">
        <span className="nav-label">{language === 'ar' ? 'مساحة الإدارة' : 'MANAGEMENT'}</span>
        {nav.map(({ to, label, icon: Icon, special }) => <NavLink key={to} to={to} end={to === '/'} onClick={closeMobile} className={({ isActive }) => `nav-item ${isActive ? 'nav-item--active' : ''} ${special ? 'nav-item--ai' : ''}`}>
          <Icon size={20} /><span>{label}</span>{special && <Badge tone="ai">AI</Badge>}
        </NavLink>)}
      </nav>
      <div className="sidebar__footer">
        <div className="plan-card"><span>PRO</span><strong>{language === 'ar' ? 'الخطة الاحترافية' : 'Professional plan'}</strong><small>{language === 'ar' ? 'استخدام الذكاء 62٪' : 'AI usage 62%'}</small><div className="mini-progress"><span style={{ width: '62%' }} /></div></div>
        <button className="user-chip" onClick={logout}>
          <span className="avatar">م</span><div><strong>{data.currentUser.name}</strong><small>{t('roleAdmin')}</small></div><LogOut size={17} />
        </button>
      </div>
    </aside>
    {sidebarOpen && <button className="sidebar-overlay" onClick={closeMobile} aria-label="Close navigation" />}

    <main className="main-area">
      <header className="topbar">
        <button className="icon-button mobile-menu" onClick={() => setSidebarOpen(true)}><Menu size={22} /></button>
        <button className="search-box" onClick={() => setSearchOpen(true)}><Search size={18} /><span>{t('search')}</span><kbd>⌘ K</kbd></button>
        <div className="topbar__actions">
          <button className="icon-button" onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')} title={t('language')}><Languages size={20} /></button>
          <button className="icon-button" onClick={() => setDarkMode(!darkMode)} title={t('darkMode')}>{darkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
          <div className="popover-anchor">
            <button className="icon-button" onClick={() => setNotificationsOpen(!notificationsOpen)}><Bell size={20} />{unread > 0 && <span className="notification-dot">{unread}</span>}</button>
            {notificationsOpen && <div className="popover notifications-popover">
              <header><strong>{t('notifications')}</strong><button onClick={markNotificationsRead}>{language === 'ar' ? 'تحديد الكل كمقروء' : 'Mark all read'}</button></header>
              {data.notifications.map((item) => <div key={item.id} className={`notification-item ${!item.read ? 'notification-item--unread' : ''}`}><span className={`notification-tone notification-tone--${item.tone}`} /><div><strong>{item.title}</strong><p>{item.body}</p><small>{item.time}</small></div></div>)}
            </div>}
          </div>
          <span className="topbar__divider" />
          <div className="topbar-user"><span className="avatar avatar--small">م</span><div><strong>{data.currentUser.name.split(' ').slice(0, 2).join(' ')}</strong><small>{t('roleAdmin')}</small></div></div>
        </div>
      </header>
      <div className="content" key={location.pathname}><Outlet /></div>
    </main>

    {searchOpen && <div className="command-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setSearchOpen(false)}><div className="command-palette"><div><Search size={20} /><input autoFocus placeholder={t('search')} /><button onClick={() => setSearchOpen(false)}>ESC</button></div><p>{language === 'ar' ? 'جرّب: تقرير، مشروع التعليم، معاملة معلّمة' : 'Try: report, education project, flagged transaction'}</p></div></div>}
  </div>
}
