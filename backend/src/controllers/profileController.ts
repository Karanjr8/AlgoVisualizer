import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth';

const prisma = new PrismaClient();

// Helper to check and update streak
async function checkAndUpdateStreak(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  let currentStreak = user.currentStreak;
  let longestStreak = user.longestStreak;
  const lastActiveDate = user.lastActiveDate;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (lastActiveDate) {
    const lastActive = new Date(lastActiveDate);
    lastActive.setHours(0, 0, 0, 0);
    
    const diffTime = Math.abs(today.getTime() - lastActive.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) {
      // Streak broken
      currentStreak = 0;
      await prisma.user.update({
        where: { id: userId },
        data: { currentStreak: 0 }
      });
    }
  }

  return { ...user, currentStreak, longestStreak };
}

// Get primary profile details
export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await checkAndUpdateStreak(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const fullUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        achievements: {
          include: { achievement: true }
        }
      }
    });

    const { password, ...safeUser } = fullUser!;
    
    const algorithmsLearned = await prisma.progress.count({
      where: { userId, completed: true }
    });

    const totalAlgorithms = await prisma.algorithm.count();

    const practiceSessions = await prisma.practiceAttempt.count({
      where: { userId }
    });

    const questionsSolved = await prisma.practiceAttempt.count({
      where: { userId, score: { gt: 0 } }
    });

    res.json({
      ...safeUser,
      stats: {
        algorithmsLearned,
        practiceSessions,
        questionsSolved,
        interviewSimulations: await prisma.practiceAttempt.count({
          where: { userId, mode: 'Interview Simulator' }
        }),
        overallProgress: totalAlgorithms > 0 ? Math.round((algorithmsLearned / totalAlgorithms) * 100) : 0,
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update user profile details
export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const {
      name, bio, college, degree, graduationYear, currentRole,
      githubUrl, linkedinUrl, leetcodeUrl, portfolioUrl
    } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name, bio, college, degree, 
        graduationYear: graduationYear ? parseInt(graduationYear) : null,
        currentRole, githubUrl, linkedinUrl, leetcodeUrl, portfolioUrl
      }
    });

    const { password, ...safeUser } = updatedUser;
    res.json(safeUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get progress grouped by category
export const getUserProgress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const algorithms = await prisma.algorithm.findMany();
    const progress = await prisma.progress.findMany({
      where: { userId }
    });

    const categoriesMap: Record<string, { total: number; completed: number }> = {};

    algorithms.forEach(algo => {
      if (!categoriesMap[algo.category]) {
        categoriesMap[algo.category] = { total: 0, completed: 0 };
      }
      categoriesMap[algo.category].total += 1;
      
      const p = progress.find(pr => pr.algorithmId === algo.id);
      if (p && p.completed) {
        categoriesMap[algo.category].completed += 1;
      }
    });

    const results = Object.keys(categoriesMap).map(category => {
      const stats = categoriesMap[category];
      return {
        category,
        topicsCompleted: stats.completed,
        topicsRemaining: stats.total - stats.completed,
        completedPercentage: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
      };
    });
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get practice attempt history and statistics
export const getUserPracticeStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const attempts = await prisma.practiceAttempt.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' }
    });

    // Group by mode
    const statsByMode = attempts.reduce((acc: any, att) => {
      if (!acc[att.mode]) acc[att.mode] = { attempts: 0, totalAccuracy: 0, highestScore: 0, successfulAttempts: 0, history: [] };
      acc[att.mode].attempts += 1;
      acc[att.mode].totalAccuracy += att.accuracy;
      if (att.score > acc[att.mode].highestScore) {
        acc[att.mode].highestScore = att.score;
      }
      if (att.accuracy > 50) {
        acc[att.mode].successfulAttempts += 1;
      }
      acc[att.mode].history.push(att.accuracy);
      return acc;
    }, {});

    // Format for frontend
    const formattedStats = Object.keys(statsByMode).map(mode => ({
      mode,
      attempts: statsByMode[mode].attempts,
      successfulAttempts: statsByMode[mode].successfulAttempts,
      highestScore: statsByMode[mode].highestScore,
      averageAccuracy: Math.round(statsByMode[mode].totalAccuracy / statsByMode[mode].attempts),
      trend: statsByMode[mode].history
    }));

    res.json(formattedStats);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get recent activity feed
export const getUserFeed = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const activities = await prisma.userActivity.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 15
    });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get weak areas and recommendations
export const getUserRecommendations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // Find weak areas based on practice attempts with low accuracy
    const weakAttempts = await prisma.practiceAttempt.findMany({
      where: { userId, accuracy: { lt: 50 } },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    const weakModes = Array.from(new Set(weakAttempts.map(a => a.mode)));
    const weakAreas = weakModes.length > 0 ? weakModes : ['Keep practicing to uncover weak areas!'];

    // Suggest incomplete topics
    const algorithms = await prisma.algorithm.findMany();
    const progress = await prisma.progress.findMany({ where: { userId } });
    
    const incomplete = algorithms.filter(algo => {
      const p = progress.find(pr => pr.algorithmId === algo.id);
      return !p || !p.completed;
    });

    const recommendations = [];
    if (incomplete.length > 0) {
      recommendations.push({
        type: 'learn',
        title: `Continue learning ${incomplete[0].category}`,
        link: '/explore'
      });
    } else {
      recommendations.push({
        type: 'practice',
        title: 'Mastered all topics! Try Timed Challenges',
        link: '/practice/timed-challenges'
      });
    }

    res.json({
      weakAreas,
      recommendations
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
