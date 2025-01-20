-- Drop existing schedule requirements policies
DROP POLICY IF EXISTS "Anyone can view schedule requirements" ON schedule_requirements;
DROP POLICY IF EXISTS "Admins can manage schedule requirements" ON schedule_requirements;

-- Create comprehensive policies for schedule requirements
CREATE POLICY "Public read access for schedule requirements"
  ON schedule_requirements
  FOR SELECT
  USING (true);

CREATE POLICY "Admin insert schedule requirements"
  ON schedule_requirements
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admin update schedule requirements"
  ON schedule_requirements
  FOR UPDATE
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

CREATE POLICY "Admin delete schedule requirements"
  ON schedule_requirements
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 
      FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Ensure RLS is enabled and working
DO $$
BEGIN
  -- Verify RLS is enabled
  IF NOT EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE tablename = 'schedule_requirements'
    AND rowsecurity = true
  ) THEN
    ALTER TABLE schedule_requirements ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;