"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
exports.env = {
    port: parseInt(process.env.PORT || '3001', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/codebaseos',
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    gitlabToken: process.env.GITLAB_TOKEN || '',
    gitlabProjectId: process.env.GITLAB_PROJECT_ID || '',
    gitlabApiUrl: process.env.GITLAB_API_URL || 'https://gitlab.com/api/v4',
    // Temporary clone location (public cloning only for MVP)
    tempRepoDir: process.env.TEMP_REPO_DIR || path_1.default.resolve(__dirname, '../../tmp/repos'),
    // Existing upload directory for ZIP uploads (kept as-is)
    uploadDir: process.env.UPLOAD_DIR || path_1.default.resolve(__dirname, '../../uploads'),
};
//# sourceMappingURL=env.js.map