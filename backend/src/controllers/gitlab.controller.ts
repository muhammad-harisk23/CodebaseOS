import { Request, Response, NextFunction } from 'express';
import { gitlabService } from '../services/gitlab/gitlab.service';

export const gitlabController = {
  async createIssue(req: Request, res: Response, next: NextFunction) {
    try {
      const { repositoryId, title, description, labels } = req.body;
      const issue = await gitlabService.createIssue(repositoryId, title, description, labels);
      res.json({ success: true, data: issue });
    } catch (error) {
      next(error);
    }
  },

  async createDocumentationIssue(req: Request, res: Response, next: NextFunction) {
    try {
      const { repositoryId, moduleName } = req.body;
      const issue = await gitlabService.createDocumentationIssue(repositoryId, moduleName || 'Repository');
      res.json({ success: true, data: issue });
    } catch (error) {
      next(error);
    }
  },

  async createLearningMission(req: Request, res: Response, next: NextFunction) {
    try {
      const { repositoryId, title, objective } = req.body;
      const issue = await gitlabService.createLearningMissionIssue(repositoryId, title, objective);
      res.json({ success: true, data: issue });
    } catch (error) {
      next(error);
    }
  },

  async createOwnershipRiskIssue(req: Request, res: Response, next: NextFunction) {
    try {
      const { repositoryId, moduleName, ownerPercent } = req.body;
      const issue = await gitlabService.createOwnershipRiskIssue(repositoryId, moduleName, ownerPercent || 90);
      res.json({ success: true, data: issue });
    } catch (error) {
      next(error);
    }
  },

  async createSurvivabilityIssue(req: Request, res: Response, next: NextFunction) {
    try {
      const { repositoryId, survivabilityScore } = req.body;
      const issue = await gitlabService.createSurvivabilityIssue(repositoryId, survivabilityScore || 50);
      res.json({ success: true, data: issue });
    } catch (error) {
      next(error);
    }
  },

  async createRecoverabilityIssue(req: Request, res: Response, next: NextFunction) {
    try {
      const { repositoryId, recoverabilityScore } = req.body;
      const issue = await gitlabService.createRecoverabilityIssue(repositoryId, recoverabilityScore || 50);
      res.json({ success: true, data: issue });
    } catch (error) {
      next(error);
    }
  },

  async getActivity(req: Request, res: Response, next: NextFunction) {
    try {
      const activity = await gitlabService.getGitlabActivity(req.params.repositoryId as string);
      res.json({ success: true, data: activity });
    } catch (error) {
      next(error);
    }
  },
};