/*
  # Initial Schema for ShiftSmart AI

  1. Tables
    - users
      - id (uuid, primary key)
      - email (text, unique)
      - role (text)
      - first_name (text)
      - last_name (text)
      - phone (text)
      - created_at (timestamptz)
      
    - shifts
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - start_time (timestamptz)
      - end_time (timestamptz)
      - status (text)
      - created_at (timestamptz)
      
    - availability
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - day_of_week (integer)
      - start_time (time)
      - end_time (time)
      - created_at (timestamptz)
      
    - sick_leaves
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - date (date)
      - reason (text)
      - created_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'employee',
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now()
);

-- Create shifts table
CREATE TABLE shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'scheduled',
  created_at timestamptz DEFAULT now()
);

-- Create availability table
CREATE TABLE availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  day_of_week integer NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create sick_leaves table
CREATE TABLE sick_leaves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  date date NOT NULL,
  reason text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE sick_leaves ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR role = 'admin');

CREATE POLICY "Admins can manage all users"
  ON users
  FOR ALL
  TO authenticated
  USING (role = 'admin');

CREATE POLICY "Users can view their shifts"
  ON shifts
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can manage all shifts"
  ON shifts
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can manage their availability"
  ON availability
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can manage their sick leaves"
  ON sick_leaves
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));