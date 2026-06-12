"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const agent_controller_1 = require("../controllers/agent.controller");
const router = (0, express_1.Router)();
router.post('/:repositoryId/run', agent_controller_1.agentController.run);
router.get('/:repositoryId/status', agent_controller_1.agentController.getStatus);
router.get('/:repositoryId/timeline', agent_controller_1.agentController.getTimeline);
router.get('/:repositoryId/recommendations', agent_controller_1.agentController.getRecommendations);
exports.default = router;
//# sourceMappingURL=agent.routes.js.map