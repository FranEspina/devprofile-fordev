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
exports.login = exports.register = void 0;
const db_1 = require("../services/db");
const tokenService_1 = require("../services/tokenService");
const cryptService_1 = require("../services/cryptService");
const validationService_1 = require("../services/validationService");
const userSchema_1 = require("../schemas/userSchema");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
  try {
    //TODO: Pasar a un middleware de express
    const { success, user, errors } = yield (0, validationService_1.validateSchemaAsync)(userSchema_1.UserRegisterSchema, req.body);
    if (!success || user === undefined) {
      res.status(400).json({
        status: 400,
        success: false,
        code: 'INVALID BODY',
        message: (errors === null || errors === void 0 ? void 0 : errors.join(';')) || 'Error inesesperado validando datos',
      });
      return;
    }
    const { firstName, lastName, email, password } = user;
    const userSaved = yield (0, db_1.getUserByEmail)(email);
    if (userSaved) {
      res.status(400).json({
        status: 400,
        success: false,
        code: 'EMAIL_EXIST',
        message: 'El e-mail ya está en uso',
      });
      return;
    }
    const hashPassword = yield (0, cryptService_1.hashAsync)(password);
    const newUser = yield (0, db_1.createUser)({ firstName, lastName, email, hashPassword });
    const payload = { id: newUser.id };
    const token = yield (0, tokenService_1.createAccessToken)(payload);
    const userDTO = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
    };
    res.status(201).json({
      status: 201,
      success: true,
      message: 'Usuario registrado correctamente',
      data: userDTO,
      token: token
    });
  }
  catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      success: false,
      code: 'UNEXPECTED_ERROR_REGISTERING',
      message: 'error inesperado registrando usuario'
    });
  }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
  //TODO: Pasar a un middleware de express
  const { success, user, errors } = yield (0, validationService_1.validateSchemaAsync)(userSchema_1.UserLoginSchema, req.body);
  if (!success || user === undefined) {
    res.status(400).json({
      status: 400,
      success: false,
      code: 'INVALID BODY',
      message: (errors === null || errors === void 0 ? void 0 : errors.join(';')) || 'Error inesesperado validando datos',
    });
    return;
  }
  const { email, password } = user;
  const userSaved = yield (0, db_1.getUserByEmail)(email);
  if (!userSaved) {
    res.status(400).json({
      success: false,
      status: 400,
      code: 'USER_NOT_FOUND',
      message: 'Usuario no encontrado',
    });
    return;
  }
  const okPassword = yield (0, cryptService_1.compareHashAsync)(password, userSaved.hashPassword);
  if (!okPassword) {
    return res.status(400)
      .json({
        success: false,
        status: 400,
        code: 'USER_OR_PASSWORD_WRONG',
        message: 'Usuario y/o contraseña incorrectos'
      });
  }
  const payload = { id: userSaved.id };
  const token = yield (0, tokenService_1.createAccessToken)(payload);
  const userDTO = {
    id: userSaved.id,
    email: userSaved.email,
    firstName: userSaved.firstName,
    lastName: userSaved.lastName,
  };
  res.status(200).json({
    status: 200,
    success: true,
    message: 'Usuario logado correctamente',
    data: userDTO,
    token: token
  });
});
exports.login = login;
