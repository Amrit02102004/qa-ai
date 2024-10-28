import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { generateInitialPrompt, generateFollowUpPrompt } from './prompts.js';
import callGemini from './gemini.js';
import formatResponse from './responseformatter.js';
import ConversationManager from './conversationManager.js';

// Initialize environment variables and express
dotenv.config();
const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

// Initialize conversation manager
const conversationManager = new ConversationManager();

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initial conversation endpoint
app.post('/api/generate-prompts', async (req, res) => {
    const { personality, providedText } = req.body;

    if (!personality || !providedText) {
        return res.status(400).json({ 
            error: 'Missing required fields', 
            message: 'Both personality and providedText are required' 
        });
    }

    try {
        // Generate initial prompts
        const prompts = generateInitialPrompt(personality, providedText);
        
        // Call Gemini API
        const apiResponse = await callGemini(prompts);
        console.log("Initial API Response:", JSON.stringify(apiResponse, null, 2));
        
        // Format the response
        const formattedContent = formatResponse(apiResponse);
        
        if (formattedContent.error) {
            return res.status(500).json(formattedContent);
        }

        // Generate conversation ID and store context
        const conversationId = Date.now().toString();
        
        conversationManager.createConversation(conversationId, personality);
        
        // Store the initial interaction
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

        // Send response with conversation ID
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

// Follow-up conversation endpoint
app.post('/api/follow-up', async (req, res) => {
    const { conversationId, followUpQuestion } = req.body;

    if (!conversationId || !followUpQuestion) {
        return res.status(400).json({ 
            error: 'Missing required fields', 
            message: 'Both conversationId and followUpQuestion are required' 
        });
    }

    try {
        // Get conversation context
        const conversation = conversationManager.getConversation(conversationId);
        
        if (!conversation) {
            return res.status(404).json({ 
                error: 'Conversation not found', 
                message: 'The specified conversation ID does not exist' 
            });
        }

        // Generate follow-up prompts with full history
        const prompts = generateFollowUpPrompt(
            conversation.personality,
            conversation.history,
            followUpQuestion
        );

        // Call Gemini API
        const apiResponse = await callGemini(prompts);
        console.log("Follow-up API Response:", JSON.stringify(apiResponse, null, 2));

        // Format the response
        const formattedContent = formatResponse(apiResponse);

        if (formattedContent.error) {
            return res.status(500).json(formattedContent);
        }

        // Update conversation history
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

        // Send response
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

// Get conversation history endpoint
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

// Cleanup old conversations periodically (run every hour)
setInterval(() => {
    conversationManager.cleanupOldConversations();
}, 60 * 60 * 1000);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;