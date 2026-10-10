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
exports.ReportModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const MedicalReportSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, index: true },
    originalFilename: { type: String, required: true },
    filePath: { type: String, default: '' },
    mimeType: { type: String, default: 'application/pdf' },
    fileSizeBytes: { type: Number, default: 0 },
    documentType: {
        type: String,
        enum: ['LAB_REPORT', 'PRESCRIPTION', 'DISCHARGE_SUMMARY'],
        default: 'LAB_REPORT',
    },
    documentDate: { type: Date, default: Date.now },
    facility: { type: String, default: 'Clinical Lab' },
    extractedRawText: { type: String },
    processingStatus: {
        type: String,
        enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'],
        default: 'COMPLETED',
    },
    ocrConfidence: { type: Number, default: 95.0 },
    flaggedCount: { type: Number, default: 0 },
    fields: { type: [mongoose_1.Schema.Types.Mixed], default: [] },
    labs: { type: [mongoose_1.Schema.Types.Mixed], default: [] },
    medications: { type: [mongoose_1.Schema.Types.Mixed], default: [] },
    summary: { type: mongoose_1.Schema.Types.Mixed },
}, { timestamps: true });
exports.ReportModel = mongoose_1.default.models.MedicalReport ||
    mongoose_1.default.model('MedicalReport', MedicalReportSchema);
