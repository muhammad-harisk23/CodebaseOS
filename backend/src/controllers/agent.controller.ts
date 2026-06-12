import { Request, Response, NextFunction } from 'express';
import { agentService } from '../services/agent/agent.service';

export const agentController = {
  async run(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await agentService.runAgent(req.params.repositoryId as string);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async getStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const status = await agentService.getAgentStatus(req.params.repositoryId as string);
      res.json({ success: true, data: status });
    } catch (error) {
      next(error);
    }
  },

  async getTimeline(req: Request, res: Response, next: NextFunction) {
    try {
      const timeline = await agentService.getAgentTimeline(req.params.repositoryId as string);
      res.json({ success: true, data: timeline });
    } catch (error) {
      next(error);
    }
  },

  async getFeed(req: Request, res: Response, next: NextFunction) {
    try {
      const feed = await agentService.getAgentFeed(req.params.repositoryId as string);
      res.json({ success: true, data: feed });
    } catch (error) {
      next(error);
    }
  },

  async getActionHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const history = await agentService.getAgentActionHistory(req.params.repositoryId as string);
      res.json({ success: true, data: history });
    } catch (error) {
      next(error);
    }
  },

  async getRecommendations(req: Request, res: Response, next: NextFunction) {
    try {
      const recommendations = await agentService.getAgentRecommendations(req.params.repositoryId as string);
      res.json({ success: true, data: recommendations });
    } catch (error) {
      next(error);
    }
  },
};