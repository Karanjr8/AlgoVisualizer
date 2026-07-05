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

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/algorithms', algorithmRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/search', searchRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;
