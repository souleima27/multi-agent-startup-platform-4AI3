create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  subject text not null,
  company text,
  message text not null
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique
);

create table if not exists public.pricing_selections (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  selected_by text,
  plan_name text not null,
  billing_cycle text not null check (billing_cycle in ('monthly', 'yearly')),
  plan_price numeric not null
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  role text not null,
  quote text not null,
  rating integer not null default 5 check (rating between 1 and 5),
  approved boolean not null default false
);

alter table public.contact_submissions enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.pricing_selections enable row level security;
alter table public.testimonials enable row level security;

create policy "public can insert contact submissions"
on public.contact_submissions
for insert
to anon, authenticated
with check (true);

create policy "public can insert newsletter subscribers"
on public.newsletter_subscribers
for insert
to anon, authenticated
with check (true);

create policy "public can insert pricing selections"
on public.pricing_selections
for insert
to anon, authenticated
with check (true);

create policy "public can insert testimonials"
on public.testimonials
for insert
to anon, authenticated
with check (true);

create policy "public can read approved testimonials"
on public.testimonials
for select
to anon, authenticated
using (approved = true);
