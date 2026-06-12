"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.repositoryController = void 0;
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const Repository_1 = require("../models/Repository");
const repository_analysis_service_1 = require("../services/repository-analysis/repository-analysis.service");
const memory_engine_service_1 = require("../services/memory/memory-engine.service");
const scoring_service_1 = require("../services/scoring/scoring.service");
const error_middleware_1 = require("../middleware/error.middleware");
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
const upload = (0, multer_1.default)({ dest: path_1.default.resolve(env_1.env.uploadDir) });
exports.repositoryController = {
    uploadMiddleware: upload.single('file'),
    /**
     * POST /api/v1/repositories/analyze
     */
    async analyze(req, res, next) {
        try {
            const { repositoryUrl, source } = req.body;
            if (!repositoryUrl) {
                throw new error_middleware_1.AppError('repositoryUrl is required', 400, 'VALIDATION_ERROR');
            }
            // Phase B MVP supports public cloning (source inferred/validated)
            const normalizedSource = (source || 'github').toLowerCase();
            if (!['github', 'gitlab'].includes(normalizedSource)) {
                throw new error_middleware_1.AppError('source must be "github" or "gitlab"', 400, 'VALIDATION_ERROR');
            }
            // Create repository record
            const repo = await Repository_1.Repository.create({
                name: new URL(repositoryUrl).pathname.split('/').pop() || 'unknown',
                repositoryUrl,
                source: normalizedSource,
                status: 'pending',
            });
            // Synchronous response for Phase B MVP
            const repoPath = await repository_analysis_service_1.repositoryAnalysisService.cloneRepository(repositoryUrl);
            const analysisResult = await repository_analysis_service_1.repositoryAnalysisService.analyzeRepository(repoPath, repo._id.toString());
            res.status(200).json({
                success: true,
                data: {
                    repositoryId: repo._id,
                    status: 'analyzed',
                    ...analysisResult,
                },
                message: 'Repository analysis completed',
            });
        }
        catch (error) {
            logger_1.logger.error(`Analysis error: ${error.message}`);
            next(error);
        }
    },
    /**
     * POST /api/v1/repositories/upload
     */
    async upload(req, res, next) {
        try {
            if (!req.file) {
                throw new error_middleware_1.AppError('File is required', 400, 'VALIDATION_ERROR');
            }
            const repo = await Repository_1.Repository.create({
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
            const repoPath = await repository_analysis_service_1.repositoryAnalysisService.extractZip(req.file.path);
            await repository_analysis_service_1.repositoryAnalysisService.analyzeRepository(repoPath, repo._id.toString());
            await memory_engine_service_1.memoryEngineService.processRepositoryMemory(repoPath, repo._id.toString());
            await scoring_service_1.scoringService.calculateAllScores(repo._id.toString());
            try {
                const fs = require('fs');
                fs.rmSync(repoPath, { recursive: true, force: true });
            }
            catch (e) {
                logger_1.logger.warn(`Failed to clean up ${repoPath}`);
            }
        }
        catch (error) {
            logger_1.logger.error(`Upload error: ${error.message}`);
            next(error);
        }
    },
    /**
     * GET /api/v1/repositories/:repositoryId
     */
    async getById(req, res, next) {
        try {
            const repo = await Repository_1.Repository.findById(req.params.repositoryId);
            if (!repo)
                throw new error_middleware_1.AppError('Repository not found', 404, 'REPO_NOT_FOUND');
            res.json({ success: true, data: repo });
        }
        catch (error) {
            next(error);
        }
    },
    /**
     * GET /api/v1/repositories
     */
    async getAll(req, res, next) {
        try {
            const repos = await Repository_1.Repository.find().sort({ createdAt: -1 });
            res.json({ success: true, data: repos });
        }
        catch (error) {
            next(error);
        }
    },
    /**
     * DELETE /api/v1/repositories/:repositoryId
     */
    async delete(req, res, next) {
        try {
            const repo = await Repository_1.Repository.findByIdAndDelete(req.params.repositoryId);
            if (!repo)
                throw new error_middleware_1.AppError('Repository not found', 404, 'REPO_NOT_FOUND');
            res.json({ success: true, message: 'Repository deleted' });
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=repository.controller.js.map