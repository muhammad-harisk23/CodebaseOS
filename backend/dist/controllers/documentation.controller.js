"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentationController = void 0;
const documentation_service_1 = require("../services/documentation/documentation.service");
exports.documentationController = {
    async generate(req, res, next) {
        try {
            const { type } = req.body;
            const doc = await documentation_service_1.documentationService.generateDocumentation(req.params.repositoryId, type || 'README');
            res.json({ success: true, data: doc });
        }
        catch (error) {
            next(error);
        }
    },
    async get(req, res, next) {
        try {
            const docs = await documentation_service_1.documentationService.getDocumentation(req.params.repositoryId);
            res.json({ success: true, data: docs });
        }
        catch (error) {
            next(error);
        }
    },
    async export(req, res, next) {
        try {
            const result = await documentation_service_1.documentationService.exportDocumentation(req.params.repositoryId);
            res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    },
    async generateMissions(req, res, next) {
        try {
            const missions = await documentation_service_1.documentationService.generateLearningMissions(req.params.repositoryId);
            res.json({ success: true, data: missions });
        }
        catch (error) {
            next(error);
        }
    },
    async getMissions(req, res, next) {
        try {
            const missions = await documentation_service_1.documentationService.getLearningMissions(req.params.repositoryId);
            res.json({ success: true, data: missions });
        }
        catch (error) {
            next(error);
        }
    },
    async completeMission(req, res, next) {
        try {
            const mission = await documentation_service_1.documentationService.completeMission(req.params.missionId);
            res.json({ success: true, data: mission });
        }
        catch (error) {
            next(error);
        }
    },
    async startInterview(req, res, next) {
        try {
            const interview = await documentation_service_1.documentationService.startInterview(req.params.repositoryId);
            res.json({ success: true, data: interview });
        }
        catch (error) {
            next(error);
        }
    },
    async submitAnswer(req, res, next) {
        try {
            const { questionIndex, answer } = req.body;
            const interview = await documentation_service_1.documentationService.submitAnswer(req.params.interviewId, questionIndex, answer);
            res.json({ success: true, data: interview });
        }
        catch (error) {
            next(error);
        }
    },
    async getInterviewResults(req, res, next) {
        try {
            const results = await documentation_service_1.documentationService.getInterviewResults(req.params.interviewId);
            res.json({ success: true, data: results });
        }
        catch (error) {
            next(error);
        }
    },
    async generateRescueReport(req, res, next) {
        try {
            const report = await documentation_service_1.documentationService.generateRescueReport(req.params.repositoryId);
            res.json({ success: true, data: report });
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=documentation.controller.js.map