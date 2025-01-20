/*
  # Create test users

  1. Changes
    - Insert test users for both admin and employee roles
    - Set up initial auth.users entries
    - Link auth.users with public.users table

  Note: The passwords will be 'password123' for all test users
*/

-- Insert into auth.users (this is handled by Supabase Auth)
-- We'll create these users through the application

-- Insert into public.users
INSERT INTO public.users (id, email, role, first_name, last_name, phone)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin@shiftsmart.ai', 'admin', 'Admin', 'User', '+1234567890'),
  ('00000000-0000-0000-0000-000000000002', 'employee@shiftsmart.ai', 'employee', 'Test', 'Employee', '+1234567891')
ON CONFLICT (email) DO NOTHING;