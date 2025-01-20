/*
  # Add user relation to schedule requirements

  1. Changes
    - Add foreign key constraint for user_id in schedule_requirements table
    - Update existing policies to handle the new relation

  2. Security
    - Maintain existing RLS policies
    - Ensure proper access control for user assignments
*/

-- Add foreign key constraint
ALTER TABLE schedule_requirements
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES users(id);

-- Update policies to handle user assignments
DROP POLICY IF EXISTS "Anyone can view schedule requirements" ON schedule_requirements;
DROP POLICY IF EXISTS "Only admins can modify schedule requirements" ON schedule_requirements;

-- Create new policies
CREATE POLICY "Anyone can view schedule requirements"
  ON schedule_requirements
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage schedule requirements"
  ON schedule_requirements
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 
      FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can assign themselves to available shifts"
  ON schedule_requirements
  FOR UPDATE
  USING (
    (user_id IS NULL OR user_id = auth.uid())
    AND EXISTS (
      SELECT 1 
      FROM employee_skills 
      WHERE employee_skills.user_id = auth.uid() 
      AND employee_skills.skill_id = schedule_requirements.skill_id
    )
  )
  WITH CHECK (
    (user_id IS NULL OR user_id = auth.uid())
    AND EXISTS (
      SELECT 1 
      FROM employee_skills 
      WHERE employee_skills.user_id = auth.uid() 
      AND employee_skills.skill_id = schedule_requirements.skill_id
    )
  );