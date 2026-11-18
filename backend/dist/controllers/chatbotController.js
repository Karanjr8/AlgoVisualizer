"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chat = void 0;
const geminiService_1 = require("../services/geminiService");
const chat = async (req, res) => {
    const userMessage = req.body.prompt || req.body.message;
    if (!userMessage || typeof userMessage !== 'string' || !userMessage.trim()) {
        return res.status(400).json({ error: 'Prompt or message is required' });
    }
    try {
        const botReply = await geminiService_1.GeminiService.generateText(userMessage.trim());
        res.json({ reply: botReply || "I couldn't process that." });
    }
    catch (error) {
        console.error('Error fetching chatbot response:', error?.message);
        const statusCode = error instanceof geminiService_1.GeminiApiError ? error.statusCode : 500;
        res.status(statusCode).json({
            error: error?.message || 'Failed to get a response from Gemini AI',
        });
    }
};
exports.chat = chat;
