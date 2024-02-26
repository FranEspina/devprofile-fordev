"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function createAccessToken(payload) {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.sign(payload, process.env.TOKEN_SECRET || '', {
            'expiresIn': process.env.TOKEN_EXPIRES_IN
        }, (err, token) => {
            if (err)
                reject(err);
            resolve(token);
        });
    });
}
exports.createAccessToken = createAccessToken;
