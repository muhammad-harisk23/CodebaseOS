"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitlabController = void 0;
const gitlab_service_1 = require("../services/gitlab/gitlab.service");
exports.gitlabController = {
    async createIssue(req, res, next) {
        try {
            const { repositoryId, title, description, labels } = req.body;
            const issue = await gitlab_service_1.gitlabService.createIssue(repositoryId, title, description, labels);
            res.json({ success: true, data: issue });
        }
        catch (error) {
            next(error);
        }
    },
    async createDocumentationIssue(req, res, next) {
        try {
            const { repositoryId, moduleName } = req.body;
            const issue = await gitlab_service_1.gitlabService.createDocumentationIssue(repositoryId, moduleName || 'Repository');
            res.json({ success: true, data: issue });
        }
        catch (error) {
            next(error);
        }
    },
    async createLearningMission(req, res, next) {
        try {
            const { repositoryId, title, objective } = req.body;
            const issue = await gitlab_service_1.gitlabService.createLearningMissionIssue(repositoryId, title, objective);
            res.json({ success: true, data: issue });
        }
        catch (error) {
            next(error);
        }
    },
    async createOwnershipRiskIssue(req, res, next) {
        try {
            const { repositoryId, moduleName, ownerPercent } = req.body;
            const issue = await gitlab_service_1.gitlabService.createOwnershipRiskIssue(repositoryId, moduleName, ownerPercent || 90);
            res.json({ success: true, data: issue });
        }
        catch (error) {
            next(error);
        }
    },
    async getActivity(req, res, next) {
        try {
            const activity = await gitlab_service_1.gitlabService.getGitlabActivity(req.params.repositoryId);
            res.json({ success: true, data: activity });
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=gitlab.controller.js.map