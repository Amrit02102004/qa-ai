import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

async function callGemini(prompts, retries = 3) {
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

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await axios.post(url, payload, { headers });
            console.log("Response Status:", response.status);
            console.log("Response Data:", JSON.stringify(response.data, null, 2));
            
            if (response.status === 200) {
                if (response.data.candidates && response.data.candidates[0] && response.data.candidates[0].content) {
                    return response.data.candidates[0].content;
                } else {
                    throw new Error("No content in API response");
                }
            } else {
                console.warn(`Unexpected status code: ${response.status}`);
            }
        } catch (error) {
            console.error(`Attempt ${attempt} failed:`, error.message);
            
            if (error.response) {
                console.error("Response status:", error.response.status);
                console.error("Response data:", error.response.data);
            }

            if (attempt === retries) {
                throw error;
            }

            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
        }
    }
}

export default callGemini;