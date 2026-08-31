"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAlgorithmBySlug = exports.getAllAlgorithms = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllAlgorithms = async (req, res) => {
    try {
        const algorithms = await prisma.algorithm.findMany();
        res.json(algorithms);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch algorithms' });
    }
};
exports.getAllAlgorithms = getAllAlgorithms;
const getAlgorithmBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const algorithm = await prisma.algorithm.findUnique({
            where: { slug: slug }
        });
        if (!algorithm)
            return res.status(404).json({ error: 'Algorithm not found' });
        res.json(algorithm);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch algorithm' });
    }
};
exports.getAlgorithmBySlug = getAlgorithmBySlug;
