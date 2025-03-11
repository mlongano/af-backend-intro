# A minimal example on how to use express for creating a CRUD endpoint that use Postgresql as data storage using docker compose

Here's a minimal example of a CRUD API with Express.js, PostgreSQL, and Docker Compose:

## Project Structure

```
crud-api/
├── docker-compose.yml
├── server/
│   ├── package.json
│   ├── index.js
│   ├── db.js
│   └── routes.js
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


## 2. Express Server (`index.js`)

```javascript
const express = require('express');
const { pool } = require('./db');
const app = express();
app.use(express.json());

// Import routes
require('./routes')(app);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```


## 3. Database Configuration (`db.js`)

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

module.exports = { pool };
```


## 4. CRUD Routes (`routes.js`)

```javascript
module.exports = (app) => {
  const { pool } = require('./db');

  // Create table
  pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      task TEXT NOT NULL,
      completed BOOLEAN DEFAULT false
    )
  `);

  // CRUD Endpoints
  app.get('/todos', async (req, res) => {
    const result = await pool.query('SELECT * FROM todos');
    res.json(result.rows);
  });

  app.post('/todos', async (req, res) => {
    const { task } = req.body;
    const result = await pool.query(
      'INSERT INTO todos (task) VALUES ($1) RETURNING *',
      [task]
    );
    res.status(201).json(result.rows[^0]);
  });

  app.put('/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { task, completed } = req.body;
    const result = await pool.query(
      'UPDATE todos SET task = $1, completed = $2 WHERE id = $3 RETURNING *',
      [task, completed, id]
    );
    res.json(result.rows[^0]);
  });

  app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM todos WHERE id = $1', [id]);
    res.status(204).send();
  });
};
```


## 5. Package.json

```json
{
  "name": "crud-api",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```


## Usage

1. Start services:
```bash
docker-compose up --build
```

2. Test endpoints:
```bash
# Create todo
curl -X POST -H "Content-Type: application/json" -d '{"task":"Learn Docker"}' http://localhost:3000/todos

# Get all todos
curl http://localhost:3000/todos

# Update todo
curl -X PUT -H "Content-Type: application/json" -d '{"task":"Learn Docker Compose", "completed":true}' http://localhost:3000/todos/1

# Delete todo
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

