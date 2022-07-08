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
const express_1 = require("express");
const response_builder_1 = require("../ultis/response-builder");
const transformAndValidate_1 = require("../ultis/transformAndValidate");
const typedi_1 = __importDefault(require("typedi"));
const verifyToken_1 = require("@middleware/verifyToken");
const apiError_1 = require("../ultis/apiError");
const http_status_codes_1 = require("http-status-codes");
const list_user_request_1 = require("@models/user/list-user.request");
const user_service_1 = require("@services/user.service");
const update_user_request_1 = require("@models/user/update-user.request");
const role_enum_1 = require("@enums/role.enum");
const router = (0, express_1.Router)();
const url = {
    get: "/",
    add: "/",
    detail: "/:id",
    delete: "/:id",
    update: "",
};
router.get(url.get, verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield (0, transformAndValidate_1.transformAndValidate)(list_user_request_1.ListUserRequest, req.query);
    const userService = typedi_1.default.get(user_service_1.UserService);
    if (req["user"] && req["user"].role === role_enum_1.Role.USER) {
        throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.FORBIDDEN, `user name: ${req["user"].username} and email ${req["user"].email} not have permission!`);
    }
    const [books, total] = yield userService.getList(request);
    return res.json(new response_builder_1.ResponseBuilder(books).withMeta({ total }).withSuccess().build());
}));
router.put(url.update, verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield (0, transformAndValidate_1.transformAndValidate)(update_user_request_1.UpdateUserRequest, req.body);
    const userService = typedi_1.default.get(user_service_1.UserService);
    yield userService.update(request, req["user"]);
    return res.json(new response_builder_1.ResponseBuilder().withSuccess().withMessage("update user success").build());
}));
router.get(url.detail, verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userService = typedi_1.default.get(user_service_1.UserService);
    const user = yield userService.detail(req.params.id, req["user"]);
    return res.json(new response_builder_1.ResponseBuilder(user[0]).withSuccess().build());
}));
router.delete(url.delete, verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req["user"] && req["user"].role === role_enum_1.Role.USER) {
        throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.FORBIDDEN, `user name: ${req["user"].username} and email ${req["user"].email} not have permission delete user!`);
    }
    const userService = typedi_1.default.get(user_service_1.UserService);
    const result = yield userService.delete(req.params.id);
    return res.json(new response_builder_1.ResponseBuilder(result).withSuccess().build());
}));
// Export default
exports.default = router;