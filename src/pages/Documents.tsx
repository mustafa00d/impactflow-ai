import { CheckCircle2, FileArchive, FileCheck2, FileImage, FileText, Search, ShieldAlert, UploadCloud } from 'lucide-react'
import { useRef, useState, type ChangeEvent } from 'react'
import { Badge, Button, PageHeader } from '../components/UI'
import { useApp } from '../context/AppContext'

export default function Documents() {
  const { data, language, addDocument, t } = useApp()
  const [search, setSearch] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const upload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; if (!file) return
    addDocument({ projectId: data.projects[0].id, name: file.name, type: file.type.includes('image') ? 'invoice' : 'report', size: `${(file.size / 1024 / 1024).toFixed(1)} MB`, uploadedBy: data.currentUser.name, uploadedAt: new Date().toISOString().slice(0,10), verified: false })
    event.target.value = ''
  }
  const icons = { receipt: FileCheck2, identity: FileImage, invoice: FileText, agreement: FileArchive, report: FileText }
  const docs = data.documents.filter(doc => `${doc.name} ${doc.uploadedBy}`.toLowerCase().includes(search.toLowerCase()))
  return <>
    <PageHeader eyebrow={language === 'ar' ? 'خزنة الأدلة' : 'Evidence vault'} title={t('documents')} description={language === 'ar' ? 'احفظ الأدلة واربطها بالمشروعات والمعاملات مع سجل تحقق كامل.' : 'Store and connect evidence to projects and transactions with a complete verification trail.'} actions={<><input ref={inputRef} hidden type="file" onChange={upload}/><Button onClick={() => inputRef.current?.click()} icon={<UploadCloud size={18}/>}>{t('upload')}</Button></>} />
    <section className="document-drop" onClick={() => inputRef.current?.click()}><span><UploadCloud size={28}/></span><div><strong>{language === 'ar' ? 'اسحب الملفات هنا أو انقر للرفع' : 'Drop files here or click to upload'}</strong><p>{language === 'ar' ? 'PDF، Word، Excel والصور — حتى 50 MB' : 'PDF, Word, Excel and images — up to 50 MB'}</p></div><Badge tone="ai">AI OCR</Badge></section>
    <div className="toolbar"><label className="toolbar-search"><Search size={18}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('search')}/></label></div>
    <section className="document-grid">{docs.map(doc => { const Icon = icons[doc.type]; return <article className="document-card" key={doc.id}><div className="document-preview"><Icon size={34}/><span>{doc.name.split('.').pop()?.toUpperCase()}</span></div><div className="document-card__body"><h3 title={doc.name}>{doc.name}</h3><p>{data.projects.find(p => p.id === doc.projectId)?.name}</p><div><span>{doc.size}</span><span>{doc.uploadedAt}</span></div></div><footer>{doc.verified ? <Badge tone="verified"><CheckCircle2 size={13}/>{language === 'ar' ? 'تم التحقق' : 'Verified'}</Badge> : <Badge tone="flagged"><ShieldAlert size={13}/>{language === 'ar' ? 'بانتظار المراجعة' : 'Awaiting review'}</Badge>}<small>{doc.uploadedBy}</small></footer></article>})}</section>
  </>
}
