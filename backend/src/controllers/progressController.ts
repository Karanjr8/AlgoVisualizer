import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middlewares/auth';
import { z } from 'zod';

export const getProgress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const progress = await prisma.progress.findMany({
      where: { userId },
    });
    res.json({ progress });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateProgressSchema = z.object({
  completed: z.boolean().optional(),
  score: z.number().optional(),
});

export const updateProgress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const algorithmId = req.params.algorithmId as string;
    const { completed, score } = updateProgressSchema.parse(req.body);

    const progress = await prisma.progress.upsert({
      where: {
        userId_algorithmId: {
          userId,
          algorithmId,
        },
      },
      update: {
        completed: completed !== undefined ? completed : undefined,
        score: score !== undefined ? score : undefined,
        lastAccessed: new Date(),
      },
      create: {
        userId,
        algorithmId,
        completed: completed || false,
        score: score || 0,
      },
    });

    res.json({ progress });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
