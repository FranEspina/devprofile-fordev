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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomHashAsync = exports.compareHashAsync = exports.hashAsync = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function hashAsync(value) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.hash(value, 10);
    });
}
exports.hashAsync = hashAsync;
function compareHashAsync(value, valueHashed) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(valueHashed);
        return yield bcryptjs_1.default.compare(value, valueHashed);
    });
}
exports.compareHashAsync = compareHashAsync;
function generateRandomHashAsync() {
    return __awaiter(this, void 0, void 0, function* () {
        const randomKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const hashedKey = yield bcryptjs_1.default.hash(randomKey, 10);
        return hashedKey;
    });
}
exports.generateRandomHashAsync = generateRandomHashAsync;
