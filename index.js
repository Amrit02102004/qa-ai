import express from 'express'
import os from 'os';
import dotenv from 'dotenv';
import generatePrompts from './prompts.js';
import bodyParser from 'body-parser';
import callGemini from './gemini.js'
import formatResponse from './responseformatter.js';
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
        const apiResponse = await callGemini(prompts);
        console.log("API Response:", JSON.stringify(apiResponse, null, 2));
        
        const formattedContent = formatResponse(apiResponse);
        
        if (formattedContent.error) {
            res.status(500).json(formattedContent);
        } else {
            res.json(formattedContent);
        }
    } catch (error) {
        console.error("Error in generate-prompts route:", error);
        res.status(500).json({ error: "Internal server error", message: error.message });
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});