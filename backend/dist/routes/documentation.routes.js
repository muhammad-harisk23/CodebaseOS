"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const documentation_controller_1 = require("../controllers/documentation.controller");
const router = (0, express_1.Router)();
router.post('/:repositoryId/generate', documentation_controller_1.documentationController.generate);
router.get('/:repositoryId', documentation_controller_1.documentationController.get);
router.get('/:repositoryId/export', documentation_controller_1.documentationController.export);
router.post('/:repositoryId/generate-missions', documentation_controller_1.documentationController.generateMissions);
router.get('/:repositoryId/missions', documentation_controller_1.documentationController.getMissions);
router.patch('/missions/:missionId/complete', documentation_controller_1.documentationController.completeMission);
router.post('/:repositoryId/interview/start', documentation_controller_1.documentationController.startInterview);
router.post('/interview/:interviewId/answer', documentation_controller_1.documentationController.submitAnswer);
router.get('/interview/:interviewId/results', documentation_controller_1.documentationController.getInterviewResults);
router.post('/freelancer-rescue/:repositoryId', documentation_controller_1.documentationController.generateRescueReport);
exports.default = router;
//# sourceMappingURL=documentation.routes.js.map