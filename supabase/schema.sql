-- Database Schema for HamzaTech Aura X1 eCommerce Platform

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =========================================================================
-- TABLES DECLARATION
-- =========================================================================

-- 1. Profiles Table (Extends Supabase Auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Products Table
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null,
  short_description text,
  price numeric(12,2) not null check (price >= 0),
  compare_price numeric(12,2) check (compare_price >= 0),
  stock integer not null default 0 check (stock >= 0),
  sku text not null unique,
  category text not null,
  images text[] not null default '{}',
  specifications jsonb not null default '{}'::jsonb,
  features text[] not null default '{}',
  rating numeric(3,2) not null default 5.00 check (rating >= 1.00 and rating <= 5.00),
  review_count integer not null default 0 check (review_count >= 0),
  status text not null default 'draft' check (status in ('draft', 'published', 'out_of_stock')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Addresses Table
create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  street text not null,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null,
  is_default boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Orders Table
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  profile_id uuid references public.profiles(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid', 'paid', 'refunded')),
  shipping_status text not null default 'pending' check (shipping_status in ('pending', 'shipped', 'delivered')),
  subtotal numeric(12,2) not null check (subtotal >= 0),
  shipping_fee numeric(12,2) not null default 0.00 check (shipping_fee >= 0),
  discount numeric(12,2) not null default 0.00 check (discount >= 0),
  tax numeric(12,2) not null default 0.00 check (tax >= 0),
  grand_total numeric(12,2) not null check (grand_total >= 0),
  shipping_address_id uuid references public.addresses(id) on delete set null,
  order_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Order Items Table
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  quantity integer not null default 1 check (quantity > 0),
  price numeric(12,2) not null check (price >= 0),
  variant text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Reviews Table
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade not null,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  review text not null,
  verified_purchase boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (product_id, profile_id)
);

-- 7. Wishlist Table
create table public.wishlists (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (profile_id, product_id)
);

-- 8. Coupons Table
create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_percent integer not null check (discount_percent > 0 and discount_percent <= 100),
  active boolean not null default true,
  expires_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Settings Table
create table public.settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. Newsletter Subscribers Table
create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  active boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =========================================================================
-- AUTOMATION TRIGGER FOR USER SIGNUPS
-- =========================================================================

-- Trigger to automatically create a public.profile profile row when a new user signs up inside auth.users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, phone, role)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'phone',
    'customer'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =========================================================================
-- SECURITY CHECKS
-- =========================================================================

-- Admin checker helper function
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.wishlists enable row level security;
alter table public.coupons enable row level security;
alter table public.settings enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- Profiles Policies
create policy "Allow public read-access for profiles" on public.profiles for select using (true);
create policy "Allow owners update access for profiles" on public.profiles for update using (auth.uid() = id or public.is_admin());

-- Products Policies
create policy "Allow public read-access for products" on public.products for select using (true);
create policy "Allow admins full access for products" on public.products for all using (public.is_admin());

-- Addresses Policies
create policy "Allow users to view own addresses" on public.addresses for select using (auth.uid() = profile_id or public.is_admin());
create policy "Allow users to manage own addresses" on public.addresses for all using (auth.uid() = profile_id or public.is_admin());

-- Orders Policies
create policy "Allow users to view own orders" on public.orders for select using (auth.uid() = profile_id or public.is_admin());
create policy "Allow users to create own orders" on public.orders for insert with check (auth.uid() = profile_id or public.is_admin());
create policy "Allow admins update access for orders" on public.orders for update using (public.is_admin());

-- Order Items Policies
create policy "Allow users to view own order items" on public.order_items for select using (
  exists (select 1 from public.orders where id = order_id and (profile_id = auth.uid() or public.is_admin()))
);
create policy "Allow users to insert order items" on public.order_items for insert with check (
  exists (select 1 from public.orders where id = order_id and (profile_id = auth.uid() or public.is_admin()))
);

-- Reviews Policies
create policy "Allow public read-access for reviews" on public.reviews for select using (true);
create policy "Allow users to write own reviews" on public.reviews for insert with check (auth.uid() = profile_id or public.is_admin());
create policy "Allow users to update own reviews" on public.reviews for update using (auth.uid() = profile_id or public.is_admin());
create policy "Allow users to delete own reviews" on public.reviews for delete using (auth.uid() = profile_id or public.is_admin());

-- Wishlist Policies
create policy "Allow users to manage own wishlist" on public.wishlists for all using (auth.uid() = profile_id or public.is_admin());

-- Coupons Policies
create policy "Allow authenticates select-access for coupons" on public.coupons for select using (auth.role() = 'authenticated' or public.is_admin());
create policy "Allow admins full access for coupons" on public.coupons for all using (public.is_admin());

-- Settings Policies
create policy "Allow public read-access for settings" on public.settings for select using (true);
create policy "Allow admins full access for settings" on public.settings for all using (public.is_admin());

-- Newsletter Subscribers Policies
create policy "Allow guest signups for newsletter" on public.newsletter_subscribers for insert with check (true);
create policy "Allow admins view newsletter list" on public.newsletter_subscribers for all using (public.is_admin());

-- =========================================================================
-- STORAGE BUCKETS CONFIGURATION (MOCK / AUTOMATED REGISTRATION)
-- =========================================================================

-- Storage registration
insert into storage.buckets (id, name, public)
values
  ('products', 'products', true),
  ('avatars', 'avatars', true),
  ('reviews', 'reviews', true),
  ('assets', 'assets', true)
on conflict (id) do nothing;

-- Storage policies (Public access to read files)
create policy "Public Access to Read Product Images" on storage.objects for select using (bucket_id = 'products');
create policy "Public Access to Read Avatar Images" on storage.objects for select using (bucket_id = 'avatars');
create policy "Public Access to Read Review Images" on storage.objects for select using (bucket_id = 'reviews');
create policy "Public Access to Read Asset Files" on storage.objects for select using (bucket_id = 'assets');

-- Owner access to upload files
create policy "Authenticated User Avatar Upload" on storage.objects for insert with check (
  bucket_id = 'avatars' and auth.role() = 'authenticated'
);
create policy "Admin Product Upload" on storage.objects for all using (
  public.is_admin()
);
