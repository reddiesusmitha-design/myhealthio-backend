"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
exports.sendError = sendError;
function sendSuccess(res, data, message = 'Success', status = 200) {
    return res.status(status).json({
        success: true,
        message,
        data,
    });
}
function sendError(res, message, status = 400, details) {
    return res.status(status).json({
        success: false,
        message,
        details,
    });
}
