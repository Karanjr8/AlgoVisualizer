import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getAllAchievements = async (req: Request, res: Response) => {
  try {
    const achievements = await prisma.achievement.findMany();
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
};
