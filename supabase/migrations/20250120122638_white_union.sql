/*
  # Update test users

  1. Changes
    - Insert test users with dynamic UUIDs using gen_random_uuid()
    - Add ON CONFLICT clause to handle duplicates gracefully

  2. Security
    - No changes to security policies
*/

-- Insert into public.users with dynamic UUIDs
INSERT INTO public.users (id, email, role, first_name, last_name, phone)
VALUES 
  (gen_random_uuid(), 'admin@hotnetworkz.nl', 'admin', 'Admin', 'User', '+1234567890'),
  (gen_random_uuid(), 'medewerker@hotnetworkz.nl', 'employee', 'Test', 'Employee', '+1234567891')
ON CONFLICT (email) 
DO UPDATE SET
  role = EXCLUDED.role,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  phone = EXCLUDED.phone;