-- SQL Script to fix RLS for wg_enquiries table
-- Run this in your Supabase SQL Editor

-- 1. Enable RLS on the enquiries table (if not already enabled)
ALTER TABLE public.wg_enquiries ENABLE ROW LEVEL SECURITY;

-- 2. Allow anonymous users to INSERT enquiries (Contact Form)
DROP POLICY IF EXISTS "Allow public insert access" ON public.wg_enquiries;
CREATE POLICY "Allow public insert access" ON public.wg_enquiries
    FOR INSERT 
    WITH CHECK (true);

-- 3. Allow authenticated users (admins) to SELECT/UPDATE/DELETE enquiries
DROP POLICY IF EXISTS "Allow admin all access" ON public.wg_enquiries;
CREATE POLICY "Allow admin all access" ON public.wg_enquiries
    FOR ALL 
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');
