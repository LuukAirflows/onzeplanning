/*
  # Add employee skills and schedule requirements

  1. New Tables
    - `skills`
      - `id` (uuid, primary key)
      - `name` (text) - Naam van de vaardigheid/eigenschap
      - `description` (text) - Beschrijving van de vaardigheid
      - `created_at` (timestamp)

    - `employee_skills`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `skill_id` (uuid, foreign key to skills)
      - `created_at` (timestamp)

    - `schedule_requirements`
      - `id` (uuid, primary key)
      - `date` (date) - Datum waarvoor de requirement geldt
      - `skill_id` (uuid, foreign key to skills)
      - `quantity` (integer) - Aantal benodigde mensen met deze skill
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all new tables
    - Add policies for admins to manage all data
    - Add policies for employees to view their own skills
*/

-- Create skills table
CREATE TABLE skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create employee_skills table
CREATE TABLE employee_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  skill_id uuid REFERENCES skills(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, skill_id)
);

-- Create schedule_requirements table
CREATE TABLE schedule_requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  skill_id uuid REFERENCES skills(id) NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_requirements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Everyone can view skills"
  ON skills
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage skills"
  ON skills
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can view their skills"
  ON employee_skills
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can manage employee skills"
  ON employee_skills
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can manage schedule requirements"
  ON schedule_requirements
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Everyone can view schedule requirements"
  ON schedule_requirements
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert initial skills
INSERT INTO skills (name, description) VALUES
  ('Kok', 'Kan koken en heeft relevante horeca ervaring'),
  ('Rijbewijs', 'Heeft een geldig rijbewijs B'),
  ('EHBO', 'Heeft een geldig EHBO certificaat'),
  ('Barista', 'Ervaring met het maken van koffiespecialiteiten'),
  ('Leidinggevende', 'Kan een team aansturen');

-- Insert test users and assign skills
DO $$
DECLARE
  jan_id uuid;
  lisa_id uuid;
  peter_id uuid;
  kok_id uuid;
  rijbewijs_id uuid;
  ehbo_id uuid;
BEGIN
  -- Insert Jan and get his ID
  INSERT INTO users (email, role, first_name, last_name, phone)
  VALUES ('jan@hotnetworkz.nl', 'employee', 'Jan', 'Bakker', '+31612345678')
  ON CONFLICT (email) DO UPDATE 
  SET first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      phone = EXCLUDED.phone
  RETURNING id INTO jan_id;

  -- Insert Lisa and get her ID
  INSERT INTO users (email, role, first_name, last_name, phone)
  VALUES ('lisa@hotnetworkz.nl', 'employee', 'Lisa', 'Visser', '+31623456789')
  ON CONFLICT (email) DO UPDATE 
  SET first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      phone = EXCLUDED.phone
  RETURNING id INTO lisa_id;

  -- Insert Peter and get his ID
  INSERT INTO users (email, role, first_name, last_name, phone)
  VALUES ('peter@hotnetworkz.nl', 'employee', 'Peter', 'Smit', '+31634567890')
  ON CONFLICT (email) DO UPDATE 
  SET first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      phone = EXCLUDED.phone
  RETURNING id INTO peter_id;

  -- Get skill IDs
  SELECT id INTO kok_id FROM skills WHERE name = 'Kok' LIMIT 1;
  SELECT id INTO rijbewijs_id FROM skills WHERE name = 'Rijbewijs' LIMIT 1;
  SELECT id INTO ehbo_id FROM skills WHERE name = 'EHBO' LIMIT 1;

  -- Assign skills to Jan
  IF jan_id IS NOT NULL AND kok_id IS NOT NULL AND rijbewijs_id IS NOT NULL THEN
    INSERT INTO employee_skills (user_id, skill_id)
    VALUES 
      (jan_id, kok_id),
      (jan_id, rijbewijs_id)
    ON CONFLICT (user_id, skill_id) DO NOTHING;
  END IF;

  -- Assign skills to Lisa
  IF lisa_id IS NOT NULL AND ehbo_id IS NOT NULL AND rijbewijs_id IS NOT NULL THEN
    INSERT INTO employee_skills (user_id, skill_id)
    VALUES 
      (lisa_id, ehbo_id),
      (lisa_id, rijbewijs_id)
    ON CONFLICT (user_id, skill_id) DO NOTHING;
  END IF;

  -- Assign skills to Peter
  IF peter_id IS NOT NULL AND kok_id IS NOT NULL AND ehbo_id IS NOT NULL THEN
    INSERT INTO employee_skills (user_id, skill_id)
    VALUES 
      (peter_id, kok_id),
      (peter_id, ehbo_id)
    ON CONFLICT (user_id, skill_id) DO NOTHING;
  END IF;
END $$;