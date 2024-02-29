"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const devResourceRoute_1 = __importDefault(require("./routes/devResourceRoute"));
const app = (0, express_1.default)();
const corsOptions = {
    origin: 'http://localhost:4321'
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    extended: true,
}));
app.use((0, morgan_1.default)('combined'));
app.use('/auth', authRoute_1.default);
app.use('/resource', devResourceRoute_1.default);
exports.default = app;
