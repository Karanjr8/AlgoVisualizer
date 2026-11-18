import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const savePracticeAttempt = async (req: Request, res: Response) => {
  try {
    const { userId, mode, difficulty, score, accuracy, completionTime } = req.body;
    
    const attempt = await prisma.practiceAttempt.create({
      data: {
        userId,
        mode,
        difficulty,
        score,
        accuracy,
        completionTime
      }
    });
    
    res.status(201).json(attempt);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save practice attempt' });
  }
};
