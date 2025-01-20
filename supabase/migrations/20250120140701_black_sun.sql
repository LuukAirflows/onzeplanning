/*
  # Fix Schedule Requirements RLS Policies

  1. Changes
    - Drop existing schedule requirements policies
    - Create new simplified policies that properly handle admin access
    - Add explicit policies for each operation (SELECT, INSERT, UPDATE, DELETE)
    
  2. Security
    - Maintains read access for all authenticated users
    - Ensures only admins can modify data
    - Simplifies policy structure to prevent conflicts
*/

-- Drop existing schedule requirements policies
DROP POLICY IF EXISTS "Public read access for schedule requirements" ON schedule_requirements;
DROP POLICY IF EXISTS "Admin insert schedule requirements" ON schedule_requirements;
DROP POLICY IF EXISTS "Admin update schedule requirements" ON schedule_requirements;
DROP POLICY IF EXISTS "Admin delete schedule requirements" ON schedule_requirements;

-- Create new simplified policies
CREATE POLICY "Anyone can view schedule requirements"
  ON schedule_requirements
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can modify schedule requirements"
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
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Verify RLS is enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE tablename = 'schedule_requirements'
    AND rowsecurity = true
  ) THEN
    ALTER TABLE schedule_requirements ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;