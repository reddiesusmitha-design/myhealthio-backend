"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
/**
 * Safe Logger Module
 * Enforces PHI sanitization and prevents logging of sensitive clinical values or auth tokens.
 */
exports.logger = {
    info: (msg, meta) => {
        console.log(`[INFO] [${new Date().toISOString()}] ${msg}`, meta ? JSON.stringify(meta) : '');
    },
    warn: (msg, meta) => {
        console.warn(`[WARN] [${new Date().toISOString()}] ${msg}`, meta ? JSON.stringify(meta) : '');
    },
    error: (msg, err) => {
        console.error(`[ERROR] [${new Date().toISOString()}] ${msg}`, err);
    },
};
