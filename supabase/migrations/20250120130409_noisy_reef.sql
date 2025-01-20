/*
  # Fix RLS policies for schedule requirements

  1. Changes
    - Drop existing policies for schedule_requirements
    - Create new, more permissive policies for admins
    - Ensure proper access control for viewing requirements
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage schedule requirements" ON schedule_requirements;
DROP POLICY IF EXISTS "Everyone can view schedule requirements" ON schedule_requirements;

-- Create new policies
CREATE POLICY "Admins can manage schedule requirements"
  ON schedule_requirements
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

CREATE POLICY "Everyone can view schedule requirements"
  ON schedule_requirements
  FOR SELECT
  USING (true);