"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuestionById = exports.getAllQuestions = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getAllQuestions = async (req, res) => {
    try {
        const questions = await prisma_1.default.question.findMany();
        res.json(questions);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
};
exports.getAllQuestions = getAllQuestions;
const getQuestionById = async (req, res) => {
    try {
        const { id } = req.params;
        const question = await prisma_1.default.question.findUnique({
            where: { id: id }
        });
        if (!question)
            return res.status(404).json({ error: 'Question not found' });
        res.json(question);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch question' });
    }
};
exports.getQuestionById = getQuestionById;
