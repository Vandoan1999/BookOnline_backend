"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.AuthService = void 0;
const auth_repository_1 = require("@repos/auth.repository");
const typedi_1 = require("typedi");
const http_status_codes_1 = require("http-status-codes");
const bcryptjs_1 = require("bcryptjs");
const apiError_1 = require("../ultis/apiError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const image_service_1 = require("./image.service");
require("dotenv").config();
let AuthService = class AuthService {
    constructor(imageService) {
        this.imageService = imageService;
    }
    login(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield auth_repository_1.AuthRepository.getUserByName(request.username);
            if (!user || !(0, bcryptjs_1.compareSync)(request.password, user.password)) {
                throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.NOT_FOUND, "Username or password not correct !");
            }
            const token = jsonwebtoken_1.default.sign({
                id: user.id,
                namename: user.username,
                role: user.role,
                email: user.email,
            }, process.env.JWT_SECRET);
            return token;
        });
    }
    register(request) {
        const user = auth_repository_1.AuthRepository.create(request);
        user.password = (0, bcryptjs_1.hashSync)(user.password, 10);
        return auth_repository_1.AuthRepository.save(user);
    }
    getProfile(userInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield auth_repository_1.AuthRepository.findOne({
                where: {
                    id: userInfo.id,
                },
            });
            const userReturn = yield this.imageService.getImageByObject([user]);
            return userReturn[0];
        });
    }
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield auth_repository_1.AuthRepository.findOneOrFail({
                where: {
                    email,
                },
            });
            user.password = (0, bcryptjs_1.hashSync)("12345678", 10);
            user.is_pass_change = true;
            return auth_repository_1.AuthRepository.save(user);
        });
    }
    changePassword(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield auth_repository_1.AuthRepository.getUserByName(request.username);
            if (!user || !(0, bcryptjs_1.compareSync)(request.oldPassword, user.password)) {
                throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.NOT_FOUND, "Username or password not correct !");
            }
            user.password = (0, bcryptjs_1.hashSync)(request.newPassword, 10);
            user.is_pass_change = false;
            return auth_repository_1.AuthRepository.save(user);
        });
    }
};
AuthService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [image_service_1.ImageService])
], AuthService);
exports.AuthService = AuthService;
