"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const logger_1 = require("./utils/logger");
const database_1 = require("./config/database");
const server = app_1.default.listen(config_1.config.port, async () => {
    logger_1.logger.info(`MyHealthIO Backend running on port ${config_1.config.port} in ${config_1.config.nodeEnv} mode`);
    logger_1.logger.info(`Configured Client URL: ${config_1.config.clientUrl}`);
    await (0, database_1.connectDatabase)();
});
process.on('SIGTERM', () => {
    logger_1.logger.info('SIGTERM received. Shutting down gracefully.');
    server.close(() => {
        logger_1.logger.info('Server process terminated.');
    });
});
