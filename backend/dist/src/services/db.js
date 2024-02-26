"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.getUserByEmail = exports.createTables = exports.query = void 0;
const pg_1 = require("pg");
const user_1 = require("../models/user");
const pool = new pg_1.Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    database: process.env.POSTGRES_DB,
    ssl: process.env.POSTGRES_SSL === 'true'
});
function query(text, params = null) {
    if (params) {
        return pool.query(text, params);
    }
    return pool.query(text);
}
exports.query = query;
const createTables = () => {
    const usersTable = `CREATE TABLE IF NOT EXISTS
      users(
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(128) NOT NULL,
        last_name VARCHAR(128) NOT NULL,
        email VARCHAR(128) NOT NULL,
        password VARCHAR(128) NOT NULL
      )`;
    pool.query(usersTable)
        .then(() => {
        console.log('tablas creadas');
    })
        .catch((err) => {
        console.log('Error inesperado creando tablas');
        console.log(err);
    });
};
exports.createTables = createTables;
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield pool.query('SELECT first_name, last_name, password FROM users WHERE email = $1', [email]);
        if (!result || !result.rowCount)
            return null;
        const id = result.rows[0]['id'];
        const password = result.rows[0]['password'];
        const firstName = result.rows[0]['first_name'];
        const lastName = result.rows[0]['last_name'];
        return new user_1.User({ id, email, firstName, lastName, password });
    }
    catch (error) {
        console.log('Error inesperado recuperando usuario por email', error);
        throw error;
    }
});
exports.getUserByEmail = getUserByEmail;
function createUser({ email, firstName, lastName, hashPassword }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield pool.query('INSERT INTO users(EMAIL, FIRST_NAME, LAST_NAME, PASSWORD) VALUES ($1, $2, $3, $4) RETURNING id', [email, firstName, lastName, hashPassword]);
            return new user_1.User({ id: result.rows[0].id, email, firstName, lastName, password: hashPassword });
        }
        catch (error) {
            console.log('Error inesperado creando usuario', error);
            throw error;
        }
    });
}
exports.createUser = createUser;
