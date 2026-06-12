import { Request, Response, NextFunction } from 'express';
import { scoringService } from '../services/scoring/scoring.service';
import { repositoryAnalysisService } from '../services/repository-analysis/repository-analysis.service';

export const scoreController = {
  async getIntelligenceReport(req: Request, res: Response, next: NextFunction) {
    try {
      const report = await repositoryAnalysisService.getIntelligenceReport(req.params.repositoryId as string);
      res.json({ success: true, data: report });
    } catch (error) {
      next(error);
    }
  },

  async getFrameworks(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await repositoryAnalysisService.getFrameworks(req.params.repositoryId as string);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async getDependencies(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await repositoryAnalysisService.getDependencies(req.params.repositoryId as string);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async getServices(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await repositoryAnalysisService.getServices(req.params.repositoryId as string);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async getApis(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await repositoryAnalysisService.getApis(req.params.repositoryId as string);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async getKnowledgeDebt(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await scoringService.getKnowledgeDebt(req.params.repositoryId as string);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async getSurvivability(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await scoringService.getSurvivability(req.params.repositoryId as string);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async getRecoverability(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await scoringService.getRecoverability(req.params.repositoryId as string);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async getBusFactor(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await scoringService.getBusFactor(req.params.repositoryId as string);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async getRiskDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await scoringService.getRiskDashboard(req.params.repositoryId as string);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async getRisks(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await scoringService.getRepositoryRisks(req.params.repositoryId as string);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async getCriticalRisks(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await scoringService.getCriticalRisks(req.params.repositoryId as string);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  async getOwnershipMap(req: Request, res: Response, next: NextFunction) {
    try {
      // Simplified: return modules from chunks
      const { RepositoryChunk } = require('../models/RepositoryChunk');
      const chunks = await RepositoryChunk.find({ repositoryId: req.params.repositoryId as string });
      const moduleSet = new Set(chunks.map((c: any) => c.module).filter(Boolean));
      const modules = Array.from(moduleSet) as string[];
      res.json({ success: true, data: { modules: modules.map((m: string) => ({ name: m, ownership: 'Unknown', risk: 'medium' })) } });
    } catch (error) {
      next(error);
    }
  },

  async getModuleOwnership(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({ success: true, data: { module: req.params.moduleId, ownership: 'Unknown', risk: 'medium' } });
    } catch (error) {
      next(error);
    }
  },
};