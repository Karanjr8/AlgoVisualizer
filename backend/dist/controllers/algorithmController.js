"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAlgorithmBySlug = exports.getAllAlgorithms = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getAllAlgorithms = async (req, res) => {
    try {
        const algorithms = await prisma_1.default.algorithm.findMany();
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
        const algorithm = await prisma_1.default.algorithm.findUnique({
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
