/*
  # Fix all RLS policies

  1. Changes
    - Drop and recreate all policies for better security
    - Ensure proper access for admins and employees
    - Fix schedule requirements policies
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Everyone can view skills" ON skills;
DROP POLICY IF EXISTS "Admins can manage skills" ON skills;
DROP POLICY IF EXISTS "Users can view their skills" ON employee_skills;
DROP POLICY IF EXISTS "Admins can manage employee skills" ON employee_skills;
DROP POLICY IF EXISTS "Admins can manage schedule requirements" ON schedule_requirements;
DROP POLICY IF EXISTS "Everyone can view schedule requirements" ON schedule_requirements;

-- Skills policies
CREATE POLICY "Public read access for skills"
  ON skills
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin manage skills"
  ON skills
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Employee skills policies
CREATE POLICY "View employee skills"
  ON employee_skills
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin manage employee skills"
  ON employee_skills
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Schedule requirements policies
CREATE POLICY "View schedule requirements"
  ON schedule_requirements
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin insert schedule requirements"
  ON schedule_requirements
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admin update schedule requirements"
  ON schedule_requirements
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admin delete schedule requirements"
  ON schedule_requirements
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );