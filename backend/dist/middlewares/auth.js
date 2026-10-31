"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.requireAdmin = exports.optionalAuth = exports.requireAuth = void 0;
const jwt_1 = require("../utils/jwt");
const prisma_1 = __importDefault(require("../utils/prisma"));
const requireAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = (0, jwt_1.verifyToken)(token);
        req.userId = payload.userId;
        req.userRole = payload.role || 'USER';
        // Verify user exists in database
        const user = await prisma_1.default.user.findUnique({
            where: { id: payload.userId },
            select: { id: true, role: true }
        });
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized: User no longer exists' });
        }
        req.userRole = user.role;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};
exports.requireAuth = requireAuth;
const optionalAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next();
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = (0, jwt_1.verifyToken)(token);
        req.userId = payload.userId;
        req.userRole = payload.role || 'USER';
    }
    catch {
        // Invalid/expired token in optional auth is ignored gracefully
    }
    next();
};
exports.optionalAuth = optionalAuth;
const requireAdmin = (req, res, next) => {
    if (!req.userRole || req.userRole !== 'ADMIN') {
        return res.status(403).json({ error: 'Forbidden: Admin privilege required' });
    }
    next();
};
exports.requireAdmin = requireAdmin;
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.userRole || !allowedRoles.includes(req.userRole)) {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }
        next();
    };
};
exports.requireRole = requireRole;
