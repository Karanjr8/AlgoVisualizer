"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chat = void 0;
const geminiService_1 = require("../services/geminiService");
const chat = async (req, res) => {
    const userMessage = req.body.message || req.body.prompt;
    const history = Array.isArray(req.body.history) ? req.body.history : [];
    if (!userMessage || typeof userMessage !== 'string' || !userMessage.trim()) {
        return res.status(400).json({ error: 'Message is required' });
    }
    try {
        const botReply = await geminiService_1.GeminiService.generateChatResponse(history, userMessage.trim());
        return res.json({ reply: botReply || "I couldn't process that. Please ask again!" });
    }
    catch (error) {
        console.error('[ChatbotController] Error fetching chatbot response:', error?.message);
        const statusCode = error instanceof geminiService_1.GeminiApiError ? error.statusCode : 500;
        return res.status(statusCode).json({
            error: error?.message || 'Failed to get a response from Gemini AI',
        });
    }
};
exports.chat = chat;
