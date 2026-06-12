"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentController = void 0;
const agent_service_1 = require("../services/agent/agent.service");
exports.agentController = {
    async run(req, res, next) {
        try {
            const result = await agent_service_1.agentService.runAgent(req.params.repositoryId);
            res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    },
    async getStatus(req, res, next) {
        try {
            const status = await agent_service_1.agentService.getAgentStatus(req.params.repositoryId);
            res.json({ success: true, data: status });
        }
        catch (error) {
            next(error);
        }
    },
    async getTimeline(req, res, next) {
        try {
            const timeline = await agent_service_1.agentService.getAgentTimeline(req.params.repositoryId);
            res.json({ success: true, data: timeline });
        }
        catch (error) {
            next(error);
        }
    },
    async getRecommendations(req, res, next) {
        try {
            const recommendations = await agent_service_1.agentService.getAgentRecommendations(req.params.repositoryId);
            res.json({ success: true, data: recommendations });
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=agent.controller.js.map