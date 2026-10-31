"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// All admin routes require valid auth AND admin role
router.use(auth_1.requireAuth, auth_1.requireAdmin);
router.get('/users', adminController_1.getUsers);
router.patch('/users/:userId/role', adminController_1.updateUserRole);
router.delete('/users/:userId', adminController_1.deleteUser);
router.get('/analytics', adminController_1.getPlatformAnalytics);
router.post('/topics', adminController_1.createTopic);
router.post('/questions', adminController_1.createQuestion);
exports.default = router;
