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
const verify_token_1 = require("@middleware/verify-token");
const list_user_request_1 = require("@models/user/list-user.request");
const user_service_1 = require("@services/user.service");
const update_user_request_1 = require("@models/user/update-user.request");
const router = (0, express_1.Router)();
const url = {
    get: "/",
    add: "/",
    detail: "/:id",
    delete: "/:id",
    update: "",
};
router.get(url.get, verify_token_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield (0, transformAndValidate_1.transformAndValidate)(list_user_request_1.ListUserRequest, req.query);
    const userService = typedi_1.default.get(user_service_1.UserService);
    const { users, total } = yield userService.getList(request);
    return res.json(new response_builder_1.ResponseBuilder(users)
        .withMeta({ total })
        .withSuccess()
        .build());
}));
router.put(url.update, verify_token_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield (0, transformAndValidate_1.transformAndValidate)(update_user_request_1.UpdateUserRequest, req.body);
    const userService = typedi_1.default.get(user_service_1.UserService);
    const user = yield userService.update(request, req["user"]);
    return res.json(new response_builder_1.ResponseBuilder(user)
        .withSuccess()
        .withMessage("update user success")
        .build());
}));
router.get(url.detail, verify_token_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userService = typedi_1.default.get(user_service_1.UserService);
    const user = yield userService.detail(req.params.id, req["user"]);
    return res.json(new response_builder_1.ResponseBuilder(user).withSuccess().build());
}));
// Export default
exports.default = router;
