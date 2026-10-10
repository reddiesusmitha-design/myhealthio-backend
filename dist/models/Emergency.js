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
exports.AmbulanceDispatchModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const AmbulanceDispatchSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, index: true },
    patientName: { type: String, required: true },
    patientPhone: { type: String, required: true },
    bloodGroup: { type: String, default: 'O+' },
    criticalConditions: { type: [String], default: [] },
    allergies: { type: [String], default: [] },
    location: {
        latitude: { type: Number, default: 17.385 },
        longitude: { type: Number, default: 78.4867 },
        address: { type: String, required: true },
        landmark: { type: String },
    },
    severity: {
        type: String,
        enum: ['CRITICAL', 'URGENT', 'STANDARD'],
        default: 'CRITICAL',
    },
    ambulanceType: {
        type: String,
        enum: ['ADVANCED_CARDIAC_ICU', 'BASIC_LIFE_SUPPORT', 'GENERAL_TRANSPORT'],
        default: 'ADVANCED_CARDIAC_ICU',
    },
    status: {
        type: String,
        enum: ['REQUESTED', 'DISPATCHED', 'EN_ROUTE', 'ARRIVED', 'COMPLETED', 'CANCELLED'],
        default: 'DISPATCHED',
    },
    hospitalDestination: { type: String, default: 'Apollo Emergency Medical Centre' },
    ambulanceDetails: {
        providerName: { type: String, default: '108 EMRI Emergency Response' },
        vehicleNumber: { type: String, default: 'TS-09-EM-1088' },
        driverName: { type: String, default: 'Rajesh Kumar (Paramedic Team A)' },
        driverPhone: { type: String, default: '+91 98490 10811' },
        etaMinutes: { type: Number, default: 6 },
    },
    emergencyContactsNotified: { type: Boolean, default: true },
    notes: { type: String },
}, { timestamps: true });
exports.AmbulanceDispatchModel = mongoose_1.default.models.AmbulanceDispatch ||
    mongoose_1.default.model('AmbulanceDispatch', AmbulanceDispatchSchema);
