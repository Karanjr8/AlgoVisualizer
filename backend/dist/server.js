"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
app_1.default.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    // Minimal diagnostic log
    console.log('Routes mounted:');
    const r = app_1.default._router;
    if (r && r.stack) {
        for (let i = 0; i < r.stack.length; i++) {
            const layer = r.stack[i];
            if (layer.name === 'router') {
                console.log(layer.regexp);
            }
        }
    }
});
setInterval(() => { }, 1000 * 60 * 60);
