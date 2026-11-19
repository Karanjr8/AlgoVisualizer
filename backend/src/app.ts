import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes';
import progressRoutes from './routes/progressRoutes';
import chatbotRoutes from './routes/chatbotRoutes';
import algorithmRoutes from './routes/algorithmRoutes';
import questionRoutes from './routes/questionRoutes';
import roadmapRoutes from './routes/roadmapRoutes';
import achievementRoutes from './routes/achievementRoutes';
import practiceRoutes from './routes/practiceRoutes';
import profileRoutes from './routes/profileRoutes';
import searchRoutes from './routes/searchRoutes';
import adminRoutes from './routes/adminRoutes';
import interviewRoutes from './routes/interviewRoutes';

const app = express();

app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/algorithms', algorithmRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/interviews', interviewRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;
