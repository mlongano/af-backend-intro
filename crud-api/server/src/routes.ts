import { Request, Response, Express } from "express";
import { pool } from "./db";

const routes = (app: Express) => {
  // Get all todos
  app.get("/todos", async (req: Request, res: Response) => {
    const result = await pool.query("SELECT * FROM todos");
    res.json(result.rows);
  });
};

export default routes;
