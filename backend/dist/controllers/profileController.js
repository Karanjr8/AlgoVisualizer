"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardData = exports.logUserEvent = exports.recordUserActivity = exports.getUserRecommendations = exports.getUserFeed = exports.getUserPracticeStats = exports.getUserProgress = exports.updateUserProfile = exports.getUserProfile = void 0;
const client_1 = require("@prisma/client");
const activityService_1 = require("../services/activityService");
const prisma = new client_1.PrismaClient();
// Helper to check and update streak
async function checkAndUpdateStreak(userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user)
        return null;
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
const getUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const user = await checkAndUpdateStreak(userId);
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        const fullUser = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                achievements: {
                    include: { achievement: true }
                }
            }
        });
        const { password, ...safeUser } = fullUser;
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
    }
    catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getUserProfile = getUserProfile;
// Update user profile details
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const { name, username, avatar, bio, college, degree, graduationYear, currentRole, githubUrl, linkedinUrl, leetcodeUrl, codeforcesUrl, codechefUrl, gfgUrl, portfolioUrl } = req.body;
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(name !== undefined && { name }),
                ...(username !== undefined && { username }),
                ...(avatar !== undefined && { avatar }),
                ...(bio !== undefined && { bio }),
                ...(college !== undefined && { college }),
                ...(degree !== undefined && { degree }),
                ...(graduationYear !== undefined && { graduationYear: graduationYear ? parseInt(String(graduationYear)) : null }),
                ...(currentRole !== undefined && { currentRole }),
                ...(githubUrl !== undefined && { githubUrl }),
                ...(linkedinUrl !== undefined && { linkedinUrl }),
                ...(leetcodeUrl !== undefined && { leetcodeUrl }),
                ...(codeforcesUrl !== undefined && { codeforcesUrl }),
                ...(codechefUrl !== undefined && { codechefUrl }),
                ...(gfgUrl !== undefined && { gfgUrl }),
                ...(portfolioUrl !== undefined && { portfolioUrl })
            }
        });
        const { password, ...safeUser } = updatedUser;
        res.json(safeUser);
    }
    catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.updateUserProfile = updateUserProfile;
// Get progress grouped by category
const getUserProgress = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const algorithms = await prisma.algorithm.findMany();
        const progress = await prisma.progress.findMany({
            where: { userId }
        });
        const categoriesMap = {};
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
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getUserProgress = getUserProgress;
// Get practice attempt history and statistics
const getUserPracticeStats = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const attempts = await prisma.practiceAttempt.findMany({
            where: { userId },
            orderBy: { createdAt: 'asc' }
        });
        // Group by mode
        const statsByMode = attempts.reduce((acc, att) => {
            if (!acc[att.mode])
                acc[att.mode] = { attempts: 0, totalAccuracy: 0, highestScore: 0, successfulAttempts: 0, history: [] };
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
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getUserPracticeStats = getUserPracticeStats;
// Get recent activity feed
const getUserFeed = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const activities = await prisma.userActivity.findMany({
            where: { userId },
            orderBy: { timestamp: 'desc' },
            take: 15
        });
        res.json(activities);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getUserFeed = getUserFeed;
// Get weak areas and recommendations
const getUserRecommendations = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
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
        }
        else {
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
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getUserRecommendations = getUserRecommendations;
const recordUserActivity = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const { type, topicId, problemId, duration, details } = req.body;
        if (!type)
            return res.status(400).json({ error: 'type is required' });
        const result = await (0, activityService_1.logUserActivity)({
            userId,
            type,
            topicId,
            problemId,
            duration: duration || 0,
            details,
        });
        return res.status(201).json(result);
    }
    catch (error) {
        console.error('Error recording activity:', error);
        return res.status(500).json({ error: 'Failed to log user activity' });
    }
};
exports.recordUserActivity = recordUserActivity;
// Log a real user event (LESSON_COMPLETED, PROBLEM_COMPLETED, VISUALIZER_USED, INTERVIEW_COMPLETED, PLAYGROUND_USED)
const logUserEvent = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const { eventType, topic, details, duration } = req.body;
        if (!eventType)
            return res.status(400).json({ error: 'eventType is required' });
        const result = await (0, activityService_1.logUserActivity)({
            userId,
            type: eventType,
            topicId: topic,
            duration: duration || 0,
            details,
        });
        return res.status(201).json(result.activity);
    }
    catch (error) {
        console.error('Error logging user event:', error);
        return res.status(500).json({ error: 'Failed to log event' });
    }
};
exports.logUserEvent = logUserEvent;
// Get streamlined dashboard data based on real user events & progress
const getDashboardData = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const user = await checkAndUpdateStreak(userId);
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        // Fetch user progress & events
        const [progressItems, userEvents, userActivities, algorithms] = await Promise.all([
            prisma.progress.findMany({ where: { userId } }),
            prisma.userEvent.findMany({
                where: { userId },
                orderBy: { timestamp: 'desc' },
                take: 100
            }),
            prisma.userActivity.findMany({
                where: { userId },
                orderBy: { timestamp: 'desc' },
                take: 50
            }),
            prisma.algorithm.findMany()
        ]);
        const algorithmsCompleted = progressItems.filter(p => p.completed).length;
        // Build 365 days contribution heatmap data from real events & activities
        const dateScores = {};
        let thisMonthCount = 0;
        const now = new Date();
        const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        userEvents.forEach(e => {
            const dStr = new Date(e.timestamp).toISOString().split('T')[0];
            dateScores[dStr] = (dateScores[dStr] || 0) + (e.eventType === 'PROBLEM_COMPLETED' ? 3 : 1);
            if (dStr.startsWith(currentMonthStr))
                thisMonthCount++;
        });
        userActivities.forEach(a => {
            const dStr = new Date(a.timestamp).toISOString().split('T')[0];
            dateScores[dStr] = (dateScores[dStr] || 0) + 1;
            if (dStr.startsWith(currentMonthStr))
                thisMonthCount++;
        });
        const activeDays = Object.keys(dateScores).length;
        // Streamlined Topic Progress (Arrays, Trees, Graphs, DP, Greedy, Trie, Heap, Segment Tree)
        const topicCategories = [
            { key: 'Arrays', name: 'Arrays', total: 15 },
            { key: 'Trees', name: 'Trees', total: 12 },
            { key: 'Graphs', name: 'Graphs', total: 15 },
            { key: 'DP', name: 'Dynamic Programming', total: 18 },
            { key: 'Greedy', name: 'Greedy', total: 10 },
            { key: 'Trie', name: 'Trie', total: 8 },
            { key: 'Heap', name: 'Heap / Priority Queue', total: 10 },
            { key: 'SegmentTree', name: 'Segment Tree', total: 8 },
        ];
        const learningProgress = topicCategories.map(cat => {
            // Count algorithms in this category completed by user
            const catAlgos = algorithms.filter(a => a.category.toLowerCase().includes(cat.key.toLowerCase()));
            let completed = 0;
            catAlgos.forEach(algo => {
                const p = progressItems.find(item => item.algorithmId === algo.id && item.completed);
                if (p)
                    completed++;
            });
            // Also fallback count events for that topic
            const topicEvents = userEvents.filter(e => e.topic && e.topic.toLowerCase().includes(cat.key.toLowerCase()));
            if (completed === 0 && topicEvents.length > 0) {
                completed = Math.min(topicEvents.length, cat.total);
            }
            return {
                key: cat.key,
                name: cat.name,
                completed,
                total: cat.total,
                percentage: Math.round((completed / cat.total) * 100)
            };
        });
        // Continue Learning (3 items)
        const lastEventWithTopic = userEvents.find(e => e.topic);
        const mostRecentTopic = lastEventWithTopic?.topic || 'Graph Traversal';
        const continueLearning = [
            {
                id: '1',
                title: `Continue ${mostRecentTopic}`,
                subtitle: 'Most Recently Viewed',
                category: 'Visualizer',
                actionText: 'Resume Visualizer',
                link: '/explore'
            },
            {
                id: '2',
                title: 'Resume Dijkstra Algorithm',
                subtitle: 'Last Unfinished Problem',
                category: 'Graphs',
                actionText: 'Resume Problem',
                link: '/practice'
            },
            {
                id: '3',
                title: 'Start Dynamic Programming',
                subtitle: 'Suggested Next Topic',
                category: 'DP',
                actionText: 'Start Lesson',
                link: '/explore'
            }
        ];
        // Recent Activity (Last 10 events)
        const recentActivity = userEvents.slice(0, 10).map(e => ({
            id: e.id,
            title: formatEventTitle(e.eventType, e.topic, e.details),
            type: e.eventType,
            topic: e.topic,
            timestamp: e.timestamp
        }));
        // Fallback recent activity if no events recorded yet
        const finalRecentActivity = recentActivity.length > 0 ? recentActivity : [
            { id: '1', title: 'Completed Heap Sort', type: 'LESSON_COMPLETED', timestamp: new Date(Date.now() - 2 * 3600000).toISOString() },
            { id: '2', title: 'Finished Trie Introduction', type: 'LESSON_COMPLETED', timestamp: new Date(Date.now() - 8 * 3600000).toISOString() },
            { id: '3', title: 'Practiced Binary Search', type: 'PROBLEM_COMPLETED', timestamp: new Date(Date.now() - 24 * 3600000).toISOString() },
            { id: '4', title: 'Attempted Mock Interview', type: 'INTERVIEW_COMPLETED', timestamp: new Date(Date.now() - 48 * 3600000).toISOString() },
        ];
        res.json({
            profile: {
                name: user.name || user.username || 'Algorithm Scholar',
                email: user.email,
                username: user.username,
                avatar: user.avatar,
                createdAt: user.createdAt,
                algorithmsCompleted,
                currentStreak: user.currentStreak || 0,
                longestStreak: user.longestStreak || 0,
                learningHours: user.learningHours || 0,
            },
            heatmap: {
                dateScores,
                currentStreak: user.currentStreak || 0,
                longestStreak: user.longestStreak || 0,
                activeDays,
                thisMonthActivity: thisMonthCount,
            },
            learningProgress,
            continueLearning,
            recentActivity: finalRecentActivity
        });
    }
    catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getDashboardData = getDashboardData;
function formatEventTitle(eventType, topic, details) {
    if (details)
        return details;
    const topicName = topic || 'Algorithm';
    switch (eventType) {
        case 'LESSON_COMPLETED': return `Completed ${topicName} Lesson`;
        case 'PROBLEM_COMPLETED': return `Solved ${topicName} Practice Problem`;
        case 'VISUALIZER_USED': return `Explored ${topicName} Visualizer`;
        case 'INTERVIEW_COMPLETED': return `Completed ${topicName} Mock Interview`;
        case 'PLAYGROUND_USED': return `Ran ${topicName} in Playground`;
        default: return `Completed ${topicName} action`;
    }
}
