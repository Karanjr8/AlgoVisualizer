import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getRoadmapNodes = async (req: Request, res: Response) => {
  try {
    const nodes = await prisma.roadmapNode.findMany({
      orderBy: { recommendedOrder: 'asc' }
    });
    res.json(nodes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch roadmap nodes' });
  }
};
