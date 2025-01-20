/*
  # Fix User Policies

  1. Changes
    - Drop existing problematic policies
    - Create new simplified policies without recursion
    - Ensure basic CRUD operations work correctly
  
  2. Security
    - Enable RLS on users table
    - Allow public read access
    - Allow users to update their own data
    - Allow admins full access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Public read access for users" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Admins can manage all users" ON users;

-- Create new simplified policies
CREATE POLICY "Allow public read access"
  ON users
  FOR SELECT
  USING (true);

CREATE POLICY "Allow self update"
  ON users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow admin full access"
  ON users
  FOR ALL
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- Ensure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;