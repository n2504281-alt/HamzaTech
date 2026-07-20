-- =========================================================================
-- FIX: Make order_items.product_id properly nullable
-- Run this in Supabase Dashboard → SQL Editor
-- =========================================================================

-- 1. Drop the NOT NULL constraint on product_id if it exists
ALTER TABLE public.order_items
  ALTER COLUMN product_id DROP NOT NULL;

-- 2. Ensure the FK is ON DELETE SET NULL (not RESTRICT/CASCADE that blocks null)
-- First drop the old constraint, then re-add with correct behavior
ALTER TABLE public.order_items
  DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;

ALTER TABLE public.order_items
  ADD CONSTRAINT order_items_product_id_fkey
  FOREIGN KEY (product_id)
  REFERENCES public.products(id)
  ON DELETE SET NULL;

-- 3. Make shipping_address_id on orders properly nullable (guest checkout support)
ALTER TABLE public.orders
  ALTER COLUMN shipping_address_id DROP NOT NULL;

-- 4. Verify the fix - run this SELECT to confirm nullable column
SELECT
  column_name,
  is_nullable,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'order_items'
  AND column_name = 'product_id';
-- Expected result: is_nullable = 'YES'
