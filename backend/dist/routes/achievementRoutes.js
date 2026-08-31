"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const achievementController_1 = require("../controllers/achievementController");
const router = (0, express_1.Router)();
router.get('/', achievementController_1.getAllAchievements);
exports.default = router;
