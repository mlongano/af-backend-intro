import express, { Request, Response } from 'express';
import { Pool } from 'pg';

import dotenv from 'dotenv'; dotenv.config();
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST || 'postgres', // Use service name defined in docker-compose, defaults to 'postgres'
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432,
});

// Function to test connection, create table, and insert sample data if needed
async function initializeDatabase() {
  try {
    // Test connection by acquiring a client from the pool
    const client = await pool.connect();
    console.log('Connected to the database successfully!');
    client.release();

    // Create table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL
      );
    `);
    console.log('Ensured that the "items" table exists.');

    // Check if table is empty and insert some default data
    const result = await pool.query('SELECT COUNT(*) FROM items;');
    if (parseInt(result.rows[0].count, 10) === 0) {
      await pool.query(`
        INSERT INTO items (name) VALUES
        ('Item One'),
        ('Item Two');
      `);
      console.log('Inserted sample data into "items" table.');
    } else {
      console.log('Data already exists in "items" table.');
    }
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}

// Create an Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Basic endpoint to test server is running
app.get('/', (req: Request, res: Response) => {
  res.send('Hello world! The API is up and running.');
});

// Endpoint to fetch all items from the database
app.get('/items', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM items;');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server after initializing the database  
const PORT = process.env.PORT || 3000;
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
