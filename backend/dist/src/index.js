"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./services/db");
if ()
    dotenv_1.default.config();
console.log(process.env.NODE_ENV);
const port = process.env.PORT || 3001;
app_1.default.listen(port, () => console.log(`Servidor iniciado en puerto ${port}`));
(0, db_1.createTables)();
