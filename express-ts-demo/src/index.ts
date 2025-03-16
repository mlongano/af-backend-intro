import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3000;

const lezioni = [
  { id: 1, titolo: 'Lezione 1' },
  { id: 2, titolo: 'Lezione 2' },
  { id: 3, titolo: 'Lezione 3' },
];


app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

app.get('/api/lezioni', (req: Request, res: Response) => {
  res.json(lezioni);
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
