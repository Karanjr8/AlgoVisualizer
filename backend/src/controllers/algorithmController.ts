import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllAlgorithms = async (req: Request, res: Response) => {
  try {
    const algorithms = await prisma.algorithm.findMany();
    res.json(algorithms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch algorithms' });
  }
};

export const getAlgorithmBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const algorithm = await prisma.algorithm.findUnique({
      where: { slug: slug as string }
    });
    
    if (!algorithm) return res.status(404).json({ error: 'Algorithm not found' });
    
    res.json(algorithm);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch algorithm' });
  }
};
