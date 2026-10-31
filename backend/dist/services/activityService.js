"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logUserActivity = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const logUserActivity = async (payload) => {
    const { userId, type, topicId, problemId, duration = 0, details } = payload;
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    // 1. Create UserActivity record
    const activity = await prisma_1.default.userActivity.create({
        data: {
            userId,
            action: type,
            description: details || formatActivityDescription(type, topicId, problemId),
            topicId: topicId || null,
            problemId: problemId || null,
            duration: duration || 0,
            timestamp: now,
        },
    });
    // 2. Handle specific completions
    if (type === 'TOPIC_COMPLETED' && topicId) {
        await prisma_1.default.userTopicCompletion.upsert({
            where: {
                userId_topicId: { userId, topicId },
            },
            update: { completedAt: now },
            create: { userId, topicId, completedAt: now },
        });
        // Also sync with Progress model
        await prisma_1.default.progress.upsert({
            where: {
                userId_algorithmId: { userId, algorithmId: topicId },
            },
            update: { completed: true, lastAccessed: now },
            create: { userId, algorithmId: topicId, completed: true, lastAccessed: now },
        });
    }
    if (type === 'PROBLEM_COMPLETED' && problemId) {
        await prisma_1.default.userProblemCompletion.upsert({
            where: {
                userId_problemId: { userId, problemId },
            },
            update: { completedAt: now, score: 100 },
            create: { userId, problemId, score: 100, completedAt: now },
        });
    }
    // 3. Recalculate streak & active days metrics
    const user = await prisma_1.default.user.findUnique({ where: { id: userId } });
    let currentStreak = user?.currentStreak || 0;
    let longestStreak = user?.longestStreak || 0;
    if (user) {
        const todayZero = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (user.lastActiveDate) {
            const lastActive = new Date(user.lastActiveDate);
            const lastActiveZero = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
            const diffTime = todayZero.getTime() - lastActiveZero.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
                // Consecutive day
                currentStreak += 1;
            }
            else if (diffDays > 1) {
                // Missed a day -> reset streak to 1 for today
                currentStreak = 1;
            }
            else if (diffDays === 0 && currentStreak === 0) {
                currentStreak = 1;
            }
        }
        else {
            currentStreak = 1;
        }
        longestStreak = Math.max(longestStreak, currentStreak);
        // Accumulated learning hours (increment by duration in hours, min 0.05 hrs ~ 3 mins if duration not sent)
        const hoursToAdd = duration > 0 ? duration / 3600 : 0.05;
        await prisma_1.default.user.update({
            where: { id: userId },
            data: {
                currentStreak,
                longestStreak,
                lastActiveDate: now,
                learningHours: { increment: hoursToAdd },
                xp: { increment: type.includes('COMPLETED') ? 50 : 15 },
            },
        });
    }
    // 4. Calculate active days this month, year, and lifetime from unique activity dates
    const userActivities = await prisma_1.default.userActivity.findMany({
        where: { userId },
        select: { timestamp: true },
    });
    const uniqueDates = new Set(userActivities.map((a) => a.timestamp.toISOString().split('T')[0]));
    const currentYear = now.getFullYear();
    const currentMonthStr = `${currentYear}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    let activeDaysThisMonth = 0;
    let activeDaysThisYear = 0;
    uniqueDates.forEach((dStr) => {
        if (dStr.startsWith(currentMonthStr))
            activeDaysThisMonth++;
        if (dStr.startsWith(String(currentYear)))
            activeDaysThisYear++;
    });
    const totalActiveDays = uniqueDates.size;
    // Upsert UserStreak record
    await prisma_1.default.userStreak.upsert({
        where: { userId },
        update: {
            currentStreak,
            longestStreak,
            activeDaysThisMonth,
            activeDaysThisYear,
            totalActiveDays,
            lastActiveDate: now,
        },
        create: {
            userId,
            currentStreak,
            longestStreak,
            activeDaysThisMonth,
            activeDaysThisYear,
            totalActiveDays,
            lastActiveDate: now,
        },
    });
    return {
        activity,
        stats: {
            currentStreak,
            longestStreak,
            activeDaysThisMonth,
            activeDaysThisYear,
            totalActiveDays,
            todayDate: dateStr,
        },
    };
};
exports.logUserActivity = logUserActivity;
function formatActivityDescription(type, topicId, problemId) {
    const topicName = topicId ? topicId.replace(/-/g, ' ') : 'Algorithm';
    const problemName = problemId ? problemId.replace(/-/g, ' ') : 'Problem';
    switch (type) {
        case 'TOPIC_OPENED': return `Explored ${topicName}`;
        case 'TOPIC_COMPLETED': return `Mastered ${topicName} topic`;
        case 'PROBLEM_OPENED': return `Viewed problem ${problemName}`;
        case 'PROBLEM_COMPLETED': return `Solved problem ${problemName}`;
        case 'VISUALIZER_USED': return `Interacted with ${topicName} visualizer`;
        case 'PRACTICE_COMPLETED': return `Finished practice session on ${topicName}`;
        case 'INTERVIEW_COMPLETED': return `Completed mock interview simulation`;
        case 'ROADMAP_MILESTONE': return `Reached roadmap milestone in ${topicName}`;
        case 'PLAYGROUND_USED': return `Ran algorithm code in Playground`;
        default: return `Completed learning activity`;
    }
}
