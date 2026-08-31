"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const questionController_1 = require("../controllers/questionController");
const router = (0, express_1.Router)();
router.get('/', questionController_1.getAllQuestions);
router.get('/:id', questionController_1.getQuestionById);
exports.default = router;
