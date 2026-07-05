"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chat = void 0;
const axios_1 = __importDefault(require("axios"));
const chat = async (req, res) => {
    const userMessage = req.body.message;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!userMessage) {
        return res.status(400).json({ error: 'Message is required' });
    }
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'placeholder_key') {
        return res.status(500).json({ error: 'Gemini API key is not configured' });
    }
    try {
        const response = await axios_1.default.post(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
            contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        }, { headers: { 'Content-Type': 'application/json' } });
        const botReply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't process that.";
        res.json({ reply: botReply });
    }
    catch (error) {
        console.error('Error fetching response:', error?.response?.data || error.message);
        res.status(500).json({ error: 'Failed to get a response from Gemini API' });
    }
};
exports.chat = chat;
