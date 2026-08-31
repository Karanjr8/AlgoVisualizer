"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const practiceController_1 = require("../controllers/practiceController");
const router = (0, express_1.Router)();
router.post('/attempts', practiceController_1.savePracticeAttempt);
exports.default = router;
