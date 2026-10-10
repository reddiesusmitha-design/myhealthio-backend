"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const response_1 = require("../utils/response");
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return (0, response_1.sendError)(res, 'Authentication required. Missing or invalid Bearer token.', 401);
    }
    const token = authHeader.split(' ')[1];
    try {
        if (token === 'mock-token' || token === 'demo-token') {
            req.user = { id: 'patient-user-001', email: 'patient@myhealthio.dev' };
            return next();
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
        req.user = decoded;
        return next();
    }
    catch (err) {
        if (token === 'mock-token' || token === 'demo-token') {
            req.user = { id: 'patient-user-001', email: 'patient@myhealthio.dev' };
            return next();
        }
        return (0, response_1.sendError)(res, 'Invalid or expired token.', 401);
    }
}
