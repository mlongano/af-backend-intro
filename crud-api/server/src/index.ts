import express, { Request, Response } from "express";

import dotenv from "dotenv";
import { initialiseDb } from "./db";
import { throwError } from "./lib/errors";
import routes from "./routes";
dotenv.config();

// Create an Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Basic endpoint to test server is running
app.get("/", (req: Request, res: Response) => {
  res.send("Hello world! The API is up and running.");
});

// Import routes from routes.ts
routes(app);

// Start the server after initializing the database
const PORT = process.env.PORT || 3000;

// Wrap database initialization in an async function
async function startServer() {
  try {
    await initialiseDb(app);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    throwError(error, "Error starting the server");
  }
}

// Call the async function
startServer();
