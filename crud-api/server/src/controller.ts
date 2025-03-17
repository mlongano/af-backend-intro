import {
  Express,
  NextFunction,
  Request,
  Response,
  RequestHandler,
} from "express";
import { TodoDatabase } from "./db";

const db = TodoDatabase.getInstance();

export class TodoActionController {
  constructor(
    private app: Express,
    private db: TodoDatabase,
  ) {}

  getTodos = async (
    _req: Request,
    res: Response,
    _next: NextFunction,
  ): Promise<void> => {
    const todos = await this.db.getTodos();
    (res.json as (data: unknown) => void)(todos);
  };

  getTodoById = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ): Promise<void> => {
    const id = req.params.id;
    const todo = await this.db.getTodoById(Number(id));
    (res.json as (data: unknown) => void)(todo);
  };

  createTodo = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ): Promise<void> => {
    const { task } = req.body;
    const todo = await this.db.createTodo(task);
    (res.json as (data: unknown) => void)(todo);
  };

  updateTodo = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ): Promise<void> => {
    const id = req.params.id;
    const { task, completed } = req.body;
    const todo = await this.db.updateTodo(Number(id), task, completed);
    (res.json as (data: unknown) => void)(todo);
  };

  toggleTodoStatus = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ): Promise<void> => {
    const id = req.params.id;
    const todo = await this.db.toggleTodoStatus(Number(id));
    (res.json as (data: unknown) => void)(todo);
  };

  deleteTodo = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ): Promise<void> => {
    const id = req.params.id;
    const todo = await this.db.deleteTodo(Number(id));
    (res.json as (data: unknown) => void)(todo);
  };
}
