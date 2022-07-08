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
const create_rating_request_1 = require("@models/rating/create-rating.request");
const rating_service_1 = require("@services/rating.service");
const router = (0, express_1.Router)();
const url = {
    get: "/",
    add: "/",
    detail: "/:id",
    delete: "/:id",
    update: "/:id",
};
//add new book
router.post(url.add, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield (0, transformAndValidate_1.transformAndValidate)(create_rating_request_1.CreateRatingRequest, req.body);
    const ratingService = typedi_1.default.get(rating_service_1.RatingService);
    yield ratingService.create(request);
    return res.json(new response_builder_1.ResponseBuilder()
        .withSuccess()
        .withMessage("create rating success.")
        .build());
}));
// Export default
exports.default = router;
