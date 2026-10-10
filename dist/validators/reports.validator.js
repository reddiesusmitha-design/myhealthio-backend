"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewFieldSchema = void 0;
const zod_1 = require("zod");
exports.reviewFieldSchema = zod_1.z.object({
    fieldId: zod_1.z.string().uuid('Invalid field identifier'),
    reviewedValue: zod_1.z.string().min(1, 'Reviewed value cannot be empty'),
    isApproved: zod_1.z.boolean(),
});
