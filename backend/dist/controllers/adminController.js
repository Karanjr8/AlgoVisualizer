"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQuestion = exports.createTopic = exports.getPlatformAnalytics = exports.deleteUser = exports.updateUserRole = exports.getUsers = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const zod_1 = require("zod");
// Get all users (for Admin User Management tab)
const getUsers = async (_req, res) => {
    try {
        const users = await prisma_1.default.user.findMany({
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
    }
    catch (error) {
        console.error('Admin getUsers error:', error);
        return res.status(500).json({ error: 'Failed to fetch users' });
    }
};
exports.getUsers = getUsers;
// Update user role (USER, ADMIN, etc.)
const updateRoleSchema = zod_1.z.object({
    role: zod_1.z.string().min(1),
});
const updateUserRole = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { role } = updateRoleSchema.parse(req.body);
        const user = await prisma_1.default.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const updatedUser = await prisma_1.default.user.update({
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
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.issues[0]?.message || 'Invalid role' });
        }
        console.error('Admin updateUserRole error:', error);
        return res.status(500).json({ error: 'Failed to update user role' });
    }
};
exports.updateUserRole = updateUserRole;
// Delete user account
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        // Prevent self deletion if admin is targeting themselves
        if (req.userId === userId) {
            return res.status(400).json({ error: 'You cannot delete your own admin account' });
        }
        const user = await prisma_1.default.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Cascade clean user relations first
        await prisma_1.default.$transaction([
            prisma_1.default.userEvent.deleteMany({ where: { userId } }),
            prisma_1.default.userAchievement.deleteMany({ where: { userId } }),
            prisma_1.default.userActivity.deleteMany({ where: { userId } }),
            prisma_1.default.progress.deleteMany({ where: { userId } }),
            prisma_1.default.practiceAttempt.deleteMany({ where: { userId } }),
            prisma_1.default.user.delete({ where: { id: userId } }),
        ]);
        return res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        console.error('Admin deleteUser error:', error);
        return res.status(500).json({ error: 'Failed to delete user' });
    }
};
exports.deleteUser = deleteUser;
// Get Platform Statistics & Analytics
const getPlatformAnalytics = async (_req, res) => {
    try {
        const [totalUsers, adminCount, totalAlgorithms, totalQuestions, totalProgressEntries, totalPracticeAttempts, recentUsers,] = await Promise.all([
            prisma_1.default.user.count(),
            prisma_1.default.user.count({ where: { role: 'ADMIN' } }),
            prisma_1.default.algorithm.count(),
            prisma_1.default.question.count(),
            prisma_1.default.progress.count({ where: { completed: true } }),
            prisma_1.default.practiceAttempt.count(),
            prisma_1.default.user.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: { id: true, fullName: true, email: true, role: true, createdAt: true },
            }),
        ]);
        const activeUsersToday = await prisma_1.default.user.count({
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
    }
    catch (error) {
        console.error('Admin getPlatformAnalytics error:', error);
        return res.status(500).json({ error: 'Failed to fetch platform analytics' });
    }
};
exports.getPlatformAnalytics = getPlatformAnalytics;
// Create new Topic / Algorithm
const createTopic = async (req, res) => {
    try {
        const { name, slug, category, difficulty, complexity, introduction, intuition, interviewNotes } = req.body;
        if (!name || !slug || !category) {
            return res.status(400).json({ error: 'Name, slug, and category are required' });
        }
        const newAlgo = await prisma_1.default.algorithm.create({
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
    }
    catch (error) {
        console.error('Admin createTopic error:', error);
        return res.status(500).json({ error: 'Failed to create topic' });
    }
};
exports.createTopic = createTopic;
// Create new Practice Question
const createQuestion = async (req, res) => {
    try {
        const { title, difficulty, topic, pattern, statement, hints, solution, expectedComplexity } = req.body;
        if (!title || !topic || !statement) {
            return res.status(400).json({ error: 'Title, topic, and statement are required' });
        }
        const question = await prisma_1.default.question.create({
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
    }
    catch (error) {
        console.error('Admin createQuestion error:', error);
        return res.status(500).json({ error: 'Failed to create question' });
    }
};
exports.createQuestion = createQuestion;
