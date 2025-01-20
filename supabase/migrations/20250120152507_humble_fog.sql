-- Create auth schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS auth;

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies on users table
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Admins can manage all users" ON users;

-- Create new policies for users table
CREATE POLICY "Public read access for users"
  ON users
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can manage all users"
  ON users
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Insert or update test users
INSERT INTO users (email, role, first_name, last_name, phone)
VALUES 
  ('admin@hotnetworkz.nl', 'admin', 'Admin', 'User', '+31612345678'),
  ('medewerker@hotnetworkz.nl', 'employee', 'Test', 'Employee', '+31623456789')
ON CONFLICT (email) 
DO UPDATE SET
  role = EXCLUDED.role,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  phone = EXCLUDED.phone;