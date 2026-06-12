"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gitlab_controller_1 = require("../controllers/gitlab.controller");
const router = (0, express_1.Router)();
router.post('/issues', gitlab_controller_1.gitlabController.createIssue);
router.post('/documentation-issue', gitlab_controller_1.gitlabController.createDocumentationIssue);
router.post('/learning-mission', gitlab_controller_1.gitlabController.createLearningMission);
router.post('/ownership-risk', gitlab_controller_1.gitlabController.createOwnershipRiskIssue);
router.get('/activity/:repositoryId', gitlab_controller_1.gitlabController.getActivity);
exports.default = router;
//# sourceMappingURL=gitlab.routes.js.map