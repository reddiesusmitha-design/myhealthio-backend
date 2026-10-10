"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.getMe = getMe;
exports.logout = logout;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const response_1 = require("../utils/response");
const config_1 = require("../config");
const User_1 = require("../models/User");
const Notification_1 = require("../models/Notification");
const database_1 = require("../config/database");
// Resilient in-memory user registry for when DB_URL is awaiting real Atlas credentials
const memoryUsers = new Map();
/**
 * Register a new user: Saves to MongoDB Atlas if connected, with resilient fallback
 */
async function register(req, res) {
    const { email, password, fullName, preferredLanguage } = req.body;
    if (!email || !password || !fullName) {
        return (0, response_1.sendError)(res, 'Full name, email, and password are required', 400);
    }
    // Attempt database connection if not currently active
    let dbActive = (0, database_1.isDatabaseConnected)();
    if (!dbActive) {
        dbActive = await (0, database_1.connectDatabase)();
    }
    const normalizedEmail = email.toLowerCase().trim();
    try {
        // 1. If MongoDB Atlas is connected, use real Mongoose model
        if (dbActive) {
            const existingUser = await User_1.UserModel.findOne({ email: normalizedEmail });
            if (existingUser) {
                return (0, response_1.sendError)(res, 'An account with this email address already exists. Please log in.', 400);
            }
            const passwordHash = await bcryptjs_1.default.hash(password, 10);
            const randomPart = () => Math.floor(1000 + Math.random() * 9000);
            const mockAbhaId = `ABHA-91-${randomPart()}-${randomPart()}-${randomPart()}`;
            const userDoc = await User_1.UserModel.create({
                email: normalizedEmail,
                passwordHash,
                fullName: fullName.trim(),
                mockAbhaId,
                preferredLanguage: preferredLanguage || 'en',
                bloodGroup: 'O+',
                allergies: [],
                chronicConditions: [],
            });
            try {
                await Notification_1.NotificationModel.create({
                    userId: userDoc._id.toString(),
                    title: 'Welcome to MyHealthIO!',
                    message: `Account created for ${userDoc.fullName}. Your ABHA ID is ${mockAbhaId}.`,
                    type: 'SYSTEM',
                    priority: 'NORMAL',
                    read: false,
                });
            }
            catch {
                // non-blocking
            }
            const token = jsonwebtoken_1.default.sign({ id: userDoc._id.toString(), email: userDoc.email }, config_1.config.jwtSecret, { expiresIn: config_1.config.jwtExpiresIn });
            const user = {
                id: userDoc._id.toString(),
                email: userDoc.email,
                fullName: userDoc.fullName,
                mockAbhaId: userDoc.mockAbhaId,
                preferredLanguage: userDoc.preferredLanguage,
                bloodGroup: userDoc.bloodGroup,
                emergencyContact: userDoc.emergencyContact || '',
            };
            // Also cache in memory map
            memoryUsers.set(normalizedEmail, { ...user, passwordHash });
            memoryUsers.set(user.id, { ...user, passwordHash });
            return (0, response_1.sendSuccess)(res, { token, user }, 'Account successfully created and saved in MongoDB Atlas', 201);
        }
        // 2. Resilient fallback mode (when DB_URL has <username>/<password> placeholders)
        if (memoryUsers.has(normalizedEmail)) {
            return (0, response_1.sendError)(res, 'An account with this email address already exists. Please log in.', 400);
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const randomPart = () => Math.floor(1000 + Math.random() * 9000);
        const mockAbhaId = `ABHA-91-${randomPart()}-${randomPart()}-${randomPart()}`;
        const generatedId = `usr-${Date.now()}`;
        const user = {
            id: generatedId,
            email: normalizedEmail,
            fullName: fullName.trim(),
            mockAbhaId,
            preferredLanguage: preferredLanguage || 'en',
            bloodGroup: 'O+',
            emergencyContact: '',
            allergies: [],
            chronicConditions: [],
            createdAt: new Date(),
        };
        memoryUsers.set(normalizedEmail, { ...user, passwordHash });
        memoryUsers.set(generatedId, { ...user, passwordHash });
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, config_1.config.jwtSecret, { expiresIn: config_1.config.jwtExpiresIn });
        return (0, response_1.sendSuccess)(res, { token, user }, 'Account created successfully! Note: Replace <username>:<password> in backend/.env with your MongoDB Atlas string to persist directly to Atlas.', 201);
    }
    catch (error) {
        console.error('[Registration Error]:', error);
        return (0, response_1.sendError)(res, `Failed to register user: ${error.message}`, 500);
    }
}
/**
 * Authenticate existing user against MongoDB Atlas or fallback registry
 */
async function login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return (0, response_1.sendError)(res, 'Email and password are required', 400);
    }
    let dbActive = (0, database_1.isDatabaseConnected)();
    if (!dbActive) {
        dbActive = await (0, database_1.connectDatabase)();
    }
    const normalizedEmail = email.toLowerCase().trim();
    try {
        // 1. Try MongoDB Atlas if connected
        if (dbActive) {
            const userDoc = await User_1.UserModel.findOne({ email: normalizedEmail });
            if (userDoc) {
                const isMatch = await bcryptjs_1.default.compare(password, userDoc.passwordHash);
                if (!isMatch) {
                    return (0, response_1.sendError)(res, 'Invalid email or password.', 401);
                }
                const token = jsonwebtoken_1.default.sign({ id: userDoc._id.toString(), email: userDoc.email }, config_1.config.jwtSecret, { expiresIn: config_1.config.jwtExpiresIn });
                const user = {
                    id: userDoc._id.toString(),
                    email: userDoc.email,
                    fullName: userDoc.fullName,
                    mockAbhaId: userDoc.mockAbhaId,
                    preferredLanguage: userDoc.preferredLanguage,
                    bloodGroup: userDoc.bloodGroup,
                    emergencyContact: userDoc.emergencyContact || '',
                };
                return (0, response_1.sendSuccess)(res, { token, user }, 'Login successful');
            }
        }
        // 2. Check memory registry fallback
        const cachedUser = memoryUsers.get(normalizedEmail);
        if (cachedUser) {
            const isMatch = await bcryptjs_1.default.compare(password, cachedUser.passwordHash);
            if (!isMatch) {
                return (0, response_1.sendError)(res, 'Invalid email or password.', 401);
            }
            const token = jsonwebtoken_1.default.sign({ id: cachedUser.id, email: cachedUser.email }, config_1.config.jwtSecret, { expiresIn: config_1.config.jwtExpiresIn });
            const { passwordHash, ...cleanUser } = cachedUser;
            return (0, response_1.sendSuccess)(res, { token, user: cleanUser }, 'Login successful');
        }
        return (0, response_1.sendError)(res, 'Invalid email or password. Please check credentials or register.', 401);
    }
    catch (error) {
        console.error('[Login Error]:', error);
        return (0, response_1.sendError)(res, `Login failed: ${error.message}`, 500);
    }
}
/**
 * Retrieve current user profile
 */
async function getMe(req, res) {
    const userId = req.user?.id;
    if (!userId) {
        return (0, response_1.sendError)(res, 'Unauthorized', 401);
    }
    try {
        if ((0, database_1.isDatabaseConnected)()) {
            const userDoc = await User_1.UserModel.findById(userId).select('-passwordHash');
            if (userDoc) {
                return (0, response_1.sendSuccess)(res, userDoc, 'User details retrieved');
            }
        }
        const cached = memoryUsers.get(userId);
        if (cached) {
            const { passwordHash, ...cleanUser } = cached;
            return (0, response_1.sendSuccess)(res, cleanUser, 'User details retrieved');
        }
        return (0, response_1.sendSuccess)(res, { id: userId, email: req.user?.email }, 'User details retrieved');
    }
    catch (error) {
        return (0, response_1.sendError)(res, error.message, 500);
    }
}
async function logout(req, res) {
    return (0, response_1.sendSuccess)(res, null, 'Logged out successfully');
}
