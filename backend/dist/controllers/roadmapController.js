"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoadmapNodes = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getRoadmapNodes = async (req, res) => {
    try {
        const nodes = await prisma_1.default.roadmapNode.findMany({
            orderBy: { recommendedOrder: 'asc' }
        });
        res.json(nodes);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch roadmap nodes' });
    }
};
exports.getRoadmapNodes = getRoadmapNodes;
