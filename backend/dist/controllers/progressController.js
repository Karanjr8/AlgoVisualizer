"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProgress = exports.getProgress = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const zod_1 = require("zod");
const getProgress = async (req, res) => {
    try {
        const userId = req.userId;
        const progress = await prisma_1.default.progress.findMany({
            where: { userId },
        });
        res.json({ progress });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getProgress = getProgress;
const updateProgressSchema = zod_1.z.object({
    completed: zod_1.z.boolean().optional(),
    score: zod_1.z.number().optional(),
});
const updateProgress = async (req, res) => {
    try {
        const userId = req.userId;
        const algorithmId = req.params.algorithmId;
        const { completed, score } = updateProgressSchema.parse(req.body);
        const progress = await prisma_1.default.progress.upsert({
            where: {
                userId_algorithmId: {
                    userId,
                    algorithmId,
                },
            },
            update: {
                completed: completed !== undefined ? completed : undefined,
                score: score !== undefined ? score : undefined,
                lastAccessed: new Date(),
            },
            create: {
                userId,
                algorithmId,
                completed: completed || false,
                score: score || 0,
            },
        });
        res.json({ progress });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.issues });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.updateProgress = updateProgress;
