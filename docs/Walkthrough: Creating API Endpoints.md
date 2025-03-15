# Walkthrough: Creating API Endpoints

In this walkthrough, we'll build a RESTful API for task management using Express and TypeScript. We'll start with a simple foundation and progressively add features, following best practices.

## Step 1: Set Up the Project

First, let's create a new project directory and initialize it:

```bash
mkdir task-api
cd task-api
npm init -y
```

Now, let's install the necessary dependencies:

```bash
npm install express
npm install typescript ts-node @types/node @types/express --save-dev
```

Create a TypeScript configuration file (`tsconfig.json`):

```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## Step 2: Create Your First Endpoint

Let's create the initial folder structure and server setup:

```bash
mkdir -p src
```

Create `src/index.ts` with a basic Express server and a simple "Hello World" endpoint:

```typescript
import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Simple GET endpoint
app.get('/', (req, res) => {
  res.send('Hello World from Task API!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```

Add a script to your `package.json` to run the server:

```json
"scripts": {
  "start": "ts-node src/index.ts",
  "dev": "ts-node-dev --respawn src/index.ts"
}
```

Let's install `ts-node-dev` for development with hot reloading:

```bash
npm install ts-node-dev --save-dev
```

Now you can run the server:

```bash
npm run dev
```

Visit `http://localhost:3000` to see your "Hello World" message.

## Step 3: Define Task Types and Mock Database

Let's define our Task interface and create a mock database to work with:

Create `src/types.ts`:

```typescript
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
}

export interface CreateTaskDTO {
  title: string;
  description: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  completed?: boolean;
}
```

Create `src/db.ts` for our in-memory database:

```typescript
import { Task } from './types';

// In-memory database
let tasks: Task[] = [
  {
    id: '1',
    title: 'Learn Express',
    description: 'Study Express.js framework',
    completed: false,
    createdAt: new Date()
  },
  {
    id: '2',
    title: 'Build REST API',
    description: 'Create a RESTful API with Express',
    completed: false,
    createdAt: new Date()
  }
];

export const db = {
  tasks: {
    // Get all tasks
    findAll: (): Task[] => {
      return tasks;
    },
    
    // Get task by ID
    findById: (id: string): Task | undefined => {
      return tasks.find(task => task.id === id);
    },
    
    // Create a new task
    create: (task: Omit<Task, 'id' | 'createdAt'>): Task => {
      const newTask: Task = {
        ...task,
        id: Date.now().toString(), // Simple ID generation
        createdAt: new Date()
      };
      
      tasks.push(newTask);
      return newTask;
    },
    
    // Update a task
    update: (id: string, data: Partial<Task>): Task | null => {
      const index = tasks.findIndex(task => task.id === id);
      
      if (index === -1) return null;
      
      tasks[index] = { ...tasks[index], ...data };
      return tasks[index];
    },
    
    // Delete a task
    delete: (id: string): boolean => {
      const initialLength = tasks.length;
      tasks = tasks.filter(task => task.id !== id);
      return tasks.length !== initialLength;
    }
  }
};
```

## Step 4: Create the Tasks Routes

Let's add GET endpoints to fetch tasks. Create `src/routes.ts`:

```typescript
import { Router, Request, Response } from 'express';
import { db } from './db';
import { CreateTaskDTO, UpdateTaskDTO } from './types';

const router = Router();

// GET /tasks - Get all tasks
router.get('/tasks', (req: Request, res: Response) => {
  const tasks = db.tasks.findAll();
  res.json(tasks);
});

// GET /tasks/:id - Get a specific task
router.get('/tasks/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const task = db.tasks.findById(id);
  
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  
  res.json(task);
});

export default router;
```

Now update `src/index.ts` to use these routes:

```typescript
import express from 'express';
import routes from './routes';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Mount the router
app.use('/api', routes);

// Simple GET endpoint for the root
app.get('/', (req, res) => {
  res.send('Hello World from Task API! Use /api/tasks to access the tasks API.');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```

Test your API:
1. GET all tasks: `curl http://localhost:3000/api/tasks`
2. GET a specific task: `curl http://localhost:3000/api/tasks/1`

## Step 5: Add POST Endpoint for Creating Tasks

Let's update `src/routes.ts` to add a POST endpoint:

```typescript
import { Router, Request, Response } from 'express';
import { db } from './db';
import { CreateTaskDTO, UpdateTaskDTO } from './types';

const router = Router();

// GET /tasks - Get all tasks
router.get('/tasks', (req: Request, res: Response) => {
  const tasks = db.tasks.findAll();
  res.json(tasks);
});

// GET /tasks/:id - Get a specific task
router.get('/tasks/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const task = db.tasks.findById(id);
  
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  
  res.json(task);
});

// POST /tasks - Create a new task
router.post('/tasks', (req: Request, res: Response) => {
  try {
    const taskData: CreateTaskDTO = req.body;
    
    // Simple validation
    if (!taskData.title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    const newTask = db.tasks.create({
      title: taskData.title,
      description: taskData.description || '',
      completed: false
    });
    
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while creating the task' });
  }
});

export default router;
```

Now you can create a new task with:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"title":"Learn TypeScript","description":"Study TypeScript basics"}' http://localhost:3000/api/tasks
```

## Step 6: Add PUT and DELETE Endpoints

Let's complete our CRUD operations by adding PUT and DELETE endpoints:

```typescript
import { Router, Request, Response } from 'express';
import { db } from './db';
import { CreateTaskDTO, UpdateTaskDTO } from './types';

const router = Router();

// GET /tasks - Get all tasks
router.get('/tasks', (req: Request, res: Response) => {
  const tasks = db.tasks.findAll();
  res.json(tasks);
});

// GET /tasks/:id - Get a specific task
router.get('/tasks/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const task = db.tasks.findById(id);
  
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  
  res.json(task);
});

// POST /tasks - Create a new task
router.post('/tasks', (req: Request, res: Response) => {
  try {
    const taskData: CreateTaskDTO = req.body;
    
    // Simple validation
    if (!taskData.title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    const newTask = db.tasks.create({
      title: taskData.title,
      description: taskData.description || '',
      completed: false
    });
    
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while creating the task' });
  }
});

// PUT /tasks/:id - Update a task
router.put('/tasks/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const taskData: UpdateTaskDTO = req.body;
    
    // Check if task exists
    const existingTask = db.tasks.findById(id);
    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Update the task
    const updatedTask = db.tasks.update(id, taskData);
    
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while updating the task' });
  }
});

// DELETE /tasks/:id - Delete a task
router.delete('/tasks/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    
    // Check if task exists
    const existingTask = db.tasks.findById(id);
    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Delete the task
    const deleted = db.tasks.delete(id);
    
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(500).json({ message: 'Failed to delete task' });
    }
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while deleting the task' });
  }
});

export default router;
```

Test the new endpoints:

```bash
# Update a task
curl -X PUT -H "Content-Type: application/json" -d '{"completed":true}' http://localhost:3000/api/tasks/1

# Delete a task
curl -X DELETE http://localhost:3000/api/tasks/2
```

## Step 7: Add Error Handling Middleware

Let's improve our error handling by adding a custom middleware. Create `src/middleware/errorHandler.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';

export class ApiError extends Error {
  statusCode: number;
  
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);
  
  // If it's our custom ApiError, use its status code
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: true,
      message: err.message
    });
  }
  
  // For unexpected errors
  return res.status(500).json({
    error: true,
    message: 'An unexpected error occurred'
  });
};
```

Now, refactor our routes to use this error handling. Update `src/routes.ts`:

```typescript
import { Router, Request, Response, NextFunction } from 'express';
import { db } from './db';
import { CreateTaskDTO, UpdateTaskDTO } from './types';
import { ApiError } from './middleware/errorHandler';

const router = Router();

// GET /tasks - Get all tasks
router.get('/tasks', (req: Request, res: Response, next: NextFunction) => {
  try {
    const tasks = db.tasks.findAll();
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

// GET /tasks/:id - Get a specific task
router.get('/tasks/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const task = db.tasks.findById(id);
    
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }
    
    res.json(task);
  } catch (error) {
    next(error);
  }
});

// POST /tasks - Create a new task
router.post('/tasks', (req: Request, res: Response, next: NextFunction) => {
  try {
    const taskData: CreateTaskDTO = req.body;
    
    // Validation
    if (!taskData.title) {
      throw new ApiError(400, 'Title is required');
    }
    
    const newTask = db.tasks.create({
      title: taskData.title,
      description: taskData.description || '',
      completed: false
    });
    
    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
});

// PUT /tasks/:id - Update a task
router.put('/tasks/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const taskData: UpdateTaskDTO = req.body;
    
    // Check if task exists
    const existingTask = db.tasks.findById(id);
    if (!existingTask) {
      throw new ApiError(404, 'Task not found');
    }
    
    // Update the task
    const updatedTask = db.tasks.update(id, taskData);
    
    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
});

// DELETE /tasks/:id - Delete a task
router.delete('/tasks/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    
    // Check if task exists
    const existingTask = db.tasks.findById(id);
    if (!existingTask) {
      throw new ApiError(404, 'Task not found');
    }
    
    // Delete the task
    const deleted = db.tasks.delete(id);
    
    if (deleted) {
      res.status(204).send();
    } else {
      throw new ApiError(500, 'Failed to delete task');
    }
  } catch (error) {
    next(error);
  }
});

export default router;
```

Finally, update `src/index.ts` to include the error handling middleware:

```typescript
import express from 'express';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Mount the router
app.use('/api', routes);

// Simple GET endpoint for the root
app.get('/', (req, res) => {
  res.send('Hello World from Task API! Use /api/tasks to access the tasks API.');
});

// Error handling middleware should be the last middleware
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```

## Step 8: Add Validation Middleware

For more robust input validation, create `src/middleware/validation.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';
import { ApiError } from './errorHandler';
import { CreateTaskDTO, UpdateTaskDTO } from '../types';

export const validateCreateTask = (req: Request, res: Response, next: NextFunction) => {
  const task = req.body as CreateTaskDTO;
  
  // Check required fields
  if (!task.title) {
    return next(new ApiError(400, 'Title is required'));
  }
  
  // Check title length
  if (task.title.length < 3) {
    return next(new ApiError(400, 'Title must be at least 3 characters long'));
  }
  
  // Sanitize input
  req.body = {
    title: task.title.trim(),
    description: task.description?.trim() || ''
  };
  
  next();
};

export const validateUpdateTask = (req: Request, res: Response, next: NextFunction) => {
  const task = req.body as UpdateTaskDTO;
  
  // Make sure at least one field to update is provided
  if (Object.keys(task).length === 0) {
    return next(new ApiError(400, 'No fields to update were provided'));
  }
  
  // Validate title if provided
  if (task.title !== undefined) {
    if (task.title.length < 3) {
      return next(new ApiError(400, 'Title must be at least 3 characters long'));
    }
    req.body.title = task.title.trim();
  }
  
  // Sanitize description if provided
  if (task.description !== undefined) {
    req.body.description = task.description.trim();
  }
  
  next();
};
```

Now, update `src/routes.ts` to use these validation middleware:

```typescript
import { Router, Request, Response, NextFunction } from 'express';
import { db } from './db';
import { CreateTaskDTO, UpdateTaskDTO } from './types';
import { ApiError } from './middleware/errorHandler';
import { validateCreateTask, validateUpdateTask } from './middleware/validation';

const router = Router();

// GET /tasks - Get all tasks
router.get('/tasks', (req: Request, res: Response, next: NextFunction) => {
  try {
    const tasks = db.tasks.findAll();
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

// GET /tasks/:id - Get a specific task
router.get('/tasks/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const task = db.tasks.findById(id);
    
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }
    
    res.json(task);
  } catch (error) {
    next(error);
  }
});

// POST /tasks - Create a new task
router.post('/tasks', validateCreateTask, (req: Request, res: Response, next: NextFunction) => {
  try {
    const taskData: CreateTaskDTO = req.body;
    
    const newTask = db.tasks.create({
      title: taskData.title,
      description: taskData.description || '',
      completed: false
    });
    
    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
});

// PUT /tasks/:id - Update a task
router.put('/tasks/:id', validateUpdateTask, (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const taskData: UpdateTaskDTO = req.body;
    
    // Check if task exists
    const existingTask = db.tasks.findById(id);
    if (!existingTask) {
      throw new ApiError(404, 'Task not found');
    }
    
    // Update the task
    const updatedTask = db.tasks.update(id, taskData);
    
    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
});

// DELETE /tasks/:id - Delete a task
router.delete('/tasks/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    
    // Check if task exists
    const existingTask = db.tasks.findById(id);
    if (!existingTask) {
      throw new ApiError(404, 'Task not found');
    }
    
    // Delete the task
    const deleted = db.tasks.delete(id);
    
    if (deleted) {
      res.status(204).send();
    } else {
      throw new ApiError(500, 'Failed to delete task');
    }
  } catch (error) {
    next(error);
  }
});

export default router;
```

## Step 9: Add Logging Middleware

Let's add a simple logging middleware to log all incoming requests. Create `src/middleware/logger.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  // Log when the request begins
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  // Once the response is finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
  });
  
  next();
};
```

Update `src/index.ts` to use this middleware:

```typescript
import express from 'express';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/logger';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(requestLogger);  // Add request logging

// Mount the router
app.use('/api', routes);

// Simple GET endpoint for the root
app.get('/', (req, res) => {
  res.send('Hello World from Task API! Use /api/tasks to access the tasks API.');
});

// Error handling middleware should be the last middleware
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```

## Final Project Structure

Your project should now have the following structure:

```
task-api/
├── node_modules/
├── src/
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   ├── logger.ts
│   │   └── validation.ts
│   ├── db.ts
│   ├── index.ts
│   ├── routes.ts
│   └── types.ts
├── package.json
└── tsconfig.json
```

## Testing Your API

You can now test all endpoints of your API:

1. Get all tasks:
   ```bash
   curl http://localhost:3000/api/tasks
   ```

2. Get a specific task:
   ```bash
   curl http://localhost:3000/api/tasks/1
   ```

3. Create a new task:
   ```bash
   curl -X POST -H "Content-Type: application/json" -d '{"title":"Learn TypeScript","description":"Study TypeScript basics"}' http://localhost:3000/api/tasks
   ```

4. Update a task:
   ```bash
   curl -X PUT -H "Content-Type: application/json" -d '{"completed":true}' http://localhost:3000/api/tasks/1
   ```

5. Delete a task:
   ```bash
   curl -X DELETE http://localhost:3000/api/tasks/2
   ```

6. Test validation error:
   ```bash
   curl -X POST -H "Content-Type: application/json" -d '{"title":""}' http://localhost:3000/api/tasks
   ```

## Conclusion

You've successfully built a RESTful API with Express and TypeScript that follows REST principles. This API includes:

- Complete CRUD operations
- Error handling middleware
- Input validation
- Request logging
- Clear route organization
- Type safety with TypeScript

These are the fundamental building blocks for any API you'll develop in the future. You can extend this pattern to build more complex APIs with database connections, authentication, and more advanced features.
