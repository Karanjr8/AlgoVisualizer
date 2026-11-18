"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const interviewController_1 = require("../controllers/interviewController");
const router = (0, express_1.Router)();
// Apply optionalAuth across interview endpoints to link authenticated users while keeping guest practice available
router.post('/', auth_1.optionalAuth, interviewController_1.createInterview);
router.get('/', auth_1.optionalAuth, interviewController_1.listUserInterviews);
router.get('/:id', auth_1.optionalAuth, interviewController_1.getInterview);
router.post('/:id/answers', auth_1.optionalAuth, interviewController_1.submitAnswer);
router.post('/:id/end', auth_1.optionalAuth, interviewController_1.endInterview);
router.post('/:id/retry-report', auth_1.optionalAuth, interviewController_1.retryReport);
router.get('/:id/report', auth_1.optionalAuth, interviewController_1.getInterviewReport);
exports.default = router;
