/*
  # Fix employee_skills RLS policies

  1. Changes
    - Drop existing policies
    - Create new comprehensive policies for employee_skills table
    - Ensure proper admin access for managing employee skills
  
  2. Security
    - Enable RLS
    - Allow public read access
    - Allow admins full management access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view employee skills" ON employee_skills;
DROP POLICY IF EXISTS "Admins can manage employee skills" ON employee_skills;

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
  )
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