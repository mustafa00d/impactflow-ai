import { Bot, BrainCircuit, ChartNoAxesCombined, CircleDollarSign, FileCheck2, Send, ShieldCheck, Sparkles, UserRoundSearch } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Badge, Button, PageHeader } from '../components/UI'
import { useApp } from '../context/AppContext'
import { analyseData, askAssistant } from '../lib/ai'

interface Message { id: string; role: 'assistant' | 'user'; content: string }

export default function AiCenter() {
  const { data, language } = useApp()
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Message[]>([{ id: 'welcome', role: 'assistant', content: language === 'ar' ? `مرحبًا ${data.currentUser.name.split(' ')[0]}، حللت بيانات مساحة العمل. يمكنني مراجعة المالية والتقارير والمستفيدين والمشروعات. ماذا تريد أن تعرف؟` : `Hello ${data.currentUser.name.split(' ')[0]}. I have analysed this workspace. Ask me about finance, reports, beneficiaries or projects.` }])
  const insights = analyseData(data, language)
  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages, loading])

  const send = async (event: FormEvent, quickPrompt?: string) => {
    event.preventDefault()
    const text = quickPrompt || prompt.trim(); if (!text || loading) return
    setMessages(current => [...current, { id: crypto.randomUUID(), role: 'user', content: text }]); setPrompt(''); setLoading(true)
    const answer = await askAssistant(text, data, language)
    setMessages(current => [...current, { id: crypto.randomUUID(), role: 'assistant', content: answer }]); setLoading(false)
  }

  const agents = [
    { icon: CircleDollarSign, title: language === 'ar' ? 'المراجع المالي' : 'Financial reviewer', body: language === 'ar' ? 'يطابق المصروفات والأدلة' : 'Reconciles spend and evidence', tone: 'teal' },
    { icon: FileCheck2, title: language === 'ar' ? 'مدقق التقارير' : 'Report auditor', body: language === 'ar' ? 'يكتشف النواقص والتناقضات' : 'Finds gaps and inconsistencies', tone: 'blue' },
    { icon: ChartNoAxesCombined, title: language === 'ar' ? 'محلل الأثر' : 'Impact analyst', body: language === 'ar' ? 'يستخرج المؤشرات والاتجاهات' : 'Surfaces indicators and trends', tone: 'violet' },
    { icon: UserRoundSearch, title: language === 'ar' ? 'مدقق المستفيدين' : 'Beneficiary checker', body: language === 'ar' ? 'يراجع التوزيع والتكرار' : 'Reviews reach and duplication', tone: 'amber' },
  ]
  const quick = language === 'ar' ? ['حلل الوضع المالي للمشروعات', 'ما التقارير التي تحتاج استكمالًا؟', 'لخص أعداد المستفيدين', 'ما أهم المخاطر الحالية؟'] : ['Analyse project finances', 'Which reports need completion?', 'Summarise beneficiary reach', 'What are the current risks?']

  return <>
    <PageHeader eyebrow="IMPACT INTELLIGENCE" title={language === 'ar' ? 'مركز الذكاء الاصطناعي' : 'AI intelligence center'} description={language === 'ar' ? 'فريق من المساعدين المتخصصين يعمل على بياناتك ضمن صلاحياتك.' : 'Specialist assistants working with the data you are permitted to access.'} actions={<Badge tone="verified"><ShieldCheck size={14}/>{language === 'ar' ? 'صلاحيات آمنة' : 'Permission aware'}</Badge>} />
    <section className="agent-grid">{agents.map(({ icon: Icon, title, body, tone }) => <article key={title}><span className={`stat-card__icon stat-card__icon--${tone}`}><Icon size={21}/></span><div><strong>{title}</strong><p>{body}</p></div><span className="agent-status"/></article>)}</section>
    <section className="ai-workspace">
      <article className="card chat-panel"><header><div className="ai-avatar"><Bot size={22}/><span/></div><div><strong>Impact Assistant</strong><small><span/> {language === 'ar' ? 'متصل ببيانات مساحة العمل' : 'Connected to workspace data'}</small></div><Badge tone="ai"><Sparkles size={13}/>AI</Badge></header><div className="chat-messages">{messages.map(message => <div key={message.id} className={`chat-message chat-message--${message.role}`}>{message.role === 'assistant' && <span className="chat-bot"><Bot size={17}/></span>}<p>{message.content}</p></div>)}{loading && <div className="chat-message chat-message--assistant"><span className="chat-bot"><Bot size={17}/></span><p className="typing"><i/><i/><i/></p></div>}<div ref={bottomRef}/></div><div className="quick-prompts">{quick.map(text => <button key={text} onClick={(event) => send(event, text)}>{text}</button>)}</div><form className="chat-input" onSubmit={send}><textarea rows={1} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder={language === 'ar' ? 'اسأل عن بياناتك أو اطلب تحليلًا…' : 'Ask about your data or request an analysis…'} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.currentTarget.form?.requestSubmit() } }}/><Button type="submit" disabled={!prompt.trim() || loading} icon={<Send size={17}/>}>{language === 'ar' ? 'إرسال' : 'Send'}</Button></form></article>
      <aside className="card insight-panel"><header className="card__header"><div><h2><BrainCircuit size={19}/>{language === 'ar' ? 'الرؤى المكتشفة' : 'Detected insights'}</h2><p>{language === 'ar' ? 'تُحدّث تلقائيًا' : 'Updated automatically'}</p></div></header><div>{insights.map(insight => <article className={`insight-card insight-card--${insight.severity}`} key={insight.id}><span/><div><strong>{insight.title}</strong><p>{insight.description}</p><button>{insight.action}</button></div></article>)}</div><div className="ai-disclaimer"><ShieldCheck size={17}/><p>{language === 'ar' ? 'اقتراحات الذكاء للمساعدة فقط. يجب اعتماد القرارات الحساسة بواسطة شخص مخوّل.' : 'AI suggestions are assistive. Sensitive decisions require authorised human approval.'}</p></div></aside>
    </section>
  </>
}
