"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.savePracticeAttempt = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const savePracticeAttempt = async (req, res) => {
    try {
        const { userId, mode, difficulty, score, accuracy, completionTime } = req.body;
        const attempt = await prisma_1.default.practiceAttempt.create({
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
