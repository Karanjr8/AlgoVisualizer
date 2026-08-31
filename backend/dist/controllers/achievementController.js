"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAchievements = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllAchievements = async (req, res) => {
    try {
        const achievements = await prisma.achievement.findMany();
        res.json(achievements);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch achievements' });
    }
};
exports.getAllAchievements = getAllAchievements;
