/*
  # Fix schedule requirements policies

  1. Changes
    - Drop and recreate schedule requirements policies
    - Ensure proper access for admins
    - Fix INSERT/UPDATE/DELETE permissions
*/

-- Drop existing schedule requirements policies
DROP POLICY IF EXISTS "View schedule requirements" ON schedule_requirements;
DROP POLICY IF EXISTS "Admin insert schedule requirements" ON schedule_requirements;
DROP POLICY IF EXISTS "Admin update schedule requirements" ON schedule_requirements;
DROP POLICY IF EXISTS "Admin delete schedule requirements" ON schedule_requirements;

-- Create new schedule requirements policies
CREATE POLICY "Anyone can view schedule requirements"
  ON schedule_requirements
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage schedule requirements"
  ON schedule_requirements
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Ensure RLS is enabled
ALTER TABLE schedule_requirements ENABLE ROW LEVEL SECURITY;