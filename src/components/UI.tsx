import { X } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

export function Button({ children, variant = 'primary', icon, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; icon?: ReactNode }) {
  return <button className={`button button--${variant} ${className}`} {...props}>{icon}{children}</button>
}

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: string }) {
  return <span className={`badge badge--${tone}`}>{children}</span>
}

export function Progress({ value, tone = 'primary' }: { value: number; tone?: 'primary' | 'warning' | 'danger' }) {
  return <div className="progress" aria-label={`${value}%`}><span className={`progress__bar progress__bar--${tone}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>
}

export function EmptyState({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return <div className="empty-state"><div className="empty-state__icon">{icon}</div><h3>{title}</h3><p>{body}</p></div>
}

export function Modal({ open, title, children, onClose, width = '620px' }: { open: boolean; title: string; children: ReactNode; onClose: () => void; width?: string }) {
  if (!open) return null
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="modal" role="dialog" aria-modal="true" aria-label={title} style={{ maxWidth: width }}>
      <header className="modal__header"><h2>{title}</h2><button className="icon-button" onClick={onClose} aria-label="Close"><X size={20} /></button></header>
      <div className="modal__body">{children}</div>
    </section>
  </div>
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return <label className="field"><span className="field__label">{label}</span>{children}{hint && <small>{hint}</small>}</label>
}

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description: string; actions?: ReactNode }) {
  return <div className="page-header"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h1>{title}</h1><p>{description}</p></div>{actions && <div className="page-header__actions">{actions}</div>}</div>
}
