"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listNotifications = listNotifications;
exports.markNotificationAsRead = markNotificationAsRead;
exports.markAllNotificationsRead = markAllNotificationsRead;
exports.createNotification = createNotification;
exports.deleteNotification = deleteNotification;
const response_1 = require("../utils/response");
const Notification_1 = require("../models/Notification");
const database_1 = require("../config/database");
// In-memory fallback notifications
let memoryNotifications = [];
async function listNotifications(req, res) {
    const userId = req.user?.id || 'patient-user-001';
    try {
        if ((0, database_1.isDatabaseConnected)()) {
            const docs = await Notification_1.NotificationModel.find({ userId }).sort({ createdAt: -1 }).limit(50);
            return (0, response_1.sendSuccess)(res, docs, 'Notifications fetched successfully');
        }
    }
    catch (err) {
        // fallback to memory
    }
    const userNotifs = memoryNotifications.filter((n) => !n.userId || n.userId === userId);
    return (0, response_1.sendSuccess)(res, userNotifs, 'Notifications fetched successfully');
}
async function markNotificationAsRead(req, res) {
    const { id } = req.params;
    const userId = req.user?.id || 'patient-user-001';
    try {
        if ((0, database_1.isDatabaseConnected)()) {
            const updated = await Notification_1.NotificationModel.findOneAndUpdate({ _id: id, userId }, { read: true }, { new: true });
            if (updated)
                return (0, response_1.sendSuccess)(res, updated, 'Notification marked as read');
        }
    }
    catch (err) {
        // fallback
    }
    const notif = memoryNotifications.find((n) => n.id === id || n._id === id);
    if (notif) {
        notif.read = true;
        return (0, response_1.sendSuccess)(res, notif, 'Notification marked as read');
    }
    return (0, response_1.sendSuccess)(res, { id, read: true }, 'Notification marked as read');
}
async function markAllNotificationsRead(req, res) {
    const userId = req.user?.id || 'patient-user-001';
    try {
        if ((0, database_1.isDatabaseConnected)()) {
            await Notification_1.NotificationModel.updateMany({ userId }, { read: true });
        }
    }
    catch (err) {
        // fallback
    }
    memoryNotifications.forEach((n) => {
        if (!n.userId || n.userId === userId)
            n.read = true;
    });
    return (0, response_1.sendSuccess)(res, { success: true }, 'All notifications marked as read');
}
async function createNotification(req, res) {
    const userId = req.user?.id || 'patient-user-001';
    const { title, message, type, priority, actionUrl } = req.body;
    if (!title || !message) {
        return (0, response_1.sendError)(res, 'Title and message are required', 400);
    }
    const newNotif = {
        id: `notif-${Date.now()}`,
        userId,
        title,
        message,
        type: type || 'SYSTEM',
        priority: priority || 'NORMAL',
        read: false,
        actionUrl: actionUrl || '',
        createdAt: new Date(),
    };
    try {
        if ((0, database_1.isDatabaseConnected)()) {
            const doc = await Notification_1.NotificationModel.create(newNotif);
            return (0, response_1.sendSuccess)(res, doc, 'Notification created', 201);
        }
    }
    catch (err) {
        // fallback
    }
    memoryNotifications.unshift(newNotif);
    return (0, response_1.sendSuccess)(res, newNotif, 'Notification created', 201);
}
async function deleteNotification(req, res) {
    const { id } = req.params;
    const userId = req.user?.id || 'patient-user-001';
    try {
        if ((0, database_1.isDatabaseConnected)()) {
            await Notification_1.NotificationModel.deleteOne({ _id: id, userId });
        }
    }
    catch (err) {
        // fallback
    }
    memoryNotifications = memoryNotifications.filter((n) => n.id !== id && n._id !== id);
    return (0, response_1.sendSuccess)(res, { id }, 'Notification deleted');
}
