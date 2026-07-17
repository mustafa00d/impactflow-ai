-- ImpactFlow AI: production data model with organisation-scoped row-level security.
create extension if not exists pgcrypto;

create type public.member_role as enum ('admin', 'program', 'finance', 'reports', 'viewer');
create type public.project_status as enum ('draft', 'active', 'at-risk', 'completed');
create type public.report_status as enum ('draft', 'review', 'approved', 'returned');
create type public.transaction_status as enum ('pending', 'verified', 'flagged');

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text not null,
  sector text,
  plan text not null default 'free' check (plan in ('free','basic','professional')),
  created_at timestamptz not null default now()
);

create table public.memberships (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.member_role not null default 'viewer',
  display_name text not null,
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create or replace function public.is_org_member(org_id uuid)
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.memberships m where m.organization_id = org_id and m.user_id = auth.uid()) $$;

create or replace function public.has_org_role(org_id uuid, allowed public.member_role[])
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.memberships m where m.organization_id = org_id and m.user_id = auth.uid() and m.role = any(allowed)) $$;

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  code text not null,
  sector text not null,
  location text not null,
  donor text,
  partner text,
  budget numeric(16,2) not null default 0 check (budget >= 0),
  spent numeric(16,2) not null default 0 check (spent >= 0),
  beneficiaries integer not null default 0 check (beneficiaries >= 0),
  start_date date,
  end_date date,
  status public.project_status not null default 'draft',
  progress smallint not null default 0 check (progress between 0 and 100),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, code)
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  report_type text not null check (report_type in ('F1','F4','F5','Narrative')),
  period text not null,
  status public.report_status not null default 'draft',
  completeness smallint not null default 0 check (completeness between 0 and 100),
  content jsonb not null default '{}'::jsonb,
  submitted_at timestamptz,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  description text not null,
  vendor text not null,
  category text not null,
  amount numeric(16,2) not null check (amount > 0),
  transaction_date date not null,
  status public.transaction_status not null default 'pending',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.beneficiary_groups (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  location text not null,
  households integer not null default 0 check (households >= 0),
  men integer not null default 0 check (men >= 0),
  women integer not null default 0 check (women >= 0),
  boys integer not null default 0 check (boys >= 0),
  girls integer not null default 0 check (girls >= 0),
  people_with_disabilities integer not null default 0 check (people_with_disabilities >= 0),
  created_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  transaction_id uuid references public.transactions(id) on delete set null,
  name text not null,
  storage_path text not null,
  document_type text not null,
  mime_type text,
  size_bytes bigint check (size_bytes >= 0),
  verified boolean not null default false,
  extracted_data jsonb not null default '{}'::jsonb,
  uploaded_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table public.audit_log (
  id bigint generated always as identity primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  actor_id uuid references auth.users(id),
  entity_type text not null,
  entity_id uuid,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index projects_org_idx on public.projects(organization_id);
create index reports_project_idx on public.reports(project_id);
create index transactions_project_idx on public.transactions(project_id);
create index documents_project_idx on public.documents(project_id);
create index audit_org_time_idx on public.audit_log(organization_id, created_at desc);

alter table public.organizations enable row level security;
alter table public.memberships enable row level security;
alter table public.projects enable row level security;
alter table public.reports enable row level security;
alter table public.transactions enable row level security;
alter table public.beneficiary_groups enable row level security;
alter table public.documents enable row level security;
alter table public.audit_log enable row level security;

create policy "members read organizations" on public.organizations for select using (public.is_org_member(id));
create policy "members read memberships" on public.memberships for select using (public.is_org_member(organization_id));
create policy "admins manage memberships" on public.memberships for all using (public.has_org_role(organization_id, array['admin']::public.member_role[])) with check (public.has_org_role(organization_id, array['admin']::public.member_role[]));

create policy "members read projects" on public.projects for select using (public.is_org_member(organization_id));
create policy "managers write projects" on public.projects for all using (public.has_org_role(organization_id, array['admin','program']::public.member_role[])) with check (public.has_org_role(organization_id, array['admin','program']::public.member_role[]));
create policy "members read reports" on public.reports for select using (public.is_org_member(organization_id));
create policy "reporters write reports" on public.reports for all using (public.has_org_role(organization_id, array['admin','program','reports']::public.member_role[])) with check (public.has_org_role(organization_id, array['admin','program','reports']::public.member_role[]));
create policy "members read transactions" on public.transactions for select using (public.is_org_member(organization_id));
create policy "finance writes transactions" on public.transactions for all using (public.has_org_role(organization_id, array['admin','finance']::public.member_role[])) with check (public.has_org_role(organization_id, array['admin','finance']::public.member_role[]));
create policy "members read beneficiaries" on public.beneficiary_groups for select using (public.is_org_member(organization_id));
create policy "program writes beneficiaries" on public.beneficiary_groups for all using (public.has_org_role(organization_id, array['admin','program','reports']::public.member_role[])) with check (public.has_org_role(organization_id, array['admin','program','reports']::public.member_role[]));
create policy "members read documents" on public.documents for select using (public.is_org_member(organization_id));
create policy "staff write documents" on public.documents for all using (public.has_org_role(organization_id, array['admin','program','finance','reports']::public.member_role[])) with check (public.has_org_role(organization_id, array['admin','program','finance','reports']::public.member_role[]));
create policy "admins read audit" on public.audit_log for select using (public.has_org_role(organization_id, array['admin']::public.member_role[]));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('evidence', 'evidence', false, 52428800, array['application/pdf','image/jpeg','image/png','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'])
on conflict (id) do nothing;

create policy "members read evidence" on storage.objects for select using (bucket_id = 'evidence' and public.is_org_member((storage.foldername(name))[1]::uuid));
create policy "staff upload evidence" on storage.objects for insert with check (bucket_id = 'evidence' and public.has_org_role((storage.foldername(name))[1]::uuid, array['admin','program','finance','reports']::public.member_role[]));
