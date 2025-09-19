-- SQL schema for the Hostel Management System
--
-- This script creates all of the database objects required by the
-- application.  Run it once against your PostgreSQL instance before
-- starting the server.  You can execute it with psql, for example:
--
--   psql -U postgres -d hostel_db -f create_tables.sql
--
-- It defines several custom enum types and tables along with basic
-- constraints.  You may adjust table names, column types or add
-- additional indexes as needed.

-- Enable extensions used by the schema.  uuid-ossp and pgcrypto
-- provide functions to generate UUID values on the database side.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ------------------------------------------------------------------
-- Sessions table
--
-- If you decide to use a PostgreSQL backed session store (e.g.
-- connect-pg-simple) then the sessions table must exist.  Remove
-- this table if you do not use server side sessions.
CREATE TABLE IF NOT EXISTS sessions (
  sid     varchar PRIMARY KEY,
  sess    jsonb NOT NULL,
  expire  timestamp NOT NULL
);

-- ------------------------------------------------------------------
-- Users table
--
-- Stores application users.  The original project only defined a
-- single admin user created via authentication but this table can
-- hold additional users and roles if you choose to extend the app.
CREATE TABLE IF NOT EXISTS users (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email             varchar UNIQUE,
  first_name        varchar,
  last_name         varchar,
  profile_image_url varchar,
  role              varchar DEFAULT 'admin',
  created_at        timestamp DEFAULT now(),
  updated_at        timestamp DEFAULT now()
);

-- ------------------------------------------------------------------
-- Enum types
--
-- Enumerated values used by the rooms, payments and activity logs.
DO $$ BEGIN
  CREATE TYPE room_status AS ENUM ('occupied','vacant','maintenance');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('paid','pending','overdue');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE activity_type AS ENUM ('student_added','payment_received','room_assigned','maintenance_scheduled','alert_created');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ------------------------------------------------------------------
-- Floors table
--
-- Represents each storey of the hostel building.  The id is an
-- integer rather than a UUID because floor numbers are naturally
-- sequential.  Adjust `total_rooms` to reflect the number of rooms on
-- each floor.
CREATE TABLE IF NOT EXISTS floors (
  id           integer PRIMARY KEY,
  name         varchar(50) NOT NULL,
  total_rooms  integer NOT NULL DEFAULT 20,
  created_at   timestamp DEFAULT now()
);

-- ------------------------------------------------------------------
-- Rooms table
--
-- Each room belongs to a floor and contains a maximum number of
-- occupants defined by `capacity`.  The `current_occupancy` field is
-- maintained by application logic when students are added or removed.
CREATE TABLE IF NOT EXISTS rooms (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number            varchar(10) NOT NULL UNIQUE,
  floor_id          integer NOT NULL REFERENCES floors(id),
  capacity          integer NOT NULL DEFAULT 2,
  current_occupancy integer NOT NULL DEFAULT 0,
  status            room_status NOT NULL DEFAULT 'vacant',
  monthly_rent      numeric(10,2) NOT NULL,
  created_at        timestamp DEFAULT now(),
  updated_at        timestamp DEFAULT now()
);

-- ------------------------------------------------------------------
-- Students table
--
-- Stores information about each student living in the hostel.  The
-- `room_id` column references the rooms table but is optional to
-- allow for unassigned students.
CREATE TABLE IF NOT EXISTS students (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id       varchar(20) NOT NULL UNIQUE,
  name             varchar(100) NOT NULL,
  email            varchar(100),
  phone            varchar(20),
  room_id          uuid REFERENCES rooms(id),
  admission_date   timestamp DEFAULT now(),
  is_active        boolean NOT NULL DEFAULT true,
  emergency_contact varchar(20),
  address          text,
  created_at       timestamp DEFAULT now(),
  updated_at       timestamp DEFAULT now()
);

-- ------------------------------------------------------------------
-- Payments table
--
-- Tracks monthly payments for each student.  The `month` field uses
-- the YYYY-MM format so that revenue reports can be aggregated.
CREATE TABLE IF NOT EXISTS payments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  uuid NOT NULL REFERENCES students(id),
  amount      numeric(10,2) NOT NULL,
  due_date    timestamp NOT NULL,
  paid_date   timestamp,
  status      payment_status NOT NULL DEFAULT 'pending',
  month       varchar(7) NOT NULL,
  description text,
  created_at  timestamp DEFAULT now(),
  updated_at  timestamp DEFAULT now()
);

-- ------------------------------------------------------------------
-- Expenses table
--
-- Stores any expenditures incurred by the hostel.  Use the
-- `category` column to group expenses by type.
CREATE TABLE IF NOT EXISTS expenses (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       varchar(200) NOT NULL,
  description text,
  amount      numeric(10,2) NOT NULL,
  category    varchar(50) NOT NULL,
  date        timestamp NOT NULL,
  created_by  uuid NOT NULL REFERENCES users(id),
  created_at  timestamp DEFAULT now()
);

-- ------------------------------------------------------------------
-- Activity logs table
--
-- Records significant actions in the system.  Each log entry includes
-- the user who performed the action and optional metadata for
-- additional context.
CREATE TABLE IF NOT EXISTS activity_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type        activity_type NOT NULL,
  title       varchar(200) NOT NULL,
  description text,
  user_id     uuid NOT NULL REFERENCES users(id),
  entity_id   varchar,
  metadata    jsonb,
  created_at  timestamp DEFAULT now()
);

-- ------------------------------------------------------------------
-- Alerts table
--
-- Holds notifications such as overdue payments or maintenance
-- warnings.  The `severity` column can be used to prioritise alerts
-- (e.g. low, medium, high).
CREATE TABLE IF NOT EXISTS alerts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type        varchar(50) NOT NULL,
  title       varchar(200) NOT NULL,
  description text,
  severity    varchar(20) NOT NULL DEFAULT 'medium',
  is_read     boolean NOT NULL DEFAULT false,
  entity_id   varchar,
  created_at  timestamp DEFAULT now()
);