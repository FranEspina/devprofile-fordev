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
exports.createUser = exports.getUserByEmail = exports.dropCreateAndSeedTables = void 0;
const pg_1 = require("pg");
const cryptService_1 = require("./cryptService");
const pool = new pg_1.Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    database: process.env.POSTGRES_DB,
    ssl: process.env.POSTGRES_SSL === 'true'
});
const dropCreateAndSeedTables = () => __awaiter(void 0, void 0, void 0, function* () {
    const dropTables = `
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS resources;
  `;
    yield pool.query(dropTables)
        .then(() => {
        console.log('- ELiminadas todas las tablas');
    })
        .catch((err) => {
        console.log('Error inesperado eliminando tablas');
        console.log(err);
    });
    const usersTable = `CREATE TABLE IF NOT EXISTS
      users(
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(128) NOT NULL,
        last_name VARCHAR(128) NOT NULL,
        email VARCHAR(128) NOT NULL,
        password VARCHAR(128) NOT NULL
      )`;
    yield pool.query(usersTable)
        .then(() => {
        console.log('- tabla usuarios creada');
    })
        .catch((err) => {
        console.log('Error inesperado creando tabla: usuarios');
        console.log(err);
    });
    //Usuario por defecto en entorno de desarrollo  
    if (process.env.NODE_ENV === 'development') {
        const defaultUser = 'admin';
        const defaultPassword = defaultUser;
        const defaultHashPassword = yield (0, cryptService_1.hashAsync)(defaultPassword);
        const seedUserQuery = 'INSERT INTO users(first_name, last_name, email, password) VALUES($1, $2, $3, $4)';
        yield pool.query(seedUserQuery, [defaultUser, defaultUser, `${defaultUser}@correo.com`, defaultHashPassword])
            .then(() => {
            console.log(`- Generado usuario por defecto: ${defaultUser}@correo.com:${defaultPassword}`);
        })
            .catch((err) => {
            console.log('Error inesperado creando usuario genérico');
            console.log(err);
        });
    }
    const resourcesTable = `
    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'resourcetype') THEN
            CREATE TYPE resourceType AS ENUM ('markdown', 'imagen', 'web', 'archivo');
        END IF;
    END
    $$ LANGUAGE plpgsql;
    CREATE TABLE IF NOT EXISTS
      resources(
        id SERIAL PRIMARY KEY,
        title VARCHAR(128) NOT NULL,
        description TEXT NOT NULL,
        type resourceType NOT NULL,
        keywords TEXT NOT NULL
      )`;
    yield pool.query(resourcesTable)
        .then(() => {
        console.log('- tabla recursos creada');
    })
        .catch((err) => {
        console.log('Error inesperado creando tabla: recursos');
        console.log(err);
    });
});
exports.dropCreateAndSeedTables = dropCreateAndSeedTables;
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield pool.query('SELECT id, first_name, last_name, password FROM users WHERE email = $1', [email]);
        if (!result || !result.rowCount)
            return null;
        return {
            id: result.rows[0]['id'],
            email: email,
            hashPassword: result.rows[0]['password'],
            firstName: result.rows[0]['first_name'],
            lastName: result.rows[0]['last_name']
        };
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
            return ({ id: result.rows[0].id, email, firstName, lastName });
        }
        catch (error) {
            console.log('Error inesperado creando usuario', error);
            throw error;
        }
    });
}
exports.createUser = createUser;
