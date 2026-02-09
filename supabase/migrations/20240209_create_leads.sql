-- Create a table for leads
create table leads (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  email text not null,
  role text not null,
  fleet_size text not null
);

-- Enable Row Level Security (RLS)
alter table leads enable row level security;

-- Create a policy that allows anyone to insert leads (public/anon access)
create policy "Enable insert for everyone" on leads
  for insert
  with check (true);

-- Create a policy that restricts reading leads to service_role only (optional, for security)
-- Regular users (anon) should not be able to read other leads
create policy "Enable read access for service_role only" on leads
  for select
  using (auth.role() = 'service_role');
