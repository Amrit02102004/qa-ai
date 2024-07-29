import express from 'express'
import os from 'os';
import dotenv from 'dotenv';
import generatePrompts from './prompts.js';
import bodyParser from 'body-parser';
import callGemini from './gemini.js'

const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World');
    }
);

app.post('/api/generate-prompts', async (req, res) => {
    const { personality, providedText } = req.body;
    const prompts = generatePrompts(personality, providedText);
    try {
        const generatedContent = await callGemini(prompts);
        res.json({ generatedContent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});