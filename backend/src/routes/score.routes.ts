import { Router } from 'express';
import { scoreController } from '../controllers/score.controller';
import { memoryController } from '../controllers/memory.controller';

const router = Router();

// Intelligence routes
router.get('/intelligence/:repositoryId', scoreController.getIntelligenceReport);
router.get('/intelligence/:repositoryId/frameworks', scoreController.getFrameworks);
router.get('/intelligence/:repositoryId/dependencies', scoreController.getDependencies);
router.get('/intelligence/:repositoryId/services', scoreController.getServices);
router.get('/intelligence/:repositoryId/apis', scoreController.getApis);

// Architecture routes
router.get('/architecture/:repositoryId', memoryController.getArchitectureGraph);
router.get('/architecture/:repositoryId/complexity', memoryController.getArchitectureComplexity);

// Knowledge Graph routes
router.get('/knowledge-graph/:repositoryId', memoryController.getKnowledgeGraph);
router.get('/knowledge-graph/:repositoryId/search', memoryController.searchKnowledgeGraph);

// Score routes
router.get('/scores/:repositoryId/knowledge-debt', scoreController.getKnowledgeDebt);
router.get('/scores/:repositoryId/survivability', scoreController.getSurvivability);
router.get('/scores/:repositoryId/recoverability', scoreController.getRecoverability);
router.get('/scores/:repositoryId/bus-factor', scoreController.getBusFactor);

// Risk Center routes
router.get('/risk-center/:repositoryId', scoreController.getRiskDashboard);
router.get('/risks/:repositoryId', scoreController.getRisks);
router.get('/risks/:repositoryId/critical', scoreController.getCriticalRisks);

// Ownership routes
router.get('/ownership/:repositoryId', scoreController.getOwnershipMap);
router.get('/ownership/:repositoryId/modules/:moduleId', scoreController.getModuleOwnership);

// Health routes
router.get('/health/:repositoryId', scoreController.getRisks);
router.get('/health/:repositoryId/dependencies', scoreController.getDependencies);
router.get('/health/:repositoryId/duplicates', (_req, res) => res.json({ success: true, data: [] }));
router.get('/health/:repositoryId/dead-code', (_req, res) => res.json({ success: true, data: [] }));

export default router;