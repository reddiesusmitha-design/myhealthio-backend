"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const reports_routes_1 = __importDefault(require("./routes/reports.routes"));
const timeline_routes_1 = __importDefault(require("./routes/timeline.routes"));
const profile_routes_1 = __importDefault(require("./routes/profile.routes"));
const notifications_routes_1 = __importDefault(require("./routes/notifications.routes"));
const medications_routes_1 = __importDefault(require("./routes/medications.routes"));
const diet_routes_1 = __importDefault(require("./routes/diet.routes"));
const emergency_routes_1 = __importDefault(require("./routes/emergency.routes"));
const appointments_routes_1 = __importDefault(require("./routes/appointments.routes"));
const firstaid_routes_1 = __importDefault(require("./routes/firstaid.routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const config_1 = require("./config");
const database_1 = require("./config/database");
const app = (0, express_1.default)();
// Security and utility middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: config_1.config.clientUrl,
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        aiProvider: config_1.config.aiProvider,
        database: (0, database_1.getDatabaseStatus)(),
    });
});
// Mount Core & Feature Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/reports', reports_routes_1.default);
app.use('/api/timeline', timeline_routes_1.default);
app.use('/api/profile', profile_routes_1.default);
// New Feature Routes
app.use('/api/notifications', notifications_routes_1.default);
app.use('/api/medications', medications_routes_1.default);
app.use('/api/diet', diet_routes_1.default);
app.use('/api/emergency', emergency_routes_1.default);
app.use('/api/appointments', appointments_routes_1.default);
app.use('/api/firstaid', firstaid_routes_1.default);
// Central error handler
app.use(errorHandler_1.errorHandler);
exports.default = app;
