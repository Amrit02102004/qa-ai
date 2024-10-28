import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { generateInitialPrompt, generateFollowUpPrompt } from './prompts.js';
import callGemini from './gemini.js';
import formatResponse from './responseformatter.js';
import ConversationManager from './conversationManager.js';

dotenv.config();
const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

const conversationManager = new ConversationManager();

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/generate-prompts', async (req, res) => {
    const { personality, providedText } = req.body;

    if (!personality || !providedText) {
        return res.status(400).json({ 
            error: 'Missing required fields', 
            message: 'Both personality and providedText are required' 
        });
    }

    try {
        const prompts = generateInitialPrompt(personality, providedText);
        
        const apiResponse = await callGemini(prompts);
        console.log("Initial API Response:", JSON.stringify(apiResponse, null, 2));
        
        const formattedContent = formatResponse(apiResponse);
        
        if (formattedContent.error) {
            return res.status(500).json(formattedContent);
        }

        const conversationId = Date.now().toString();
        
        conversationManager.createConversation(conversationId, personality);
        
        conversationManager.addToHistory(conversationId, {
            type: 'user',
            content: providedText,
            role: 'user'
        });
        
        conversationManager.addToHistory(conversationId, {
            type: 'assistant',
            content: apiResponse.parts[0].text,
            role: 'assistant'
        });

        res.json({
            conversationId,
            ...formattedContent
        });

    } catch (error) {
        console.error("Error in generate-prompts route:", error);
        res.status(500).json({ 
            error: "Internal server error", 
            message: error.message 
        });
    }
});

app.post('/api/follow-up', async (req, res) => {
    const { conversationId, followUpQuestion } = req.body;

    if (!conversationId || !followUpQuestion) {
        return res.status(400).json({ 
            error: 'Missing required fields', 
            message: 'Both conversationId and followUpQuestion are required' 
        });
    }

    try {
        const conversation = conversationManager.getConversation(conversationId);
        
        if (!conversation) {
            return res.status(404).json({ 
                error: 'Conversation not found', 
                message: 'The specified conversation ID does not exist' 
            });
        }

        const prompts = generateFollowUpPrompt(
            conversation.personality,
            conversation.history,
            followUpQuestion
        );

        const apiResponse = await callGemini(prompts);
        console.log("Follow-up API Response:", JSON.stringify(apiResponse, null, 2));

        
        const formattedContent = formatResponse(apiResponse);

        if (formattedContent.error) {
            return res.status(500).json(formattedContent);
        }

        conversationManager.addToHistory(conversationId, {
            type: 'user',
            content: followUpQuestion,
            role: 'user'
        });
        
        conversationManager.addToHistory(conversationId, {
            type: 'assistant',
            content: apiResponse.parts[0].text,
            role: 'assistant'
        });

        res.json({
            conversationId,
            ...formattedContent
        });

    } catch (error) {
        console.error("Error in follow-up route:", error);
        res.status(500).json({ 
            error: "Internal server error", 
            message: error.message 
        });
    }
});

app.get('/api/conversation/:conversationId', (req, res) => {
    const { conversationId } = req.params;
    
    const conversation = conversationManager.getConversation(conversationId);
    
    if (!conversation) {
        return res.status(404).json({
            error: 'Conversation not found',
            message: 'The specified conversation ID does not exist'
        });
    }

    res.json({
        conversationId,
        personality: conversation.personality,
        history: conversation.history
    });
});

setInterval(() => {
    conversationManager.cleanupOldConversations();
}, 60 * 60 * 1000);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;