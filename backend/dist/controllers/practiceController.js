"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.savePracticeAttempt = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const savePracticeAttempt = async (req, res) => {
    try {
        const { userId, mode, difficulty, score, accuracy, completionTime } = req.body;
        const attempt = await prisma.practiceAttempt.create({
            data: {
                userId,
                mode,
                difficulty,
                score,
                accuracy,
                completionTime
            }
        });
        res.status(201).json(attempt);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to save practice attempt' });
    }
};
exports.savePracticeAttempt = savePracticeAttempt;
