"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimeline = getTimeline;
const response_1 = require("../utils/response");
const Timeline_1 = require("../models/Timeline");
const database_1 = require("../config/database");
async function getTimeline(req, res) {
    const userId = req.user?.id;
    if (!userId)
        return (0, response_1.sendError)(res, 'Unauthorized', 401);
    try {
        if ((0, database_1.isDatabaseConnected)()) {
            const events = await Timeline_1.TimelineModel.find({ userId }).sort({ eventDate: -1 });
            return (0, response_1.sendSuccess)(res, events, 'Timeline events retrieved from MongoDB Atlas');
        }
    }
    catch (err) {
        return (0, response_1.sendError)(res, `Failed to load timeline: ${err.message}`, 500);
    }
    return (0, response_1.sendSuccess)(res, [], 'Timeline events retrieved');
}
