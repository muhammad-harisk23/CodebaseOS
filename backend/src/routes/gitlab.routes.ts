import { Router } from 'express';
import { gitlabController } from '../controllers/gitlab.controller';

const router = Router();

router.post('/issues', gitlabController.createIssue);
router.post('/documentation-issue', gitlabController.createDocumentationIssue);
router.post('/learning-mission', gitlabController.createLearningMission);
router.post('/ownership-risk', gitlabController.createOwnershipRiskIssue);
router.post('/survivability-issue', gitlabController.createSurvivabilityIssue);
router.post('/recoverability-issue', gitlabController.createRecoverabilityIssue);
router.get('/activity/:repositoryId', gitlabController.getActivity);

export default router;