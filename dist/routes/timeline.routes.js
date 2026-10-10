"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const timeline_controller_1 = require("../controllers/timeline.controller");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/', timeline_controller_1.getTimeline);
exports.default = router;
