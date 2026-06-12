"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const database_1 = require("./config/database");
const logger_1 = require("./utils/logger");
async function start() {
    try {
        // Connect to MongoDB
        await (0, database_1.connectDatabase)();
        // Start server
        app_1.default.listen(env_1.env.port, () => {
            logger_1.logger.info(`CodebaseOS API server running on port ${env_1.env.port}`);
            logger_1.logger.info(`Environment: ${env_1.env.nodeEnv}`);
            logger_1.logger.info(`Health check: http://localhost:${env_1.env.port}/api/health`);
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
}
start();
//# sourceMappingURL=server.js.map