import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

async function callGemini(prompts) {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const headers = {
        "Content-Type": "application/json"
    };

    const payload = {
        contents: [{
            parts: prompts
                .filter(prompt => prompt.role === "user")
                .map(prompt => ({ text: prompt.content }))
        }]
    };
    try {
        const response = await axios.post(url, payload, { headers });
        console.log("Response JSON:", response.data);
        if (response.status === 200) {
            return response.data;  // Return the full response data
        } else {
            return `Error: ${response.status} - ${response.statusText}`;
        }
    } catch (error) {
        console.error("API request failed:", error);
        return `Error: ${error.response?.status || 'Unknown'} - ${error.message}`;
    }
}

export default callGemini;