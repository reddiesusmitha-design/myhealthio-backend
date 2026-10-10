"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listMedicationAlarms = listMedicationAlarms;
exports.createMedicationAlarm = createMedicationAlarm;
exports.logDoseIntake = logDoseIntake;
exports.updateMedicationAlarm = updateMedicationAlarm;
exports.deleteMedicationAlarm = deleteMedicationAlarm;
const response_1 = require("../utils/response");
const MedicationAlarm_1 = require("../models/MedicationAlarm");
const database_1 = require("../config/database");
let memoryAlarms = [];
async function listMedicationAlarms(req, res) {
    const userId = req.user?.id || 'patient-user-001';
    try {
        if ((0, database_1.isDatabaseConnected)()) {
            const docs = await MedicationAlarm_1.MedicationAlarmModel.find({ userId }).sort({ createdAt: -1 });
            return (0, response_1.sendSuccess)(res, docs, 'Medication alarms retrieved');
        }
    }
    catch (err) {
        // fallback
    }
    const userAlarms = memoryAlarms.filter((a) => !a.userId || a.userId === userId);
    return (0, response_1.sendSuccess)(res, userAlarms, 'Medication alarms retrieved');
}
async function createMedicationAlarm(req, res) {
    const userId = req.user?.id || 'patient-user-001';
    const { medicineName, dosage, frequency, timings, mealRelation, instructions, color, pillStock, lowStockThreshold, } = req.body;
    if (!medicineName || !timings || !timings.length) {
        return (0, response_1.sendError)(res, 'Medicine name and at least one timing are required', 400);
    }
    const newAlarm = {
        id: `alarm-${Date.now()}`,
        userId,
        medicineName,
        dosage: dosage || '1 Tablet',
        frequency: frequency || 'ONCE_DAILY',
        timings: Array.isArray(timings) ? timings : [timings],
        mealRelation: mealRelation || 'AFTER_MEAL',
        instructions: instructions || '',
        color: color || '#0d9488',
        pillStock: Number(pillStock) || 30,
        lowStockThreshold: Number(lowStockThreshold) || 5,
        active: true,
        intakeLogs: [],
        createdAt: new Date(),
    };
    try {
        if ((0, database_1.isDatabaseConnected)()) {
            const doc = await MedicationAlarm_1.MedicationAlarmModel.create(newAlarm);
            return (0, response_1.sendSuccess)(res, doc, 'Medication alarm scheduled', 201);
        }
    }
    catch (err) {
        // fallback
    }
    memoryAlarms.unshift(newAlarm);
    return (0, response_1.sendSuccess)(res, newAlarm, 'Medication alarm scheduled', 201);
}
async function logDoseIntake(req, res) {
    const { id } = req.params;
    const { status, time, date } = req.body; // status: 'TAKEN' | 'SKIPPED' | 'SNOOZED'
    const userId = req.user?.id || 'patient-user-001';
    const logEntry = {
        date: date || new Date().toISOString().split('T')[0],
        time: time || '08:00',
        status: status || 'TAKEN',
        takenAt: new Date(),
    };
    try {
        if ((0, database_1.isDatabaseConnected)()) {
            const alarm = await MedicationAlarm_1.MedicationAlarmModel.findOne({ _id: id, userId });
            if (alarm) {
                alarm.intakeLogs.push(logEntry);
                if (status === 'TAKEN' && alarm.pillStock > 0) {
                    alarm.pillStock -= 1;
                }
                await alarm.save();
                return (0, response_1.sendSuccess)(res, alarm, `Dose marked as ${status}`);
            }
        }
    }
    catch (err) {
        // fallback
    }
    const found = memoryAlarms.find((a) => a.id === id || a._id === id);
    if (found) {
        if (!found.intakeLogs)
            found.intakeLogs = [];
        found.intakeLogs.push(logEntry);
        if (status === 'TAKEN' && found.pillStock > 0) {
            found.pillStock -= 1;
        }
        return (0, response_1.sendSuccess)(res, found, `Dose marked as ${status}`);
    }
    return (0, response_1.sendSuccess)(res, { id, status }, `Dose marked as ${status}`);
}
async function updateMedicationAlarm(req, res) {
    const { id } = req.params;
    const userId = req.user?.id || 'patient-user-001';
    try {
        if ((0, database_1.isDatabaseConnected)()) {
            const updated = await MedicationAlarm_1.MedicationAlarmModel.findOneAndUpdate({ _id: id, userId }, { ...req.body }, { new: true });
            if (updated)
                return (0, response_1.sendSuccess)(res, updated, 'Medication alarm updated');
        }
    }
    catch (err) {
        // fallback
    }
    const idx = memoryAlarms.findIndex((a) => a.id === id || a._id === id);
    if (idx !== -1) {
        memoryAlarms[idx] = { ...memoryAlarms[idx], ...req.body };
        return (0, response_1.sendSuccess)(res, memoryAlarms[idx], 'Medication alarm updated');
    }
    return (0, response_1.sendSuccess)(res, { id, ...req.body }, 'Medication alarm updated');
}
async function deleteMedicationAlarm(req, res) {
    const { id } = req.params;
    const userId = req.user?.id || 'patient-user-001';
    try {
        if ((0, database_1.isDatabaseConnected)()) {
            await MedicationAlarm_1.MedicationAlarmModel.deleteOne({ _id: id, userId });
        }
    }
    catch (err) {
        // fallback
    }
    memoryAlarms = memoryAlarms.filter((a) => a.id !== id && a._id !== id);
    return (0, response_1.sendSuccess)(res, { id }, 'Medication alarm removed');
}
