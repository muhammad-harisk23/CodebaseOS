"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const error_middleware_1 = require("./middleware/error.middleware");
const repository_routes_1 = __importDefault(require("./routes/repository.routes"));
const memory_routes_1 = __importDefault(require("./routes/memory.routes"));
const score_routes_1 = __importDefault(require("./routes/score.routes"));
const documentation_routes_1 = __importDefault(require("./routes/documentation.routes"));
const agent_routes_1 = __importDefault(require("./routes/agent.routes"));
const gitlab_routes_1 = __importDefault(require("./routes/gitlab.routes"));
const missions_routes_1 = __importDefault(require("./routes/missions.routes"));
const interview_routes_1 = __importDefault(require("./routes/interview.routes"));
const freelancer_rescue_routes_1 = __importDefault(require("./routes/freelancer-rescue.routes"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// API Routes
app.use('/api/v1/repositories', repository_routes_1.default);
app.use('/api/v1/memory', memory_routes_1.default);
app.use('/api/v1', score_routes_1.default); // intelligence, architecture, scores, risks, ownership, health
app.use('/api/v1/documentation', documentation_routes_1.default);
app.use('/api/v1/agent', agent_routes_1.default);
app.use('/api/v1/gitlab', gitlab_routes_1.default);
app.use('/api/v1/missions', missions_routes_1.default);
app.use('/api/v1/interview', interview_routes_1.default);
app.use('/api/v1/freelancer-rescue', freelancer_rescue_routes_1.default);
// Health check
app.get('/api/health', (_req, res) => {
    res.json({ success: true, message: 'CodebaseOS API is running', timestamp: new Date().toISOString() });
});
// Error handling
app.use(error_middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map