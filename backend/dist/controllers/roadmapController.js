"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoadmapNodes = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getRoadmapNodes = async (req, res) => {
    try {
        const nodes = await prisma.roadmapNode.findMany({
            orderBy: { recommendedOrder: 'asc' }
        });
        res.json(nodes);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch roadmap nodes' });
    }
};
exports.getRoadmapNodes = getRoadmapNodes;
