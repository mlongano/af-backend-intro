CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    task TEXT NOT NULL,
    completed BOOLEAN DEFAULT false
);

INSERT INTO
    todos (task, completed)
VALUES
    ('Buy groceries', false);

INSERT INTO
    todos (task, completed)
VALUES
    ('Walk the dog', true);

INSERT INTO
    todos (task, completed)
VALUES
    ('Finish the TypeScript project', false);
