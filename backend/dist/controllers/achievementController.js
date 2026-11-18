"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAchievements = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getAllAchievements = async (req, res) => {
    try {
        const achievements = await prisma_1.default.achievement.findMany();
        res.json(achievements);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch achievements' });
    }
};
exports.getAllAchievements = getAllAchievements;
