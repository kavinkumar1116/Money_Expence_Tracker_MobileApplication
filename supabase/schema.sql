create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  contact_number text,
  created_at timestamptz default now()
);

create table if not exists public.months (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  month int not null check (month between 1 and 12),
  year int not null,
  created_at timestamptz default now(),
  unique (user_id, month, year)
);

create table if not exists public.bank_masters (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz default now(),
  updated_at timestamptz,
  unique (user_id, name)
);

create table if not exists public.month_banks (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  month_id text not null references public.months(id) on delete cascade,
  bank_master_id text not null references public.bank_masters(id) on delete restrict,
  bank_name text not null,
  main_balance numeric(14,2) not null default 0,
  created_at timestamptz default now(),
  unique (month_id, bank_master_id)
);

create table if not exists public.transactions (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  month_bank_id text not null references public.month_banks(id) on delete cascade,
  amount numeric(14,2) not null check (amount >= 0),
  notes text,
  category text,
  transaction_date date not null,
  created_at timestamptz default now(),
  updated_at timestamptz
);

create or replace view public.month_bank_summaries as
select
  mb.*,
  coalesce(sum(t.amount), 0) as total_transactions,
  mb.main_balance - coalesce(sum(t.amount), 0) as current_balance
from public.month_banks mb
left join public.transactions t on t.month_bank_id = mb.id
group by mb.id;

create or replace view public.month_summaries as
select
  m.*,
  count(distinct mb.id) as total_banks,
  coalesce(sum(t.amount), 0) as total_expenses
from public.months m
left join public.month_banks mb on mb.month_id = m.id
left join public.transactions t on t.month_bank_id = mb.id
group by m.id;

alter table public.profiles enable row level security;
alter table public.months enable row level security;
alter table public.bank_masters enable row level security;
alter table public.month_banks enable row level security;
alter table public.transactions enable row level security;

drop policy if exists "Profiles are owned by user" on public.profiles;
drop policy if exists "Months are owned by user" on public.months;
drop policy if exists "Bank masters are owned by user" on public.bank_masters;
drop policy if exists "Month banks are owned by user" on public.month_banks;
drop policy if exists "Transactions are owned by user" on public.transactions;

create policy "Profiles are owned by user" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "Months are owned by user" on public.months for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Bank masters are owned by user" on public.bank_masters for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Month banks are owned by user" on public.month_banks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Transactions are owned by user" on public.transactions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.months replica identity full;
alter table public.bank_masters replica identity full;
alter table public.month_banks replica identity full;
alter table public.transactions replica identity full;

do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'months') then
    alter publication supabase_realtime add table public.months;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'bank_masters') then
    alter publication supabase_realtime add table public.bank_masters;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'month_banks') then
    alter publication supabase_realtime add table public.month_banks;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'transactions') then
    alter publication supabase_realtime add table public.transactions;
  end if;
end $$;
