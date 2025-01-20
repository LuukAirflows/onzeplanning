/*
  # Fix User Policies Final

  1. Changes
    - Drop existing policies
    - Create new policies using JWT claims instead of table lookups
    - Fix infinite recursion issue
  
  2. Security
    - Enable RLS on users table
    - Allow public read access
    - Allow users to update their own data
    - Allow admins full access based on JWT claim
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access" ON users;
DROP POLICY IF EXISTS "Allow self update" ON users;
DROP POLICY IF EXISTS "Allow admin full access" ON users;

-- Create new policies using JWT claims
CREATE POLICY "Public read access"
  ON users
  FOR SELECT
  USING (true);

CREATE POLICY "Self update"
  ON users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin full access"
  ON users
  FOR ALL
  USING (auth.jwt() ->> 'email' = 'admin@hotnetworkz.nl');

-- Ensure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;