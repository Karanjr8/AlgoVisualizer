import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';
import { z } from 'zod';
import crypto from 'crypto';

const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  name: z.string().optional(),
  fullName: z.string().optional(),
  username: z.string().optional(),
});

function sanitizeUser(user: any) {
  return {
    id: user.id,
    fullName: user.fullName || user.name || user.username || user.email.split('@')[0],
    name: user.name || user.fullName,
    username: user.username,
    email: user.email,
    role: user.role || 'USER',
    avatar: user.avatar,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    lastLogin: user.lastLogin,
    streak: user.currentStreak || 0,
    longestStreak: user.longestStreak || 0,
    completedTopics: user.completedTopics ? JSON.parse(user.completedTopics) : [],
    completedProblems: user.completedProblems ? JSON.parse(user.completedProblems) : [],
    progressData: user.progressData ? JSON.parse(user.progressData) : {},
    isEmailVerified: user.isEmailVerified || false,
    learningHours: user.learningHours || 0,
    xp: user.xp || 0,
    level: user.level || 1,
  };
}

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, fullName, username } = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const displayName = fullName || name || email.split('@')[0];
    const userUsername = username || displayName.toLowerCase().replace(/\s+/g, '_') + '_' + Math.floor(Math.random() * 1000);

    const hashedPassword = await hashPassword(password);
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name: displayName,
        fullName: displayName,
        username: userUsername,
        role: 'USER',
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: new Date(),
        lastLogin: new Date(),
        emailVerificationToken,
        isEmailVerified: false,
      },
    });

    const token = generateToken(user.id, user.role);
    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues[0]?.message || 'Validation error' });
    }
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Failed to create account. Please try again.' });
  }
};

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update lastLogin timestamp in database
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLogin: new Date(),
        lastActiveDate: new Date(),
      },
    });

    const token = generateToken(updatedUser.id, updatedUser.role);
    return res.json({
      message: 'Logged in successfully',
      token,
      user: sanitizeUser(updatedUser),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues[0]?.message || 'Validation error' });
    }
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
};

export const logout = async (_req: Request, res: Response) => {
  return res.json({ message: 'Logged out successfully' });
};

export const getMe = async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User session not found' });
    }

    return res.json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error('getMe error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) {
      return res.json({ message: 'If an account exists with this email, recovery instructions have been generated.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour validity

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires,
      },
    });

    return res.json({
      message: 'Password reset token generated successfully.',
      resetToken, // For simulation/dev testing
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ error: 'Failed to process request' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired password reset token' });
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    return res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ error: 'Failed to reset password' });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' });
    }

    const user = await prisma.user.findFirst({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid verification token' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
      },
    });

    return res.json({ message: 'Email address verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(500).json({ error: 'Failed to verify email' });
  }
};

