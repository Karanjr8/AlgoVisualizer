import { Request, Response } from 'express';
import { GeminiService, GeminiApiError } from '../services/geminiService';

export const chat = async (req: Request, res: Response) => {
  const userMessage = req.body.message || req.body.prompt;
  const history = Array.isArray(req.body.history) ? req.body.history : [];

  if (!userMessage || typeof userMessage !== 'string' || !userMessage.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const botReply = await GeminiService.generateChatResponse(history, userMessage.trim());
    return res.json({ reply: botReply || "I couldn't process that. Please ask again!" });
  } catch (error: any) {
    console.error('[ChatbotController] Error fetching chatbot response:', error?.message);
    const statusCode = error instanceof GeminiApiError ? error.statusCode : 500;
    return res.status(statusCode).json({
      error: error?.message || 'Failed to get a response from Gemini AI',
    });
  }
};
