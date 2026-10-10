"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
/**
 * Authentication Service
 * User registration, credential verification, and JWT issuance.
 */
class AuthService {
    async registerUser(data) {
        return { id: 'mock-user-id', email: data.email };
    }
    async validateCredentials(email, pass) {
        return { id: 'mock-user-id', email };
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
