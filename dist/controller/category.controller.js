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
const create_category_request_1 = require("@models/category/create-category.request");
const category_service_1 = require("@services/category.service");
const express_1 = require("express");
const response_builder_1 = require("../ultis/response-builder");
const transformAndValidate_1 = require("../ultis/transformAndValidate");
const typedi_1 = require("typedi");
const verify_token_1 = require("@middleware/verify-token");
const update_category_request_1 = require("@models/category/update-category.request");
const verify_user_1 = require("@middleware/verify-user");
const multer_1 = require("@common/multer");
const router = (0, express_1.Router)();
const url = {
    get: "/",
    detail: "/:id",
    delete: "/:id",
    create: "/",
    update: "/",
};
router.get(url.get, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryService = typedi_1.Container.get(category_service_1.CategoryService);
    const { category, total } = yield categoryService.getList();
    res.json(new response_builder_1.ResponseBuilder(category)
        .withSuccess()
        .withMeta({ total: total })
        .build());
}));
router.get(url.detail, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryService = typedi_1.Container.get(category_service_1.CategoryService);
    const category = yield categoryService.detail(req.params.id);
    res.json(new response_builder_1.ResponseBuilder(category).withSuccess().build());
}));
router.delete(url.delete, verify_token_1.verifyToken, verify_user_1.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryService = typedi_1.Container.get(category_service_1.CategoryService);
    const category = yield categoryService.delete(req.params.id, req["user"]);
    res.json(new response_builder_1.ResponseBuilder(category).withSuccess().build());
}));
router.post(url.create, verify_token_1.verifyToken, verify_user_1.verifyUser, multer_1.upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield (0, transformAndValidate_1.transformAndValidate)(create_category_request_1.CreateCategoryRequest, req.body);
    if (req.file) {
        request.image_data = req.file;
    }
    const categoryService = typedi_1.Container.get(category_service_1.CategoryService);
    yield categoryService.create(request, req["user"]);
    res.json(new response_builder_1.ResponseBuilder().withSuccess().build());
}));
router.put(url.update, verify_token_1.verifyToken, verify_user_1.verifyUser, multer_1.upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield (0, transformAndValidate_1.transformAndValidate)(update_category_request_1.UpdateCategoryRequest, req.body);
    const categoryService = typedi_1.Container.get(category_service_1.CategoryService);
    if (req.file) {
        request.image_data = req.file;
    }
    yield categoryService.update(request, req["user"]);
    res.json(new response_builder_1.ResponseBuilder().withSuccess().build());
}));
exports.default = router;
