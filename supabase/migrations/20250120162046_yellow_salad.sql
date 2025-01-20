/*
  # Complete RLS setup for all functionality
  
  This migration:
  1. Drops existing policies
  2. Sets up proper RLS for all tables
  3. Ensures admin exists
  4. Grants necessary permissions
*/

-- Drop ALL existing policies
DROP POLICY IF EXISTS "Anyone can view employee skills" ON employee_skills;
DROP POLICY IF EXISTS "Admin can manage employee skills" ON employee_skills;
DROP POLICY IF EXISTS "Admin can manage all employee skills" ON employee_skills;
DROP POLICY IF EXISTS "Employees can manage own skills" ON employee_skills;
DROP POLICY IF EXISTS "Users can view their skills" ON employee_skills;
DROP POLICY IF EXISTS "Admins can manage employee skills" ON employee_skills;
DROP POLICY IF EXISTS "View employee skills" ON employee_skills;
DROP POLICY IF EXISTS "Admin manage employee skills" ON employee_skills;
DROP POLICY IF EXISTS "Admin can insert employee skills" ON employee_skills;
DROP POLICY IF EXISTS "Admin can update employee skills" ON employee_skills;
DROP POLICY IF EXISTS "Admin can delete employee skills" ON employee_skills;
DROP POLICY IF EXISTS "Public read access for users" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Admins can manage all users" ON users;
DROP POLICY IF EXISTS "Users can read all users" ON users;
DROP POLICY IF EXISTS "Enable read access to all users" ON users;
DROP POLICY IF EXISTS "Allow initial user creation" ON users;
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can manage their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Anyone can view schedule requirements" ON schedule_requirements;
DROP POLICY IF EXISTS "Admins can manage schedule requirements" ON schedule_requirements;

-- Disable RLS first to ensure clean slate
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE employee_skills DISABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_requirements DISABLE ROW LEVEL SECURITY;

-- Then enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_requirements ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON employee_skills TO authenticated;
GRANT ALL ON users TO authenticated;
GRANT ALL ON schedule_requirements TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON users TO anon;
GRANT INSERT ON users TO anon;

-- Ensure admin user exists with correct role
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM users 
    WHERE email = 'admin@hotnetworkz.nl'
  ) THEN
    INSERT INTO users (email, role, first_name, last_name)
    VALUES ('admin@hotnetworkz.nl', 'admin', 'Admin', 'User');
  ELSE
    UPDATE users 
    SET role = 'admin'
    WHERE email = 'admin@hotnetworkz.nl';
  END IF;
END $$;

-- Create policies for users table
CREATE POLICY "Public read access for users"
  ON users
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow initial user creation"
  ON users
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can manage all users"
  ON users
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Create employee skills policies
CREATE POLICY "Anyone can view employee skills"
  ON employee_skills
  FOR SELECT
  USING (true);

CREATE POLICY "Admin can insert employee skills"
  ON employee_skills
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM users u 
      WHERE u.id = auth.uid() 
      AND u.role = 'admin'
    )
  );

CREATE POLICY "Admin can update employee skills"
  ON employee_skills
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 
      FROM users u 
      WHERE u.id = auth.uid() 
      AND u.role = 'admin'
    )
  );

CREATE POLICY "Admin can delete employee skills"
  ON employee_skills
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 
      FROM users u 
      WHERE u.id = auth.uid() 
      AND u.role = 'admin'
    )
  );

CREATE POLICY "Employees can manage own skills"
  ON employee_skills
  FOR ALL
  USING (
    user_id = auth.uid()
  );

-- Create schedule requirements policies
CREATE POLICY "Anyone can view schedule requirements"
  ON schedule_requirements
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage schedule requirements"
  ON schedule_requirements
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM users u 
      WHERE u.id = auth.uid() 
      AND u.role = 'admin'
    )
  );

-- Verify setup
DO $$
BEGIN
  -- Verify admin exists
  IF NOT EXISTS (
    SELECT 1 
    FROM users 
    WHERE email = 'admin@hotnetworkz.nl' 
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Admin user not found or not configured correctly';
  END IF;

  -- Verify RLS is enabled
  IF NOT EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE tablename IN ('employee_skills', 'users', 'schedule_requirements')
    AND rowsecurity = true
  ) THEN
    RAISE EXCEPTION 'RLS is not enabled on required tables';
  END IF;
END $$;