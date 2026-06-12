import { Request, Response, NextFunction } from 'express';
import path from 'path';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from '../models/Repository';
import { repositoryAnalysisService } from '../services/repository-analysis/repository-analysis.service';
import { memoryEngineService } from '../services/memory/memory-engine.service';
import { scoringService } from '../services/scoring/scoring.service';
import { AppError } from '../middleware/error.middleware';
import { env } from '../config/env';
import { logger } from '../utils/logger';

const upload = multer({ dest: path.resolve(env.uploadDir) });

export const repositoryController = {
  uploadMiddleware: upload.single('file'),

  /**
   * POST /api/v1/repositories/analyze
   */
  async analyze(req: Request, res: Response, next: NextFunction) {
    try {
      const { repositoryUrl, source } = req.body;

      if (!repositoryUrl) {
        throw new AppError('repositoryUrl is required', 400, 'VALIDATION_ERROR');
      }

      // Phase B MVP supports public cloning (source inferred/validated)
      const normalizedSource = (source || 'github').toLowerCase();
      if (!['github', 'gitlab'].includes(normalizedSource)) {
        throw new AppError('source must be "github" or "gitlab"', 400, 'VALIDATION_ERROR');
      }

      // Create repository record
      const repo = await Repository.create({
        name: new URL(repositoryUrl).pathname.split('/').pop() || 'unknown',
        repositoryUrl,
        source: normalizedSource,
        status: 'pending',
      });

      // Synchronous response for Phase B MVP
      const repoPath = await repositoryAnalysisService.cloneRepository(repositoryUrl);
      const analysisResult = await repositoryAnalysisService.analyzeRepository(repoPath, repo._id.toString());

      res.status(200).json({
        success: true,
        data: {
          repositoryId: repo._id,
          status: 'analyzed',
          ...analysisResult,
        },
        message: 'Repository analysis completed',
      });
    } catch (error: any) {
      logger.error(`Analysis error: ${error.message}`);
      next(error);
    }
  },

  /**
   * POST /api/v1/repositories/upload
   */
  async upload(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new AppError('File is required', 400, 'VALIDATION_ERROR');
      }

      const repo = await Repository.create({
        name: req.file.originalname.replace('.zip', ''),
        source: 'zip',
        status: 'pending',
      });

      res.status(202).json({
        success: true,
        data: { repositoryId: repo._id },
        message: 'ZIP upload accepted',
      });

      // Background processing
      const repoPath = await repositoryAnalysisService.extractZip(req.file.path);
      await repositoryAnalysisService.analyzeRepository(repoPath, repo._id.toString());
      await memoryEngineService.processRepositoryMemory(repoPath, repo._id.toString());
      await scoringService.calculateAllScores(repo._id.toString());

      try {
        const fs = require('fs');
        fs.rmSync(repoPath, { recursive: true, force: true });
      } catch (e) {
        logger.warn(`Failed to clean up ${repoPath}`);
      }
    } catch (error: any) {
      logger.error(`Upload error: ${error.message}`);
      next(error);
    }
  },

  /**
   * GET /api/v1/repositories/:repositoryId
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const repo = await Repository.findById(req.params.repositoryId);
      if (!repo) throw new AppError('Repository not found', 404, 'REPO_NOT_FOUND');
      res.json({ success: true, data: repo });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/v1/repositories
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const repos = await Repository.find().sort({ createdAt: -1 });
      res.json({ success: true, data: repos });
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/v1/repositories/:repositoryId
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const repo = await Repository.findByIdAndDelete(req.params.repositoryId);
      if (!repo) throw new AppError('Repository not found', 404, 'REPO_NOT_FOUND');
      res.json({ success: true, message: 'Repository deleted' });
    } catch (error) {
      next(error);
    }
  },
};