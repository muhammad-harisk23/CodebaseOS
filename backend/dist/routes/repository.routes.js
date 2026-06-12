"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const repository_controller_1 = require("../controllers/repository.controller");
const router = (0, express_1.Router)();
router.post('/analyze', repository_controller_1.repositoryController.analyze);
router.post('/upload', repository_controller_1.repositoryController.uploadMiddleware, repository_controller_1.repositoryController.upload);
router.get('/', repository_controller_1.repositoryController.getAll);
router.get('/:repositoryId', repository_controller_1.repositoryController.getById);
router.delete('/:repositoryId', repository_controller_1.repositoryController.delete);
exports.default = router;
//# sourceMappingURL=repository.routes.js.map