"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scoreController = void 0;
const scoring_service_1 = require("../services/scoring/scoring.service");
const repository_analysis_service_1 = require("../services/repository-analysis/repository-analysis.service");
exports.scoreController = {
    async getIntelligenceReport(req, res, next) {
        try {
            const report = await repository_analysis_service_1.repositoryAnalysisService.getIntelligenceReport(req.params.repositoryId);
            res.json({ success: true, data: report });
        }
        catch (error) {
            next(error);
        }
    },
    async getFrameworks(req, res, next) {
        try {
            const result = await repository_analysis_service_1.repositoryAnalysisService.getFrameworks(req.params.repositoryId);
            res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    },
    async getDependencies(req, res, next) {
        try {
            const result = await repository_analysis_service_1.repositoryAnalysisService.getDependencies(req.params.repositoryId);
            res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    },
    async getServices(req, res, next) {
        try {
            const result = await repository_analysis_service_1.repositoryAnalysisService.getServices(req.params.repositoryId);
            res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    },
    async getApis(req, res, next) {
        try {
            const result = await repository_analysis_service_1.repositoryAnalysisService.getApis(req.params.repositoryId);
            res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    },
    async getKnowledgeDebt(req, res, next) {
        try {
            const result = await scoring_service_1.scoringService.getKnowledgeDebt(req.params.repositoryId);
            res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    },
    async getSurvivability(req, res, next) {
        try {
            const result = await scoring_service_1.scoringService.getSurvivability(req.params.repositoryId);
            res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    },
    async getRecoverability(req, res, next) {
        try {
            const result = await scoring_service_1.scoringService.getRecoverability(req.params.repositoryId);
            res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    },
    async getBusFactor(req, res, next) {
        try {
            const result = await scoring_service_1.scoringService.getBusFactor(req.params.repositoryId);
            res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    },
    async getRiskDashboard(req, res, next) {
        try {
            const result = await scoring_service_1.scoringService.getRiskDashboard(req.params.repositoryId);
            res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    },
    async getRisks(req, res, next) {
        try {
            const result = await scoring_service_1.scoringService.getRepositoryRisks(req.params.repositoryId);
            res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    },
    async getCriticalRisks(req, res, next) {
        try {
            const result = await scoring_service_1.scoringService.getCriticalRisks(req.params.repositoryId);
            res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    },
    async getOwnershipMap(req, res, next) {
        try {
            // Simplified: return modules from chunks
            const { RepositoryChunk } = require('../models/RepositoryChunk');
            const chunks = await RepositoryChunk.find({ repositoryId: req.params.repositoryId });
            const moduleSet = new Set(chunks.map((c) => c.module).filter(Boolean));
            const modules = Array.from(moduleSet);
            res.json({ success: true, data: { modules: modules.map((m) => ({ name: m, ownership: 'Unknown', risk: 'medium' })) } });
        }
        catch (error) {
            next(error);
        }
    },
    async getModuleOwnership(req, res, next) {
        try {
            res.json({ success: true, data: { module: req.params.moduleId, ownership: 'Unknown', risk: 'medium' } });
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=score.controller.js.map