"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const logger_1 = require("../utils/logger");
const response_1 = require("../utils/response");
function errorHandler(err, req, res, next) {
    logger_1.logger.error('Unhandled application error:', err);
    const status = err.statusCode || err.status || 500;
    const message = err.message || 'Internal Server Error';
    return (0, response_1.sendError)(res, message, status);
}
