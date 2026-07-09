create table if not exists factories (
  id uuid primary key default gen_random_uuid(),
  factory_name text not null,
  country text not null default 'Bangladesh',
  tier_level text,
  factory_type text,
  contact_email text,
  created_at timestamptz default now(),
  unique(factory_name, country)
);

create table if not exists assessments (
  id uuid primary key default gen_random_uuid(),
  local_report_id text unique,
  factory_id uuid references factories(id),
  session_data jsonb,
  compliance_score integer,
  score_breakdown jsonb,
  language_used text default 'en',
  created_at timestamptz default now()
);

create table if not exists ai_reports (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid references assessments(id),
  ai_provider text default 'gemini-1.5-flash',
  report_content text,
  improvement_tips jsonb,
  generated_at timestamptz default now()
);

alter table factories enable row level security;
alter table assessments enable row level security;
alter table ai_reports enable row level security;

create policy "Public read" on factories for select using (true);
create policy "Public insert" on factories for insert with check (true);
create policy "Public read" on assessments for select using (true);
create policy "Public insert" on assessments for insert with check (true);
create policy "Public read" on ai_reports for select using (true);
create policy "Public insert" on ai_reports for insert with check (true);