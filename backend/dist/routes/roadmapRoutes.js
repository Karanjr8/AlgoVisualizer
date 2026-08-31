"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roadmapController_1 = require("../controllers/roadmapController");
const router = (0, express_1.Router)();
router.get('/', roadmapController_1.getRoadmapNodes);
exports.default = router;
