/*
  # Fix skills table RLS policies

  1. Changes
    - Drop existing policies
    - Create new simplified policies for skills table
    - Ensure proper admin access for managing skills

  2. Security
    - Enable RLS
    - Allow public read access
    - Allow admin full access based on email
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Public read access" ON skills;
DROP POLICY IF EXISTS "Admin full access" ON skills;

-- Create new policies
CREATE POLICY "Public read access"
  ON skills
  FOR SELECT
  USING (true);

CREATE POLICY "Admin full access"
  ON skills
  FOR ALL
  USING (auth.jwt() ->> 'email' = 'admin@hotnetworkz.nl')
  WITH CHECK (auth.jwt() ->> 'email' = 'admin@hotnetworkz.nl');

-- Ensure RLS is enabled
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;