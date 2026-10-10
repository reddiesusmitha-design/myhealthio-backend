"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = connectDatabase;
exports.isDatabaseConnected = isDatabaseConnected;
exports.getDatabaseStatus = getDatabaseStatus;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const index_1 = require("./index");
const logger_1 = require("../utils/logger");
let isConnected = false;
async function connectDatabase() {
    // Dynamically re-read .env in case the user recently updated DB_URL
    try {
        dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env'), override: true });
    }
    catch {
        // ignore
    }
    let url = (process.env.DB_URL || process.env.DATABASE_URL || index_1.config.dbUrl || '').trim();
    // Strip wrapping quotes if any
    if ((url.startsWith('"') && url.endsWith('"')) || (url.startsWith("'") && url.endsWith("'"))) {
        url = url.slice(1, -1).trim();
    }
    if (!url || url.includes('<username>') || url.includes('<password>')) {
        logger_1.logger.warn('[MongoDB Atlas] Notice: DB_URL contains unconfigured placeholders (<username>/<password>). The app will operate in resilient mode until a valid MongoDB Atlas connection string is provided in backend/.env');
        return false;
    }
    try {
        if (mongoose_1.default.connection.readyState === 1) {
            isConnected = true;
            return true;
        }
        mongoose_1.default.set('strictQuery', false);
        await mongoose_1.default.connect(url, {
            serverSelectionTimeoutMS: 5000,
        });
        isConnected = true;
        logger_1.logger.info('[MongoDB Atlas] Successfully connected to MongoDB Atlas database!');
        return true;
    }
    catch (error) {
        logger_1.logger.error(`[MongoDB Atlas] Connection attempt failed: ${error.message}`);
        isConnected = false;
        return false;
    }
}
mongoose_1.default.connection.on('connected', () => {
    isConnected = true;
    logger_1.logger.info('[MongoDB Atlas] Connection established.');
});
mongoose_1.default.connection.on('disconnected', () => {
    isConnected = false;
    logger_1.logger.warn('[MongoDB Atlas] Connection disconnected.');
});
mongoose_1.default.connection.on('error', (err) => {
    logger_1.logger.error(`[MongoDB Atlas] Runtime error: ${err.message}`);
});
function isDatabaseConnected() {
    return isConnected && mongoose_1.default.connection.readyState === 1;
}
function getDatabaseStatus() {
    return {
        connected: isDatabaseConnected(),
        host: isDatabaseConnected() ? mongoose_1.default.connection.host : 'local/unconnected',
        name: isDatabaseConnected() ? mongoose_1.default.connection.name : 'myhealthio',
    };
}
