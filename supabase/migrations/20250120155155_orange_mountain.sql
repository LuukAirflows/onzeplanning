/*
  # Fix RLS policies for skills table

  1. Changes
    - Drop existing policies on skills table
    - Create new policies for viewing and managing skills
    - Ensure proper access control for admins and users

  2. Security
    - Enable RLS on skills table
    - Allow public read access for all authenticated users
    - Allow admin users to manage skills
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Public read access for skills" ON skills;
DROP POLICY IF EXISTS "Admin manage skills" ON skills;

-- Create new policies
CREATE POLICY "Anyone can view skills"
  ON skills
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage skills"
  ON skills
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
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;