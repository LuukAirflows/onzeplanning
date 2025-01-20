/*
  # Fix Schedule Requirements Policies

  1. Changes
    - Drop existing policies
    - Create new simplified policies for schedule requirements
    - Fix admin access using email check instead of role
  
  2. Security
    - Enable RLS
    - Allow public read access
    - Allow admin full access based on email
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view schedule requirements" ON schedule_requirements;
DROP POLICY IF EXISTS "Only admins can modify schedule requirements" ON schedule_requirements;

-- Create new policies
CREATE POLICY "Public read access for schedule requirements"
  ON schedule_requirements
  FOR SELECT
  USING (true);

CREATE POLICY "Admin full access for schedule requirements"
  ON schedule_requirements
  FOR ALL
  USING (auth.jwt() ->> 'email' = 'admin@hotnetworkz.nl')
  WITH CHECK (auth.jwt() ->> 'email' = 'admin@hotnetworkz.nl');

-- Ensure RLS is enabled
ALTER TABLE schedule_requirements ENABLE ROW LEVEL SECURITY;