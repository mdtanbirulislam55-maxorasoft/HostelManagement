-- PostgreSQL schema for the HostelFlow application.
-- Run this script against your PostgreSQL database to create all necessary tables.

-- Enum types
CREATE TYPE IF NOT EXISTS room_status AS ENUM ('occupied', 'vacant', 'maintenance');
CREATE TYPE IF NOT EXISTS payment_status AS ENUM ('paid', 'pending', 'overdue');
CREATE TYPE IF NOT EXISTS activity_type AS ENUM ('student_added', 'payment_received', 'room_assigned', 'maintenance_scheduled', 'alert_created');

-- Session storage table (used by express-session if configured)
CREATE TABLE IF NOT EXISTS sessions (
  sid varchar PRIMARY KEY,
  sess jsonb NOT NULL,
  expire timestamp NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_session_expire ON sessions (expire);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar UNIQUE,
  first_name varchar,
  last_name varchar,
  profile_image_url varchar,
  role varchar DEFAULT 'admin',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Floors table
CREATE TABLE IF NOT EXISTS floors (
  id integer PRIMARY KEY,
  name varchar(50) NOT NULL,
  total_rooms integer NOT NULL DEFAULT 20,
  created_at timestamp DEFAULT now()
);

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  number varchar(10) NOT NULL UNIQUE,
  floor_id integer NOT NULL REFERENCES floors(id),
  capacity integer NOT NULL DEFAULT 2,
  current_occupancy integer NOT NULL DEFAULT 0,
  status room_status NOT NULL DEFAULT 'vacant',
  monthly_rent decimal(10,2) NOT NULL,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id varchar(20) NOT NULL UNIQUE,
  name varchar(100) NOT NULL,
  email varchar(100),
  phone varchar(20),
  room_id varchar REFERENCES rooms(id),
  admission_date timestamp DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true,
  emergency_contact varchar(20),
  address text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id varchar NOT NULL REFERENCES students(id),
  amount decimal(10,2) NOT NULL,
  due_date timestamp NOT NULL,
  paid_date timestamp,
  status payment_status NOT NULL DEFAULT 'pending',
  month varchar(7) NOT NULL,
  description text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  title varchar(200) NOT NULL,
  description text,
  amount decimal(10,2) NOT NULL,
  category varchar(50) NOT NULL,
  date timestamp NOT NULL,
  created_by varchar NOT NULL REFERENCES users(id),
  created_at timestamp DEFAULT now()
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  type activity_type NOT NULL,
  title varchar(200) NOT NULL,
  description text,
  user_id varchar NOT NULL REFERENCES users(id),
  entity_id varchar,
  metadata jsonb,
  created_at timestamp DEFAULT now()
);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  type varchar(50) NOT NULL,
  title varchar(200) NOT NULL,
  description text,
  severity varchar(20) NOT NULL DEFAULT 'medium',
  is_read boolean NOT NULL DEFAULT false,
  entity_id varchar,
  created_at timestamp DEFAULT now()
);
