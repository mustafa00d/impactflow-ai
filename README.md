# ImpactFlow AI

ImpactFlow AI is a bilingual, multi-organisation operations platform for projects, reports, finance, beneficiary reach, supporting evidence and assistive AI analysis. It is designed for humanitarian and social-impact teams that need a clear audit trail without a heavyweight enterprise deployment.

**Live demo:** https://mustafa00d.github.io/impactflow-ai/

## What is included

- Responsive Arabic/English interface with RTL/LTR support and dark mode
- Project portfolio, budgets, progress and delivery risk
- F1/F4/F5 and narrative reporting workspace
- Financial transactions, evidence counts and flagged-item review
- Aggregated beneficiary and demographic reporting
- Evidence vault with a browser upload flow
- Permission-aware AI assistant with a deterministic local fallback
- Public, privacy-safe project share page (`/share/demo-project`)
- Installable PWA shell for desktop and mobile
- Supabase PostgreSQL schema, row-level security and private evidence bucket
- Server-side Gemini integration through a Supabase Edge Function
- Unit test and GitHub Actions verification workflow
- Automated GitHub Pages deployment from the `main` branch

## Run locally

Requirements: Node.js 22+ and npm.

```bash
npm install
npm run dev
```

Open the printed local URL. The demo login form is pre-filled; click **Enter workspace**. Demo changes persist only in the current browser and can be reset from System Admin.

## Verify

```bash
npm run lint
npm test
npm run build
```

## Connect Supabase

1. Create a Supabase project.
2. Run `supabase/migrations/202607170001_initial_schema.sql` with the Supabase CLI or SQL editor.
3. Copy `.env.example` to `.env.local` and add the project URL and public anonymous key.
4. Deploy `supabase/functions/ai-assistant`.
5. Set `GEMINI_API_KEY` and optionally `GEMINI_MODEL` as server-side Edge Function secrets.

Never expose the Gemini key or Supabase service-role key in a `VITE_*` environment variable. The supplied Edge Function authenticates the caller and relies on row-level security before preparing AI context.

## Architecture

- **Client:** React, TypeScript, Vite, Recharts, custom responsive design system
- **Database/Auth/Storage:** Supabase Postgres, Auth and Storage
- **AI:** server-side Gemini API with a local rules-based continuity layer
- **Deployment:** static client on Cloudflare Pages; Supabase for stateful services
- **Quality:** TypeScript strict mode, ESLint, Vitest and GitHub Actions

## Production checklist

- Replace demo access with Supabase Auth and verified invitations.
- Apply the database migration and test every role with RLS enabled.
- Add malware scanning and OCR to the document ingestion pipeline.
- Configure backups, retention, privacy notices and a data-processing agreement.
- Use approved donor templates and require human approval before submission.
- Do not use the health-sector extension for diagnosis or automated eligibility decisions.

## Licence

Copyright © 2026 Mustafa Awad Dawood. All rights reserved until a public licence is selected.
