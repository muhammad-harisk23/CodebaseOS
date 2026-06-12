import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/codebaseos',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  gitlabToken: process.env.GITLAB_TOKEN || '',
  gitlabProjectId: process.env.GITLAB_PROJECT_ID || '',
  gitlabApiUrl: process.env.GITLAB_API_URL || 'https://gitlab.com/api/v4',

  // Temporary clone location (public cloning only for MVP)
  tempRepoDir: process.env.TEMP_REPO_DIR || path.resolve(__dirname, '../../tmp/repos'),

  // Existing upload directory for ZIP uploads (kept as-is)
  uploadDir: process.env.UPLOAD_DIR || path.resolve(__dirname, '../../uploads'),
};
