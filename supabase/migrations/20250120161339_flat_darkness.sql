-- Drop existing policies
DROP POLICY IF EXISTS "View employee skills" ON employee_skills;
DROP POLICY IF EXISTS "Admin manage employee skills" ON employee_skills;

-- Create new policies
CREATE POLICY "Anyone can view employee skills"
  ON employee_skills
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage employee skills"
  ON employee_skills
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
ALTER TABLE employee_skills ENABLE ROW LEVEL SECURITY;