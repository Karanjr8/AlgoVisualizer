"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuestionById = exports.getAllQuestions = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllQuestions = async (req, res) => {
    try {
        const questions = await prisma.question.findMany();
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
        const question = await prisma.question.findUnique({
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
