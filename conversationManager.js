
class ConversationManager {
    constructor() {
        this.conversations = new Map();
    }

    createConversation(conversationId, personality) {
        this.conversations.set(conversationId, {
            personality,
            history: [],
            timestamp: new Date()
        });
    }

    addToHistory(conversationId, entry) {
        const conversation = this.conversations.get(conversationId);
        if (conversation) {
            conversation.history.push({
                ...entry,
                timestamp: new Date()
            });
            conversation.timestamp = new Date();
        }
    }

    getConversation(conversationId) {
        return this.conversations.get(conversationId);
    }

    cleanupOldConversations(maxAgeMs = 60 * 60 * 1000) { // Default 1 hour
        const now = new Date();
        for (const [id, conversation] of this.conversations.entries()) {
            if (now - conversation.timestamp > maxAgeMs) {
                this.conversations.delete(id);
            }
        }
    }
}

export default ConversationManager;