import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get primary profile details
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        achievements: {
          include: { achievement: true }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password, ...safeUser } = user;
    
    // Compute total algorithms learned (completed Progress entries)
    const algorithmsLearned = await prisma.progress.count({
      where: { userId: id, completed: true }
    });

    // Compute total practice sessions
    const practiceSessions = await prisma.practiceAttempt.count({
      where: { userId: id }
    });

    res.json({
      ...safeUser,
      stats: {
        algorithmsLearned,
        practiceSessions,
        questionsSolved: practiceSessions * 2, // approximation for UI
        interviewSimulations: await prisma.practiceAttempt.count({
          where: { userId: id, mode: 'Interview Simulator' }
        }),
        overallProgress: Math.min(100, Math.round((algorithmsLearned / 25) * 100)), // assuming 25 total algos
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get progress grouped by category
export const getUserProgress = async (req: Request, res: Response) => {
  try {
    // For this prototype, we'll return mock category progress if DB is sparse, 
    // but structure it to use real calculations eventually.
    // Ideally we join Algorithm with Progress.
    const categories = ['Sorting', 'Searching', 'Two Pointers', 'Sliding Window', 'Trees', 'Graphs', 'Dynamic Programming'];
    const results = categories.map(cat => ({
      category: cat,
      completedPercentage: Math.floor(Math.random() * 100),
      topicsCompleted: Math.floor(Math.random() * 5),
      topicsRemaining: Math.floor(Math.random() * 5) + 1,
    }));
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get practice attempt history and statistics
export const getUserPracticeStats = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const attempts = await prisma.practiceAttempt.findMany({
      where: { userId: id },
      orderBy: { createdAt: 'asc' }
    });

    // Group by mode
    const statsByMode = attempts.reduce((acc: any, att) => {
      if (!acc[att.mode]) acc[att.mode] = { attempts: 0, totalAccuracy: 0, history: [] };
      acc[att.mode].attempts += 1;
      acc[att.mode].totalAccuracy += att.accuracy;
      acc[att.mode].history.push(att.accuracy);
      return acc;
    }, {});

    // Format for frontend
    const formattedStats = Object.keys(statsByMode).map(mode => ({
      mode,
      averageAccuracy: Math.round(statsByMode[mode].totalAccuracy / statsByMode[mode].attempts),
      trend: statsByMode[mode].history
    }));

    res.json(formattedStats);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get recent activity feed
export const getUserFeed = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const activities = await prisma.userActivity.findMany({
      where: { userId: id },
      orderBy: { timestamp: 'desc' },
      take: 10
    });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get weak areas and recommendations
export const getUserRecommendations = async (req: Request, res: Response) => {
  try {
    // In a real system, this would analyze low scores.
    res.json({
      weakAreas: ['Graph Traversals', 'Dynamic Programming State Design'],
      recommendations: [
        { type: 'learn', title: 'Continue learning Graphs', link: '/explore' },
        { type: 'practice', title: 'Try a Timed Challenge on Trees', link: '/practice/timed-challenges' }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
