# A CRUD API using Express.js, TypeScript, PostgreSQL and Docker Compose.

## Project Structure
```
crud-api/
├── docker-compose.yml
├── server/
│   ├── package.json
│   ├── tsconfig.json
│   ├── index.ts
│   ├── db.ts
│   └── routes.ts
```

## 1. Docker Compose Setup (`docker-compose.yml`)
```yaml
version: '3'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: todos
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  api:
    build: ./server
    ports:
      - "3000:3000"
    depends_on:
      - postgres
    environment:
      DB_HOST: postgres
      DB_USER: admin
      DB_PASSWORD: secret
      DB_NAME: todos

volumes:
  pgdata:
```

## 2. TypeScript Configuration (`tsconfig.json`)
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
  "include": ["**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 3. Express Server (`index.ts`)
```typescript
import express from 'express';
import { pool } from './db';
import routes from './routes';

const app = express();
app.use(express.json());

// Initialize routes
routes(app);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## 4. Database Configuration (`db.ts`)
```typescript
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

export { pool };
```

## 5. CRUD Routes (`routes.ts`)
```typescript
import { Request, Response, Express } from 'express';
import { pool } from './db';

export default (app: Express) => {
  // Create table if it doesn't exist
  pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      task TEXT NOT NULL,
      completed BOOLEAN DEFAULT false
    )
  `);

  // CRUD Endpoints

  // Get all todos
  app.get('/todos', async (req: Request, res: Response) => {
    const result = await pool.query('SELECT * FROM todos');
    res.json(result.rows);
  });

  // Create a new todo
  app.post('/todos', async (req: Request, res: Response) => {
    const { task } = req.body;
    const result = await pool.query(
      'INSERT INTO todos (task) VALUES ($1) RETURNING *',
      [task]
    );
    res.status(201).json(result.rows[0]);
  });

  // Update a todo by ID
  app.put('/todos/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { task, completed } = req.body;
    const result = await pool.query(
      'UPDATE todos SET task = $1, completed = $2 WHERE id = $3 RETURNING *',
      [task, completed, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).send('Todo not found');
    }

    res.json(result.rows[0]);
  });

  // Delete a todo by ID
  app.delete('/todos/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).send('Todo not found');
    }

    res.status(204).send();
  });
};
```

## 6. Package.json (`package.json`)
```json
{
  "name": "crud-api",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "ts-node src/index.ts",
    "dev": "ts-node-dev --respawn src/index.ts",
    "build": "tsc"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3"
  },
  "devDependencies": {
    "@types/express": "^4.17.13",
    "@types/node": "^18.16.3",
    "ts-node": "^10.9.1",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.0.4"
  }
}
```

## Usage Steps

1. **Start Services**:
   Run the following command in your terminal to build and start the services:

   ```bash
   docker-compose up --build
   ```

2. **Test Endpoints**:
   You can use `curl` or any API client (like Postman) to test the endpoints:

   ```bash
   # Create a new todo
   curl -X POST -H "Content-Type: application/json" -d '{"task":"Learn TypeScript with Express"}' http://localhost:3000/todos

   # Get all todos
   curl http://localhost:3000/todos

   # Update a todo by ID (replace `1` with the actual ID)
   curl -X PUT -H "Content-Type: application/json" -d '{"task":"Learn TypeScript with Express and PostgreSQL", "completed":true}' http://localhost:3000/todos/1

   # Delete a todo by ID (replace `1` with the actual ID)
   curl -X DELETE http://localhost:3000/todos/1
   ```

   This setup includes:

- PostgreSQL container with persistent storage
- Automatic table creation
- Basic CRUD operations
- Environment configuration for Docker
- Error handling (needs expansion for production)

The Docker Compose file manages both the PostgreSQL database and Express API service, ensuring they can communicate through the defined network[^3][^5]. The code uses raw SQL queries for simplicity while maintaining PostgreSQL's full power[^1][^4].

<div style="text-align: center">⁂</div>

[^1]: https://dev.to/ahmadtheswe/crud-rest-api-with-nodejs-expressjs-and-postgresql-57b2

[^2]: https://www.bezkoder.com/node-express-sequelize-postgresql/

[^3]: https://commandprompt.com/education/how-to-install-postgresql-using-docker-compose/

[^4]: https://geekiebarbs.hashnode.dev/build-a-crud-api-with-typescript-nodejs-express-and-postgresql

[^5]: https://www.warp.dev/terminus/postgres-docker-compose

[^6]: https://dev.to/francescoxx/build-a-crud-rest-api-in-javascript-using-nodejs-express-postgres-docker-jkb

[^7]: https://www.hostmycode.in/tutorials/setting-up-postgresql-16-using-docker-compose

[^8]: https://www.docker.com/blog/how-to-use-the-postgres-docker-official-image/

[^9]: https://www.youtube.com/watch?v=OnQvGqcZp0o

[^10]: https://blog.devgenius.io/create-a-crud-api-using-node-js-express-and-postgresql-51041cb16e46

[^11]: https://github.com/dyshaev-working/nodejs-express-typescript-knex-psql-crud-example

[^12]: https://github.com/bezkoder/node-express-sequelize-postgresql

[^13]: https://github.com/khezen/compose-postgres/blob/master/docker-compose.yml

[^14]: https://docs.docker.com/reference/samples/postgres/

[^15]: https://stackoverflow.com/questions/30848670/how-to-customize-the-configuration-file-of-the-official-postgresql-docker-image

[^16]: https://www.youtube.com/watch?v=wWEBwmtu7ts

[^17]: https://hub.docker.com/_/postgres

[^18]: https://www.tutofox.com/react/tutorial-fullstack-react-typescript-nodejs-express-postgresql/

[^19]: https://www.linkedin.com/pulse/nodejs-meets-postgresql-building-scalable-crud-rest-apis-mohit-sehgal-lzbac

[^20]: https://blog.logrocket.com/crud-rest-api-node-js-express-postgresql/

[^21]: https://hashinteractive.com/blog/docker-compose-up-with-postgres-quick-tips/

[^22]: https://geshan.com.np/blog/2021/12/docker-postgres/