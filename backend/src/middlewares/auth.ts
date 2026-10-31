import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import prisma from '../utils/prisma';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyToken(token);
    req.userId = payload.userId;
    req.userRole = payload.role || 'USER';

    // Verify user exists in database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, role: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User no longer exists' });
    }

    req.userRole = user.role;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyToken(token);
    req.userId = payload.userId;
    req.userRole = payload.role || 'USER';
  } catch {
    // Invalid/expired token in optional auth is ignored gracefully
  }
  next();
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.userRole || req.userRole !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Admin privilege required' });
  }
  next();
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.userRole || !allowedRoles.includes(req.userRole)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};

