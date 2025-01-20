/*
  # Disable all RLS to restore basic functionality
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
DROP POLICY IF EXISTS "Public read access for users" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Admins can manage all users" ON users;
DROP POLICY IF EXISTS "Users can read all users" ON users;
DROP POLICY IF EXISTS "Enable read access to all users" ON users;
DROP POLICY IF EXISTS "Allow initial user creation" ON users;
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can manage their own data" ON users;
DROP POLICY IF EXISTS "Anyone can view schedule requirements" ON schedule_requirements;
DROP POLICY IF EXISTS "Admins can manage schedule requirements" ON schedule_requirements;

-- Disable RLS on all tables
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE employee_skills DISABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_requirements DISABLE ROW LEVEL SECURITY;

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