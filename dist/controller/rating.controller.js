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
const create_rating_request_1 = require("@models/rating/create-rating.request");
const rating_service_1 = require("@services/rating.service");
const role_enum_1 = require("@enums/role.enum");
const apiError_1 = require("../ultis/apiError");
const http_status_codes_1 = require("http-status-codes");
const router = (0, express_1.Router)();
const url = {
    get: "/",
    add: "/",
    detail: "/:id",
    delete: "/:user_id/:book_id",
    update: "/:id",
};
//add | update
router.post(url.add, verify_token_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield (0, transformAndValidate_1.transformAndValidate)(create_rating_request_1.CreateRatingRequest, req.body);
    if (req["user"].role === role_enum_1.Role.USER) {
        request.user_id = req["user"].id;
    }
    const ratingService = typedi_1.default.get(rating_service_1.RatingService);
    const message = yield ratingService.createOrUpdate(request);
    return res.json(new response_builder_1.ResponseBuilder().withSuccess().withMessage(message).build());
}));
router.delete(url.delete, verify_token_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const ratingService = typedi_1.default.get(rating_service_1.RatingService);
    if (!((_a = req.params) === null || _a === void 0 ? void 0 : _a.book_id) || !((_b = req.params) === null || _b === void 0 ? void 0 : _b.user_id)) {
        throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    if (req["user"].role === role_enum_1.Role.USER) {
        req.params.user_id = req["user"].id;
    }
    yield ratingService.delete(req.params.book_id, req.params.user_id);
    return res.json(new response_builder_1.ResponseBuilder().withSuccess().withMessage("delete success").build());
}));
// Export default
exports.default = router;
