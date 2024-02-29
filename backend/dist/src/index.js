"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./services/db");
dotenv_1.default.config();
console.log(`Entorno: ${process.env.NODE_ENV}`);
if (process.env.DB_MIGRATE) {
    console.log('Iniciando migración de base datos');
    (0, db_1.dropCreateAndSeedTables)().then(() => {
        console.log('Finalizada migración de base datos');
        process.exit(0);
    });
}
else {
    const port = process.env.PORT || 3001;
    app_1.default.listen(port, () => console.log(`Servidor iniciado en puerto ${port}`));
}
