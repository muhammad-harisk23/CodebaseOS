import { Router } from 'express';
import { agentController } from '../controllers/agent.controller';

const router = Router();

router.post('/:repositoryId/run', agentController.run);
router.get('/:repositoryId/status', agentController.getStatus);
router.get('/:repositoryId/timeline', agentController.getTimeline);
router.get('/:repositoryId/feed', agentController.getFeed);
router.get('/:repositoryId/actions', agentController.getActionHistory);
router.get('/:repositoryId/recommendations', agentController.getRecommendations);

export default router;