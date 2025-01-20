/*
  # Fix skills table RLS policies

  1. Changes
    - Drop existing policies
    - Create new simplified policies for skills table
    - Ensure proper admin access for managing skills

  2. Security
    - Enable RLS
    - Allow public read access
    - Restrict write operations to admin users
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view skills" ON skills;
DROP POLICY IF EXISTS "Admins can manage skills" ON skills;

-- Create new policies
CREATE POLICY "Public read access"
  ON skills
  FOR SELECT
  USING (true);

CREATE POLICY "Admin full access"
  ON skills
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
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;