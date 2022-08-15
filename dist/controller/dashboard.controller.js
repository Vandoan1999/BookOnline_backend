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
const typedi_1 = __importDefault(require("typedi"));
const dashboard_service_1 = require("@services/dashboard.service");
const verify_token_1 = require("@middleware/verify-token");
const verify_user_1 = require("@middleware/verify-user");
const router = (0, express_1.Router)();
const url = {
    get: "/init",
};
router.get(url.get, verify_token_1.verifyToken, verify_user_1.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dashboardService = typedi_1.default.get(dashboard_service_1.DashboardService);
    const result = yield dashboardService.initData();
    return res.json(new response_builder_1.ResponseBuilder(result).withSuccess().build());
}));
exports.default = router;
