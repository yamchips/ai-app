import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world!');
});

app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello world!' });
});

app.post('/api/chat', async (req: Request, res: Response) => {
  const {prompt} = req.body;

  const response = await client.responses.create({
    model: "gpt-5.4-mini",
    input: prompt,
  })

  res.json({message: response.output_text})
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
