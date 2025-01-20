/*
  # Fix employee skills RLS policies

  1. Changes
    - Drop existing policies
    - Create new simplified policies for employee_skills table
    - Fix admin role check
    - Add proper error handling
  
  2. Security
    - Enable RLS
    - Allow public read access
    - Allow admins full management access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view employee skills" ON employee_skills;
DROP POLICY IF EXISTS "Admin can manage employee skills" ON employee_skills;

-- Create new simplified policies
CREATE POLICY "Anyone can view employee skills"
  ON employee_skills
  FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage employee skills"
  ON employee_skills
  FOR ALL
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Ensure RLS is enabled
ALTER TABLE employee_skills ENABLE ROW LEVEL SECURITY;

-- Verify admin role and permissions
DO $$
BEGIN
  -- Ensure admin user exists and has correct role
  IF NOT EXISTS (
    SELECT 1 
    FROM users 
    WHERE email = 'admin@hotnetworkz.nl' 
    AND role = 'admin'
  ) THEN
    UPDATE users 
    SET role = 'admin' 
    WHERE email = 'admin@hotnetworkz.nl';
  END IF;

  -- Verify RLS is working
  IF NOT EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE tablename = 'employee_skills'
    AND rowsecurity = true
  ) THEN
    RAISE EXCEPTION 'RLS is not enabled on employee_skills table';
  END IF;
END $$;