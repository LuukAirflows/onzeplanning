/*
  # Fix employee skills RLS policies

  1. Changes
    - Drop existing policies
    - Create new comprehensive policies for employee_skills table
    - Use proper admin role check
  
  2. Security
    - Enable RLS
    - Allow public read access
    - Allow admins full management access using role check
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Public read access for employee_skills" ON employee_skills;
DROP POLICY IF EXISTS "Admin full access for employee_skills" ON employee_skills;

-- Create new policies
CREATE POLICY "Public read access for employee_skills"
  ON employee_skills
  FOR SELECT
  USING (true);

CREATE POLICY "Admin full access for employee_skills"
  ON employee_skills
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 
      FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Ensure RLS is enabled
ALTER TABLE employee_skills ENABLE ROW LEVEL SECURITY;

-- Verify admin role exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM users 
    WHERE role = 'admin'
  ) THEN
    INSERT INTO users (email, role, first_name, last_name)
    VALUES ('admin@hotnetworkz.nl', 'admin', 'Admin', 'User')
    ON CONFLICT (email) 
    DO UPDATE SET role = 'admin';
  END IF;
END $$;