import { Router } from 'express';
import { documentationController } from '../controllers/documentation.controller';

const router = Router();

router.post('/:repositoryId/generate', documentationController.generate);
router.get('/:repositoryId', documentationController.get);
router.get('/:repositoryId/export', documentationController.export);
router.post('/:repositoryId/generate-missions', documentationController.generateMissions);
router.get('/:repositoryId/missions', documentationController.getMissions);
router.patch('/missions/:missionId/complete', documentationController.completeMission);
router.post('/:repositoryId/interview/start', documentationController.startInterview);
router.post('/interview/:interviewId/answer', documentationController.submitAnswer);
router.get('/interview/:interviewId/results', documentationController.getInterviewResults);
router.post('/freelancer-rescue/:repositoryId', documentationController.generateRescueReport);

export default router;