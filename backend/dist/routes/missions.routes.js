"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// POST /api/v1/missions/:repositoryId/generate
router.post('/:repositoryId/generate', (_req, res) => {
    res.status(501).json({
        success: false,
        error: { code: 'NOT_IMPLEMENTED', message: 'Learning mission generation not implemented yet' },
    });
});
// GET /api/v1/missions/:repositoryId
router.get('/:repositoryId', (_req, res) => {
    res.status(501).json({
        success: false,
        error: { code: 'NOT_IMPLEMENTED', message: 'Learning missions retrieval not implemented yet' },
    });
});
exports.default = router;
//# sourceMappingURL=missions.routes.js.map