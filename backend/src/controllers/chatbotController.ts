import { Request, Response } from 'express';
import axios from 'axios';

export const chat = async (req: Request, res: Response) => {
  const userMessage = req.body.message;
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!userMessage) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'placeholder_key') {
    return res.status(500).json({ error: 'Gemini API key is not configured' });
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const botReply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't process that.";
    res.json({ reply: botReply });
  } catch (error: any) {
    console.error('Error fetching response:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get a response from Gemini API' });
  }
};
