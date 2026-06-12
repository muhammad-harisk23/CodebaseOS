"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const score_controller_1 = require("../controllers/score.controller");
const memory_controller_1 = require("../controllers/memory.controller");
const router = (0, express_1.Router)();
// Intelligence routes
router.get('/intelligence/:repositoryId', score_controller_1.scoreController.getIntelligenceReport);
router.get('/intelligence/:repositoryId/frameworks', score_controller_1.scoreController.getFrameworks);
router.get('/intelligence/:repositoryId/dependencies', score_controller_1.scoreController.getDependencies);
router.get('/intelligence/:repositoryId/services', score_controller_1.scoreController.getServices);
router.get('/intelligence/:repositoryId/apis', score_controller_1.scoreController.getApis);
// Architecture routes
router.get('/architecture/:repositoryId', memory_controller_1.memoryController.getArchitectureGraph);
router.get('/architecture/:repositoryId/complexity', memory_controller_1.memoryController.getArchitectureComplexity);
// Knowledge Graph routes
router.get('/knowledge-graph/:repositoryId', memory_controller_1.memoryController.getKnowledgeGraph);
router.get('/knowledge-graph/:repositoryId/search', memory_controller_1.memoryController.searchKnowledgeGraph);
// Score routes
router.get('/scores/:repositoryId/knowledge-debt', score_controller_1.scoreController.getKnowledgeDebt);
router.get('/scores/:repositoryId/survivability', score_controller_1.scoreController.getSurvivability);
router.get('/scores/:repositoryId/recoverability', score_controller_1.scoreController.getRecoverability);
router.get('/scores/:repositoryId/bus-factor', score_controller_1.scoreController.getBusFactor);
// Risk Center routes
router.get('/risk-center/:repositoryId', score_controller_1.scoreController.getRiskDashboard);
router.get('/risks/:repositoryId', score_controller_1.scoreController.getRisks);
router.get('/risks/:repositoryId/critical', score_controller_1.scoreController.getCriticalRisks);
// Ownership routes
router.get('/ownership/:repositoryId', score_controller_1.scoreController.getOwnershipMap);
router.get('/ownership/:repositoryId/modules/:moduleId', score_controller_1.scoreController.getModuleOwnership);
// Health routes
router.get('/health/:repositoryId', score_controller_1.scoreController.getRisks);
router.get('/health/:repositoryId/dependencies', score_controller_1.scoreController.getDependencies);
router.get('/health/:repositoryId/duplicates', (_req, res) => res.json({ success: true, data: [] }));
router.get('/health/:repositoryId/dead-code', (_req, res) => res.json({ success: true, data: [] }));
exports.default = router;
//# sourceMappingURL=score.routes.js.map