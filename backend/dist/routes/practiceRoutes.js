"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const practiceController_1 = require("../controllers/practiceController");
const router = (0, express_1.Router)();
// General practice endpoints
router.post('/attempts', auth_1.optionalAuth, practiceController_1.savePracticeAttempt);
router.get('/history', auth_1.optionalAuth, practiceController_1.getPracticeHistory);
// 1. Debug The Algorithm routes
router.post('/debug/generate', auth_1.optionalAuth, practiceController_1.generateDebugChallenge);
router.post('/debug/run', auth_1.optionalAuth, practiceController_1.runDebugCode);
router.post('/debug/evaluate', auth_1.optionalAuth, practiceController_1.evaluateDebugSolution);
// 2. Speed Run routes
router.post('/speedrun/generate', auth_1.optionalAuth, practiceController_1.generateSpeedRun);
router.post('/speedrun/evaluate', auth_1.optionalAuth, practiceController_1.evaluateSpeedRun);
// 3. Complexity Challenges routes
router.post('/complexity/generate', auth_1.optionalAuth, practiceController_1.generateComplexityChallenges);
router.post('/complexity/evaluate', auth_1.optionalAuth, practiceController_1.evaluateComplexityAnswer);
exports.default = router;
