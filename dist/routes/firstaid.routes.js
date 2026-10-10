"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firstaid_controller_1 = require("../controllers/firstaid.controller");
const router = (0, express_1.Router)();
router.get('/', firstaid_controller_1.listFirstAidGuides);
router.get('/:slug', firstaid_controller_1.getFirstAidGuideBySlug);
exports.default = router;
