-- Drop existing policies
DROP POLICY IF EXISTS "Public read access" ON skills;
DROP POLICY IF EXISTS "Admin full access" ON skills;

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
  );

-- Ensure RLS is enabled
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Verify admin role exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM users 
    WHERE role = 'admin'
  ) THEN
    INSERT INTO users (email, role, first_name, last_name)
    VALUES ('admin@hotnetworkz.nl', 'admin', 'Admin', 'User')
    ON CONFLICT (email) 
    DO UPDATE SET role = 'admin';
  END IF;
END $$;