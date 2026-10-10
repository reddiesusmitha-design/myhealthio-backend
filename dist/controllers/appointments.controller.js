"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAppointments = listAppointments;
exports.createAppointment = createAppointment;
exports.updateAppointment = updateAppointment;
exports.deleteAppointment = deleteAppointment;
const response_1 = require("../utils/response");
const Appointment_1 = require("../models/Appointment");
const database_1 = require("../config/database");
let memoryAppointments = [];
async function listAppointments(req, res) {
    const userId = req.user?.id || 'patient-user-001';
    try {
        if ((0, database_1.isDatabaseConnected)()) {
            const docs = await Appointment_1.AppointmentModel.find({ userId }).sort({ date: 1 });
            return (0, response_1.sendSuccess)(res, docs, 'Appointments retrieved');
        }
    }
    catch (err) {
        // fallback
    }
    const userAppts = memoryAppointments.filter((a) => !a.userId || a.userId === userId);
    return (0, response_1.sendSuccess)(res, userAppts, 'Appointments retrieved');
}
async function createAppointment(req, res) {
    const userId = req.user?.id || 'patient-user-001';
    const { doctorName, specialty, clinicName, date, time, type, reasonForVisit, doctorNotes, nextFollowUpDays, location, contactPhone, } = req.body;
    if (!doctorName || !date || !time || !reasonForVisit) {
        return (0, response_1.sendError)(res, 'Doctor name, date, time, and reason for visit are required', 400);
    }
    const newAppt = {
        id: `appt-${Date.now()}`,
        userId,
        doctorName,
        specialty: specialty || 'General Medicine',
        clinicName: clinicName || 'Health Center',
        date,
        time,
        type: type || 'FOLLOW_UP',
        status: 'UPCOMING',
        reasonForVisit,
        doctorNotes: doctorNotes || '',
        nextFollowUpDays: Number(nextFollowUpDays) || 30,
        reminderSet: true,
        location: location || 'Consultation Room',
        contactPhone: contactPhone || '+91 40 2345 6789',
        createdAt: new Date(),
    };
    try {
        if ((0, database_1.isDatabaseConnected)()) {
            const doc = await Appointment_1.AppointmentModel.create(newAppt);
            return (0, response_1.sendSuccess)(res, doc, 'Appointment scheduled', 201);
        }
    }
    catch (err) {
        // fallback
    }
    memoryAppointments.push(newAppt);
    return (0, response_1.sendSuccess)(res, newAppt, 'Appointment scheduled', 201);
}
async function updateAppointment(req, res) {
    const { id } = req.params;
    const userId = req.user?.id || 'patient-user-001';
    try {
        if ((0, database_1.isDatabaseConnected)()) {
            const updated = await Appointment_1.AppointmentModel.findOneAndUpdate({ _id: id, userId }, { ...req.body }, { new: true });
            if (updated)
                return (0, response_1.sendSuccess)(res, updated, 'Appointment updated');
        }
    }
    catch (err) {
        // fallback
    }
    const idx = memoryAppointments.findIndex((a) => a.id === id || a._id === id);
    if (idx !== -1) {
        memoryAppointments[idx] = { ...memoryAppointments[idx], ...req.body };
        return (0, response_1.sendSuccess)(res, memoryAppointments[idx], 'Appointment updated');
    }
    return (0, response_1.sendSuccess)(res, { id, ...req.body }, 'Appointment updated');
}
async function deleteAppointment(req, res) {
    const { id } = req.params;
    const userId = req.user?.id || 'patient-user-001';
    try {
        if ((0, database_1.isDatabaseConnected)()) {
            await Appointment_1.AppointmentModel.deleteOne({ _id: id, userId });
        }
    }
    catch (err) {
        // fallback
    }
    memoryAppointments = memoryAppointments.filter((a) => a.id !== id && a._id !== id);
    return (0, response_1.sendSuccess)(res, { id }, 'Appointment removed');
}
