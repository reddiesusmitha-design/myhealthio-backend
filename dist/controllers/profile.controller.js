"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = getProfile;
exports.updateProfile = updateProfile;
const response_1 = require("../utils/response");
const User_1 = require("../models/User");
const database_1 = require("../config/database");
async function getProfile(req, res) {
    const userId = req.user?.id;
    if (!userId)
        return (0, response_1.sendError)(res, 'Unauthorized', 401);
    try {
        if ((0, database_1.isDatabaseConnected)()) {
            const userDoc = await User_1.UserModel.findById(userId).select('-passwordHash');
            if (userDoc) {
                return (0, response_1.sendSuccess)(res, userDoc, 'Profile retrieved from MongoDB');
            }
        }
    }
    catch (err) {
        return (0, response_1.sendError)(res, `Failed to fetch profile: ${err.message}`, 500);
    }
    return (0, response_1.sendSuccess)(res, { id: userId, email: req.user?.email }, 'Profile retrieved');
}
async function updateProfile(req, res) {
    const userId = req.user?.id;
    if (!userId)
        return (0, response_1.sendError)(res, 'Unauthorized', 401);
    const { fullName, dateOfBirth, gender, bloodGroup, emergencyContact, preferredLanguage, allergies, chronicConditions } = req.body;
    try {
        if ((0, database_1.isDatabaseConnected)()) {
            const updated = await User_1.UserModel.findByIdAndUpdate(userId, {
                $set: {
                    ...(fullName && { fullName: fullName.trim() }),
                    ...(dateOfBirth && { dateOfBirth }),
                    ...(gender && { gender }),
                    ...(bloodGroup && { bloodGroup }),
                    ...(emergencyContact !== undefined && { emergencyContact }),
                    ...(preferredLanguage && { preferredLanguage }),
                    ...(allergies && { allergies }),
                    ...(chronicConditions && { chronicConditions }),
                },
            }, { new: true }).select('-passwordHash');
            if (updated) {
                return (0, response_1.sendSuccess)(res, updated, 'Profile updated in MongoDB Atlas');
            }
        }
    }
    catch (err) {
        return (0, response_1.sendError)(res, `Failed to update profile: ${err.message}`, 500);
    }
    return (0, response_1.sendSuccess)(res, req.body, 'Profile updated');
}
