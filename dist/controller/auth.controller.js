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
const login_request_1 = require("@models/auth/login.request");
const register_request_1 = require("@models/auth/register.request");
const auth_service_1 = require("@services/auth.service");
const express_1 = require("express");
const response_builder_1 = require("../ultis/response-builder");
const transformAndValidate_1 = require("../ultis/transformAndValidate");
const typedi_1 = require("typedi");
const verify_token_1 = require("@middleware/verify-token");
const change_password_request_1 = require("@models/auth/change-password.request");
const router = (0, express_1.Router)();
const url = {
    login: "/login",
    register: "/register",
    profile: "/profile",
    forgot_password: "/forgot-password",
    change_password: "/change-password",
};
router.post(url.login, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield (0, transformAndValidate_1.transformAndValidate)(login_request_1.LoginRequest, req.body);
    const authService = typedi_1.Container.get(auth_service_1.AuthService);
    const token = yield authService.login(request);
    res.json(new response_builder_1.ResponseBuilder({ accessToken: token }).withSuccess().build());
}));
router.post(url.forgot_password, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authService = typedi_1.Container.get(auth_service_1.AuthService);
    const user = yield authService.forgotPassword(req.body.email ? req.body.email : "");
    res.json(new response_builder_1.ResponseBuilder(user)
        .withMessage("Password was successfully reseted!")
        .withSuccess()
        .build());
}));
router.post(url.change_password, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield (0, transformAndValidate_1.transformAndValidate)(change_password_request_1.ChangePasswordRequest, req.body);
    const authService = typedi_1.Container.get(auth_service_1.AuthService);
    yield authService.changePassword(request);
    res.json(new response_builder_1.ResponseBuilder()
        .withMessage("Password was successfully changed")
        .withSuccess()
        .build());
}));
router.post(url.register, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield (0, transformAndValidate_1.transformAndValidate)(register_request_1.RegisterRequest, req.body);
    const authService = typedi_1.Container.get(auth_service_1.AuthService);
    yield authService.register(request);
    res.json(new response_builder_1.ResponseBuilder()
        .withSuccess()
        .withMessage("Account has been created successfully")
        .build());
}));
router.get(url.profile, verify_token_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authService = typedi_1.Container.get(auth_service_1.AuthService);
    const user = yield authService.getProfile(req["user"]);
    res.json(new response_builder_1.ResponseBuilder(user).withSuccess().build());
}));
// Export default
exports.default = router;
