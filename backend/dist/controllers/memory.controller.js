"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoryController = void 0;
const memory_engine_service_1 = require("../services/memory/memory-engine.service");
const Repository_1 = require("../models/Repository");
exports.memoryController = {
    async getMemory(req, res, next) {
        try {
            const report = await memory_engine_service_1.memoryEngineService.getMemoryReport(req.params.repositoryId);
            res.json({ success: true, data: report });
        }
        catch (error) {
            next(error);
        }
    },
    async getChunks(req, res, next) {
        try {
            const chunks = await memory_engine_service_1.memoryEngineService.getRepositoryChunks(req.params.repositoryId);
            res.json({ success: true, data: chunks });
        }
        catch (error) {
            next(error);
        }
    },
    async getChunkDetails(req, res, next) {
        try {
            const chunk = await memory_engine_service_1.memoryEngineService.getChunkDetails(req.params.chunkId);
            res.json({ success: true, data: chunk });
        }
        catch (error) {
            next(error);
        }
    },
    async rebuildMemory(req, res, next) {
        try {
            const repo = await Repository_1.Repository.findById(req.params.repositoryId);
            if (!repo) {
                return res.status(404).json({ success: false, error: { code: 'REPO_NOT_FOUND', message: 'Repository not found' } });
            }
            res.json({ success: true, message: 'Memory rebuild started' });
        }
        catch (error) {
            next(error);
        }
    },
    async getArchitectureGraph(req, res, next) {
        try {
            const graph = await memory_engine_service_1.memoryEngineService.getArchitectureGraph(req.params.repositoryId);
            res.json({ success: true, data: graph });
        }
        catch (error) {
            next(error);
        }
    },
    async getArchitectureComplexity(req, res, next) {
        try {
            const complexity = await memory_engine_service_1.memoryEngineService.getArchitectureComplexity(req.params.repositoryId);
            res.json({ success: true, data: complexity });
        }
        catch (error) {
            next(error);
        }
    },
    async getKnowledgeGraph(req, res, next) {
        try {
            const graph = await memory_engine_service_1.memoryEngineService.getKnowledgeGraph(req.params.repositoryId);
            res.json({ success: true, data: graph });
        }
        catch (error) {
            next(error);
        }
    },
    async searchKnowledgeGraph(req, res, next) {
        try {
            const query = req.query.q || '';
            const results = await memory_engine_service_1.memoryEngineService.searchKnowledgeGraph(req.params.repositoryId, query);
            res.json({ success: true, data: results });
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=memory.controller.js.map