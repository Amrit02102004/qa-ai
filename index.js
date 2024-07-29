import express from 'express'
import os from 'os';
import dotenv from 'dotenv';
import generateprompts from './prompts.js';
import bodyParser from 'body-parser';
const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World');
    }
);

app.post('/api/generate-prompts', (req, res) => {
    const { personality, providedText } = req.body;
    const prompts = generateprompts(personality, providedText);
    res.json(prompts);
});




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});