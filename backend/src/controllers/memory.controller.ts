import { Request, Response, NextFunction } from 'express';
import { memoryEngineService } from '../services/memory/memory-engine.service';
import { Repository } from '../models/Repository';

export const memoryController = {
  async getMemory(req: Request, res: Response, next: NextFunction) {
    try {
      const report = await memoryEngineService.getMemoryReport(req.params.repositoryId as string);
      res.json({ success: true, data: report });
    } catch (error) {
      next(error);
    }
  },

  async getChunks(req: Request, res: Response, next: NextFunction) {
    try {
      const chunks = await memoryEngineService.getRepositoryChunks(req.params.repositoryId as string);
      res.json({ success: true, data: chunks });
    } catch (error) {
      next(error);
    }
  },

  async getChunkDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const chunk = await memoryEngineService.getChunkDetails(req.params.chunkId as string);
      res.json({ success: true, data: chunk });
    } catch (error) {
      next(error);
    }
  },

  async rebuildMemory(req: Request, res: Response, next: NextFunction) {
    try {
      const repo = await Repository.findById(req.params.repositoryId as string);
      if (!repo) {
        return res.status(404).json({ success: false, error: { code: 'REPO_NOT_FOUND', message: 'Repository not found' } });
      }
      res.json({ success: true, message: 'Memory rebuild started' });
    } catch (error) {
      next(error);
    }
  },

  async getArchitectureGraph(req: Request, res: Response, next: NextFunction) {
    try {
      const graph = await memoryEngineService.getArchitectureGraph(req.params.repositoryId as string);
      res.json({ success: true, data: graph });
    } catch (error) {
      next(error);
    }
  },

  async getArchitectureComplexity(req: Request, res: Response, next: NextFunction) {
    try {
      const complexity = await memoryEngineService.getArchitectureComplexity(req.params.repositoryId as string);
      res.json({ success: true, data: complexity });
    } catch (error) {
      next(error);
    }
  },

  async getKnowledgeGraph(req: Request, res: Response, next: NextFunction) {
    try {
      const graph = await memoryEngineService.getKnowledgeGraph(req.params.repositoryId as string);
      res.json({ success: true, data: graph });
    } catch (error) {
      next(error);
    }
  },

  async searchKnowledgeGraph(req: Request, res: Response, next: NextFunction) {
    try {
      const query = (req.query.q as string) || '';
      const results = await memoryEngineService.searchKnowledgeGraph(req.params.repositoryId as string, query);
      res.json({ success: true, data: results });
    } catch (error) {
      next(error);
    }
  },
};
