import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error.middleware';
import repositoryRoutes from './routes/repository.routes';
import memoryRoutes from './routes/memory.routes';
import scoreRoutes from './routes/score.routes';
import documentationRoutes from './routes/documentation.routes';
import agentRoutes from './routes/agent.routes';
import gitlabRoutes from './routes/gitlab.routes';
import missionsRoutes from './routes/missions.routes';
import interviewRoutes from './routes/interview.routes';
import freelancerRescueRoutes from './routes/freelancer-rescue.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/v1/repositories', repositoryRoutes);
app.use('/api/v1/memory', memoryRoutes);
app.use('/api/v1', scoreRoutes); // intelligence, architecture, scores, risks, ownership, health
app.use('/api/v1/documentation', documentationRoutes);
app.use('/api/v1/agent', agentRoutes);
app.use('/api/v1/gitlab', gitlabRoutes);
app.use('/api/v1/missions', missionsRoutes);
app.use('/api/v1/interview', interviewRoutes);
app.use('/api/v1/freelancer-rescue', freelancerRescueRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'CodebaseOS API is running', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

export default app;