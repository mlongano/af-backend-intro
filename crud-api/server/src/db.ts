import { Pool } from "pg";

export type Todo = {
  id: number;
  task: string;
  completed: boolean;
};

export class TodoDatabase {
  private pool: Pool;
  private static instance: TodoDatabase;

  private constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT) || 5432,
    });
  }

  static getInstance(): TodoDatabase {
    if (!TodoDatabase.instance) {
      TodoDatabase.instance = new TodoDatabase();
    }
    return TodoDatabase.instance;
  }

  throwError(error: unknown, message: string): void {
    if (error instanceof Error) {
      console.error("Error:", error.message);
      throw new Error(`${message}: ${error.message}`);
      1;
    }
    console.error(message);
    throw new Error(message);
  }

  async query(
    text: string,
    params?: any[],
    errorMessage: string = "Database query failed",
  ): Promise<any> {
    try {
      const result = await this.pool.query(text, params);
      return result.rows;
    } catch (error) {
      this.throwError(error, errorMessage);
    }
  }

  async close() {
    await this.pool.end();
  }

  async initialiseDb() {
    try {
      const client = await this.pool.connect();
      client.release();
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS todos (
          id SERIAL PRIMARY KEY,
          task TEXT NOT NULL,
          completed BOOLEAN DEFAULT false
        )
      `);
      console.log('Ensured that the "todos" table exists.');
    } catch (error) {
      this.throwError(error, "Error initialising the database");
    }
  }

  async getTodos(): Promise<Todo[] | undefined> {
    try {
      const result = await this.pool.query("SELECT * FROM todos");
      return result.rows;
    } catch (error) {
      this.throwError(error, "Error getting todos");
    }
  }

  async getTodoById(id: number): Promise<Todo | undefined> {
    try {
      const result = await this.pool.query(
        "SELECT * FROM todos WHERE id = $1",
        [id],
      );
      return result.rows[0];
    } catch (error) {
      this.throwError(error, "Error getting todo");
    }
  }

  async getTodoByTask(task: string): Promise<Todo | undefined> {
    try {
      const result = await this.pool.query(
        "SELECT * FROM todos WHERE task = $1",
        [task],
      );
      return result.rows[0];
    } catch (error) {
      this.throwError(error, "Error getting todo");
    }
  }

  async getTodoByStatus(status: boolean): Promise<Todo[] | undefined> {
    try {
      const result = await this.pool.query(
        "SELECT * FROM todos WHERE completed = $1",
        [status],
      );
      return result.rows;
    } catch (error) {
      this.throwError(error, "Error getting todos");
    }
  }

  async createTodo(task: string): Promise<Todo | undefined> {
    try {
      const result = await this.pool.query(
        "INSERT INTO todos (task) VALUES ($1) RETURNING *",
        [task],
      );
      return result.rows[0];
    } catch (error) {
      this.throwError(error, "Error creating todo");
    }
  }

  async updateTodoStatus(
    id: number,
    completed: boolean,
  ): Promise<Todo | undefined> {
    try {
      const result = await this.pool.query(
        "UPDATE todos SET completed = $1 WHERE id = $2 RETURNING *",
        [completed, id],
      );
      return result.rows[0];
    } catch (error) {
      this.throwError(error, "Error updating todo");
    }
  }
  async toggleTodoStatus(id: number): Promise<Todo | undefined> {
    try {
      const result = await this.pool.query(
        "UPDATE todos SET completed = NOT completed WHERE id = $1 RETURNING *",
        [id],
      );
      return result.rows[0];
    } catch (error) {
      this.throwError(error, "Error toggling todo status");
    }
  }

  async updateTodoTask(id: number, task: string): Promise<Todo | undefined> {
    try {
      const result = await this.pool.query(
        "UPDATE todos SET task = $1 WHERE id = $2 RETURNING *",
        [task, id],
      );
      return result.rows[0];
    } catch (error) {
      this.throwError(error, "Error updating todo task");
    }
  }
  async updateTodo(
    id: number,
    task: string,
    completed: boolean,
  ): Promise<Todo | undefined> {
    try {
      const result = await this.pool.query(
        "UPDATE todos SET task = $1, completed = $2 WHERE id = $3 RETURNING *",
        [task, completed, id],
      );
      return result.rows[0];
    } catch (error) {
      this.throwError(error, "Error updating todo");
    }
  }

  async deleteTodo(id: number): Promise<Todo | undefined> {
    try {
      const result = await this.pool.query(
        "DELETE FROM todos WHERE id = $1 RETURNING *",
        [id],
      );
      return result.rows[0];
    } catch (error) {
      this.throwError(error, "Error deleting todo");
    }
  }

  async deleteAllTodos(): Promise<void> {
    try {
      await this.pool.query("DELETE FROM todos");
    } catch (error) {
      this.throwError(error, "Error deleting all todos");
    }
  }

  async deleteCompletedTodos(): Promise<void> {
    try {
      await this.pool.query("DELETE FROM todos WHERE completed = true");
    } catch (error) {
      this.throwError(error, "Error deleting completed todos");
    }
  }

  async deleteIncompleteTodos(): Promise<void> {
    try {
      await this.pool.query("DELETE FROM todos WHERE completed = false");
    } catch (error) {
      this.throwError(error, "Error deleting incomplete todos");
    }
  }

  async deleteTodoByTask(task: string): Promise<void> {
    try {
      await this.pool.query("DELETE FROM todos WHERE task = $1", [task]);
    } catch (error) {
      this.throwError(error, "Error deleting todo by task");
    }
  }
}

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

export const diagnostics = async () => {
  console.log(`User: ${process.env.DB_USER}`);
  console.log(`Host: ${process.env.DB_HOST}`);
  console.log(`Database: ${process.env.DB_NAME}`);
  console.log(`Password: ${process.env.DB_PASSWORD}`);
  console.log(`Port: ${process.env.DB_PORT}`);
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
  });
  const client = await pool.connect();
  client.release();
  const result = await pool.query("SELECT * FROM todos");
  console.log(result.rows);
};
