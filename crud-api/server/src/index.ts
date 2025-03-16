import express, { Request, Response } from "express";

import dotenv from "dotenv";
dotenv.config();

// Create an Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Basic endpoint to test server is running
app.get('/', (req: Request, res: Response) => {
  res.send('Hello world! The API is up and running.');
});

// Start the server after initializing the database  
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
