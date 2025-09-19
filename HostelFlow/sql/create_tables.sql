-- SQL schema for the Hostel Management System
--
-- This script creates all of the necessary database objects (types
-- and tables) for running the hostel management system locally on
-- PostgreSQL.  You can execute this file using the `psql` command:
--
--   psql -U postgres -d hostel_db -f sql/create_tables.sql
--
-- Make sure to adjust the database name and connection parameters
-- accordingly.

-- Enable the pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enumerated types
CREATE TYPE room_status AS ENUM ('occupied', 'vacant', 'maintenance');
CREATE TYPE payment_status AS ENUM ('paid', 'pending', 'overdue');
CREATE TYPE activity_type AS ENUM ('student_added', 'payment_received', 'room_assigned', 'maintenance_scheduled', 'alert_created');

-- Sessions table (used for session storage if you choose to enable
-- session middleware).  This table is not used by the simplified
-- local authentication provided in this repository but is provided
-- here for completeness.
CREATE TABLE IF NOT EXISTS sessions (
  sid            VARCHAR PRIMARY KEY,
  sess           JSONB NOT NULL,
  expire         TIMESTAMP NOT NULL
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email            VARCHAR UNIQUE,
  first_name       VARCHAR,
  last_name        VARCHAR,
  profile_image_url VARCHAR,
  role             VARCHAR DEFAULT 'admin',
  created_at       TIMESTAMP DEFAULT NOW(),
  updated_at       TIMESTAMP DEFAULT NOW()
);

-- Floors table
CREATE TABLE IF NOT EXISTS floors (
  id            INTEGER PRIMARY KEY,
  name          VARCHAR(50) NOT NULL,
  total_rooms   INTEGER NOT NULL DEFAULT 20,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number           VARCHAR(10) NOT NULL UNIQUE,
  floor_id         INTEGER NOT NULL REFERENCES floors(id),
  capacity         INTEGER NOT NULL DEFAULT 2,
  current_occupancy INTEGER NOT NULL DEFAULT 0,
  status           room_status NOT NULL DEFAULT 'vacant',
  monthly_rent     NUMERIC(10,2) NOT NULL,
  created_at       TIMESTAMP DEFAULT NOW(),
  updated_at       TIMESTAMP DEFAULT NOW()
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id       VARCHAR(20) NOT NULL UNIQUE,
  name             VARCHAR(100) NOT NULL,
  email            VARCHAR(100),
  phone            VARCHAR(20),
  room_id          UUID REFERENCES rooms(id),
  admission_date   TIMESTAMP DEFAULT NOW(),
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  emergency_contact VARCHAR(20),
  address          TEXT,
  created_at       TIMESTAMP DEFAULT NOW(),
  updated_at       TIMESTAMP DEFAULT NOW()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id       UUID NOT NULL REFERENCES students(id),
  amount           NUMERIC(10,2) NOT NULL,
  due_date         TIMESTAMP NOT NULL,
  paid_date        TIMESTAMP,
  status           payment_status NOT NULL DEFAULT 'pending',
  month            VARCHAR(7) NOT NULL,
  description      TEXT,
  created_at       TIMESTAMP DEFAULT NOW(),
  updated_at       TIMESTAMP DEFAULT NOW()
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title            VARCHAR(200) NOT NULL,
  description      TEXT,
  amount           NUMERIC(10,2) NOT NULL,
  category         VARCHAR(50) NOT NULL,
  date             TIMESTAMP NOT NULL,
  created_by       UUID NOT NULL REFERENCES users(id),
  created_at       TIMESTAMP DEFAULT NOW()
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type             activity_type NOT NULL,
  title            VARCHAR(200) NOT NULL,
  description      TEXT,
  user_id          UUID NOT NULL REFERENCES users(id),
  entity_id        VARCHAR,
  metadata         JSONB,
  created_at       TIMESTAMP DEFAULT NOW()
);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type             VARCHAR(50) NOT NULL,
  title            VARCHAR(200) NOT NULL,
  description      TEXT,
  severity         VARCHAR(20) NOT NULL DEFAULT 'medium',
  is_read          BOOLEAN NOT NULL DEFAULT FALSE,
  entity_id        VARCHAR,
  created_at       TIMESTAMP DEFAULT NOW()
);

-- Additional indices
CREATE INDEX IF NOT EXISTS idx_sessions_expire ON sessions (expire);