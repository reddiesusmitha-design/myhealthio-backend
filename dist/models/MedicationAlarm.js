"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicationAlarmModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const IntakeLogSchema = new mongoose_1.Schema({
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ['TAKEN', 'SKIPPED', 'SNOOZED'], required: true },
    takenAt: { type: Date },
}, { _id: false });
const MedicationAlarmSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, index: true },
    medicineName: { type: String, required: true },
    dosage: { type: String, required: true, default: '1 Tablet' },
    frequency: {
        type: String,
        enum: ['ONCE_DAILY', 'TWICE_DAILY', 'THRICE_DAILY', 'CUSTOM'],
        default: 'TWICE_DAILY',
    },
    timings: { type: [String], default: ['08:00', '20:00'] },
    mealRelation: {
        type: String,
        enum: ['BEFORE_MEAL', 'AFTER_MEAL', 'WITH_MEAL', 'ANYTIME'],
        default: 'AFTER_MEAL',
    },
    instructions: { type: String, default: '' },
    color: { type: String, default: '#0d9488' }, // teal
    pillStock: { type: Number, default: 30 },
    lowStockThreshold: { type: Number, default: 5 },
    active: { type: Boolean, default: true },
    intakeLogs: [IntakeLogSchema],
}, { timestamps: true });
exports.MedicationAlarmModel = mongoose_1.default.models.MedicationAlarm ||
    mongoose_1.default.model('MedicationAlarm', MedicationAlarmSchema);
