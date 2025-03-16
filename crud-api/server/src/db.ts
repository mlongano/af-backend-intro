import { Request, Response, Express } from "express";
import { Pool } from "pg";
import { throwError } from "./lib/errors";

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

export const initialiseDb = async (app: Express): Promise<void> => {
  try {
    const client = await pool.connect();
    if (!client) {
      console.error('Could not connect to the database');
      throw new Error('Could not connect to the database');
    }
    await pool.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        task TEXT NOT NULL,
        completed BOOLEAN DEFAULT false
      )
    `);
    console.log('Ensured that the "todos" table exists.');
  } catch (error) {
    throwError(error, 'Error initialising the database');
  }
};
