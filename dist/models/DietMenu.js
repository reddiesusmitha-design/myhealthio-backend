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
exports.DietProfileModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const MealItemSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    portion: { type: String, required: true },
    calories: { type: Number, required: true },
    proteinGrams: { type: Number, default: 0 },
    carbsGrams: { type: Number, default: 0 },
    fatsGrams: { type: Number, default: 0 },
    notes: { type: String },
}, { _id: false });
const DayMealPlanSchema = new mongoose_1.Schema({
    mealType: {
        type: String,
        enum: ['BREAKFAST', 'MID_MORNING', 'LUNCH', 'EVENING_SNACK', 'DINNER', 'BEDTIME'],
        required: true,
    },
    scheduledTime: { type: String, required: true },
    items: [MealItemSchema],
    tips: { type: String, default: '' },
}, { _id: false });
const DietProfileSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, index: true },
    planName: { type: String, required: true },
    planType: {
        type: String,
        enum: ['DIABETIC_SAFE', 'CARDIAC_CARE', 'HYPERTENSION_DASH', 'HIGH_PROTEIN', 'BALANCED_WELLNESS'],
        default: 'BALANCED_WELLNESS',
    },
    targetDailyCalories: { type: Number, default: 1800 },
    dailyWaterTargetGlasses: { type: Number, default: 8 },
    waterLoggedGlasses: { type: Number, default: 0 },
    dietaryRestrictions: { type: [String], default: [] },
    meals: [DayMealPlanSchema],
    guidelines: { type: [String], default: [] },
}, { timestamps: true });
exports.DietProfileModel = mongoose_1.default.models.DietProfile || mongoose_1.default.model('DietProfile', DietProfileSchema);
