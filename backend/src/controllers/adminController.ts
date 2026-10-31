import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middlewares/auth';
import { z } from 'zod';

// Get all users (for Admin User Management tab)
export const getUsers = async (_req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        name: true,
        email: true,
        username: true,
        role: true,
        avatar: true,
        lastLogin: true,
        currentStreak: true,
        longestStreak: true,
        learningHours: true,
        xp: true,
        level: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.json({ users });
  } catch (error) {
    console.error('Admin getUsers error:', error);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Update user role (USER, ADMIN, etc.)
const updateRoleSchema = z.object({
  role: z.string().min(1),
});

export const updateUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const { role } = updateRoleSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });

    return res.json({ message: 'User role updated successfully', user: updatedUser });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues[0]?.message || 'Invalid role' });
    }
    console.error('Admin updateUserRole error:', error);
    return res.status(500).json({ error: 'Failed to update user role' });
  }
};

// Delete user account
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.userId as string;

    // Prevent self deletion if admin is targeting themselves
    if (req.userId === userId) {
      return res.status(400).json({ error: 'You cannot delete your own admin account' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Cascade clean user relations first
    await prisma.$transaction([
      prisma.userEvent.deleteMany({ where: { userId } }),
      prisma.userAchievement.deleteMany({ where: { userId } }),
      prisma.userActivity.deleteMany({ where: { userId } }),
      prisma.progress.deleteMany({ where: { userId } }),
      prisma.practiceAttempt.deleteMany({ where: { userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ]);

    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Admin deleteUser error:', error);
    return res.status(500).json({ error: 'Failed to delete user' });
  }
};

// Get Platform Statistics & Analytics
export const getPlatformAnalytics = async (_req: AuthRequest, res: Response) => {
  try {
    const [
      totalUsers,
      adminCount,
      totalAlgorithms,
      totalQuestions,
      totalProgressEntries,
      totalPracticeAttempts,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.algorithm.count(),
      prisma.question.count(),
      prisma.progress.count({ where: { completed: true } }),
      prisma.practiceAttempt.count(),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, fullName: true, email: true, role: true, createdAt: true },
      }),
    ]);

    const activeUsersToday = await prisma.user.count({
      where: {
        lastActiveDate: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });

    return res.json({
      stats: {
        totalUsers,
        adminCount,
        regularUsers: totalUsers - adminCount,
        activeUsersToday,
        totalAlgorithms,
        totalQuestions,
        totalCompletedTopics: totalProgressEntries,
        totalPracticeAttempts,
      },
      recentUsers,
    });
  } catch (error) {
    console.error('Admin getPlatformAnalytics error:', error);
    return res.status(500).json({ error: 'Failed to fetch platform analytics' });
  }
};

// Create new Topic / Algorithm
export const createTopic = async (req: AuthRequest, res: Response) => {
  try {
    const { name, slug, category, difficulty, complexity, introduction, intuition, interviewNotes } = req.body;
    if (!name || !slug || !category) {
      return res.status(400).json({ error: 'Name, slug, and category are required' });
    }

    const newAlgo = await prisma.algorithm.create({
      data: {
        name,
        slug: slug.toLowerCase().replace(/\s+/g, '-'),
        category,
        difficulty: difficulty || 'Medium',
        complexity: JSON.stringify(complexity || { time: 'O(N)', space: 'O(1)' }),
        introduction: introduction || '',
        intuition: intuition || '',
        interviewNotes: interviewNotes || '',
        relatedTopics: '[]',
        visualizationType: 'array',
      },
    });

    return res.status(201).json(newAlgo);
  } catch (error) {
    console.error('Admin createTopic error:', error);
    return res.status(500).json({ error: 'Failed to create topic' });
  }
};

// Create new Practice Question
export const createQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { title, difficulty, topic, pattern, statement, hints, solution, expectedComplexity } = req.body;
    if (!title || !topic || !statement) {
      return res.status(400).json({ error: 'Title, topic, and statement are required' });
    }

    const question = await prisma.question.create({
      data: {
        title,
        difficulty: difficulty || 'Easy',
        topic,
        pattern: pattern || 'Standard',
        statement,
        hints: JSON.stringify(hints || []),
        solution: solution || '',
        expectedComplexity: expectedComplexity || 'O(N)',
        tags: JSON.stringify([topic, difficulty]),
      },
    });

    return res.status(201).json(question);
  } catch (error) {
    console.error('Admin createQuestion error:', error);
    return res.status(500).json({ error: 'Failed to create question' });
  }
};
