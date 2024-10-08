import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

async function callGemini(prompts) {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;

    const headers = {
        "Content-Type": "application/json"
    };

    const payload = {
        contents: [{
            parts: prompts
                .filter(prompt => prompt.role === "user")
                .map(prompt => ({ text: prompt.content }))
        }],
        safetySettings: [
            {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_NONE"
            }
        ],
        generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
        }
    };

    try {
        const response = await axios.post(url, payload, { 
            headers,
            // timeout: 20000 // Set a 9-second timeout
        });
        
        if (response.status === 200 && response.data.candidates && response.data.candidates[0] && response.data.candidates[0].content) {
            return response.data.candidates[0].content;
        } else {
            throw new Error("No content in API response");
        }
    } catch (error) {
        console.error("API request failed:", error.message);
        throw error;
    }
}

export default callGemini;