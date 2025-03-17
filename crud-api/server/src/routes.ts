import { Express, NextFunction, Request, Response } from "express";
import { TodoActionController } from "./controller";

const routes = (app: Express, todoActionController: TodoActionController) => {
  const {
    getTodos,
    getTodoById,
    updateTodo,
    deleteTodo,
    createTodo,
    toggleTodoStatus,
  } = todoActionController;

  // Get all todos
  app.get("/todos", getTodos);
  app.get("/todos/:id", getTodoById);
  app.post("/todos", createTodo);
  app.put("/todos/:id", updateTodo);
  app.put("/todos/toggle/:id", toggleTodoStatus);
  app.delete("/todos/:id", deleteTodo);
};

export default routes;
