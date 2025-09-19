/**
 * Database connection for local development.
 *
 * This application uses Drizzle ORM with the node-postgres (pg) client to
 * connect to a PostgreSQL database.  In a local setup you should
 * configure the connection string via the `DATABASE_URL` environment
 * variable in your `.env` file.  The expected format is:
 *
 *   postgresql://username:password@localhost:5432/database_name
 *
 * On startup this module will throw an error if the `DATABASE_URL` is
 * missing so that you know to configure it before running the server.
 */

// Load environment variables from `.env` before creating the pool.  This
// ensures that `process.env.DATABASE_URL` is defined when the module
// evaluates.  When `dotenv` is not used the import has no effect.
import 'dotenv/config';
import pg from 'pg'; // Default import
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@shared/schema';

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set to connect to Postgres. Please add it in your .env file.",
  );
}

const { Pool } = pg; // Destructure the Pool from pg

// Create a connection pool using node-postgres.  The pool manages
// multiple database connections and automatically reuses them for
// concurrent queries.  See https://node-postgres.com/features/pooling
// for details.
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Initialise Drizzle ORM with the pool and our schema.  Drizzle will
// generate typed SQL queries at compile time based on the schema
// definitions in `shared/schema.ts`.
export const db = drizzle(pool, { schema });