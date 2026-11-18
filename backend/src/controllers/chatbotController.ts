import { Request, Response } from 'express';
import { GeminiService, GeminiApiError } from '../services/geminiService';

export const chat = async (req: Request, res: Response) => {
  const userMessage = req.body.prompt || req.body.message;

  if (!userMessage || typeof userMessage !== 'string' || !userMessage.trim()) {
    return res.status(400).json({ error: 'Prompt or message is required' });
  }

  try {
    const botReply = await GeminiService.generateText(userMessage.trim());
    res.json({ reply: botReply || "I couldn't process that." });
  } catch (error: any) {
    console.error('Error fetching chatbot response:', error?.message);
    const statusCode = error instanceof GeminiApiError ? error.statusCode : 500;
    res.status(statusCode).json({
      error: error?.message || 'Failed to get a response from Gemini AI',
    });
  }
};
