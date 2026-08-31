"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const algorithmController_1 = require("../controllers/algorithmController");
const router = (0, express_1.Router)();
router.get('/', algorithmController_1.getAllAlgorithms);
router.get('/:slug', algorithmController_1.getAlgorithmBySlug);
exports.default = router;
