import { Request, Response, NextFunction } from 'express';
import { documentationService } from '../services/documentation/documentation.service';

export const documentationController = {
  async generate(req: Request, res: Response, next: NextFunction) {
    try {
      const { type } = req.body;
      const doc = await documentationService.generateDocumentation(req.params.repositoryId as string, type || 'README');
      res.json({ success: true, data: doc });
    } catch (error) {
      next(error);
    }
  },

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const docs = await documentationService.getDocumentation(req.params.repositoryId as string);
      res.json({ success: true, data: docs });
    } catch (error) {
      next(error);
    }
  },

  async export(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await documentationService.exportDocumentation(req.params.repositoryId as string);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async generateMissions(req: Request, res: Response, next: NextFunction) {
    try {
      const missions = await documentationService.generateLearningMissions(req.params.repositoryId as string);
      res.json({ success: true, data: missions });
    } catch (error) {
      next(error);
    }
  },

  async getMissions(req: Request, res: Response, next: NextFunction) {
    try {
      const missions = await documentationService.getLearningMissions(req.params.repositoryId as string);
      res.json({ success: true, data: missions });
    } catch (error) {
      next(error);
    }
  },

  async completeMission(req: Request, res: Response, next: NextFunction) {
    try {
      const mission = await documentationService.completeMission(req.params.missionId as string);
      res.json({ success: true, data: mission });
    } catch (error) {
      next(error);
    }
  },

  async startInterview(req: Request, res: Response, next: NextFunction) {
    try {
      const interview = await documentationService.startInterview(req.params.repositoryId as string);
      res.json({ success: true, data: interview });
    } catch (error) {
      next(error);
    }
  },

  async submitAnswer(req: Request, res: Response, next: NextFunction) {
    try {
      const { questionIndex, answer } = req.body;
      const interview = await documentationService.submitAnswer(req.params.interviewId as string, questionIndex, answer);
      res.json({ success: true, data: interview });
    } catch (error) {
      next(error);
    }
  },

  async getInterviewResults(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await documentationService.getInterviewResults(req.params.interviewId as string);
      res.json({ success: true, data: results });
    } catch (error) {
      next(error);
    }
  },

  async generateRescueReport(req: Request, res: Response, next: NextFunction) {
    try {
      const report = await documentationService.generateRescueReport(req.params.repositoryId as string);
      res.json({ success: true, data: report });
    } catch (error) {
      next(error);
    }
  },
};