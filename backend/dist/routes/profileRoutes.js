"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const profileController_1 = require("../controllers/profileController");
const router = (0, express_1.Router)();
// Apply auth middleware to all profile routes
router.use(auth_1.requireAuth);
router.get('/', profileController_1.getUserProfile);
router.put('/', profileController_1.updateUserProfile);
router.get('/dashboard', profileController_1.getDashboardData);
router.post('/events', profileController_1.logUserEvent);
router.post('/activity', profileController_1.recordUserActivity);
router.get('/progress', profileController_1.getUserProgress);
router.get('/practice-stats', profileController_1.getUserPracticeStats);
router.get('/feed', profileController_1.getUserFeed);
router.get('/recommendations', profileController_1.getUserRecommendations);
exports.default = router;
