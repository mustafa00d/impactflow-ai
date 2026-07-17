import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: cors })
  try {
    const authorization = request.headers.get('Authorization')
    if (!authorization) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...cors, 'Content-Type': 'application/json' } })

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authorization } } })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...cors, 'Content-Type': 'application/json' } })

    const { prompt, language = 'ar' } = await request.json()
    if (typeof prompt !== 'string' || prompt.length < 2 || prompt.length > 4000) throw new Error('Invalid prompt')

    // Row-level security ensures only records from organisations available to this user are included.
    const [{ data: projects }, { data: reports }, { data: transactions }] = await Promise.all([
      supabase.from('projects').select('name,code,sector,location,budget,spent,beneficiaries,status,progress').limit(100),
      supabase.from('reports').select('title,report_type,status,completeness,period').limit(100),
      supabase.from('transactions').select('description,vendor,category,amount,status,transaction_date').limit(150),
    ])

    const apiKey = Deno.env.get('GEMINI_API_KEY')
    if (!apiKey) throw new Error('AI is not configured')
    const model = Deno.env.get('GEMINI_MODEL') || 'gemini-2.5-flash'
    const system = `You are ImpactFlow AI, an operations analyst for humanitarian and social-impact organisations. Answer in ${language === 'ar' ? 'Arabic' : 'English'}. Use only the supplied workspace facts. Never invent evidence or approvals. Flag uncertainty. Do not expose personal beneficiary data. Financial or health-related outputs are assistive and require authorised human review.`
    const context = JSON.stringify({ projects, reports, transactions })
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: `${system}\n\nWorkspace data:\n${context}\n\nUser request:\n${prompt}` }] }], generationConfig: { temperature: 0.2, maxOutputTokens: 1000 } }),
    })
    if (!response.ok) throw new Error(`Gemini error ${response.status}`)
    const result = await response.json()
    const answer = result.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || '').join('')
    if (!answer) throw new Error('Empty AI response')
    return new Response(JSON.stringify({ answer }), { headers: { ...cors, 'Content-Type': 'application/json' } })
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unexpected error' }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } })
  }
})
