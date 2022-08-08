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
const create_book_request_1 = require("@models/book/create-book.request");
const book_service_1 = require("@services/book.service");
const express_1 = require("express");
const response_builder_1 = require("../ultis/response-builder");
const transformAndValidate_1 = require("../ultis/transformAndValidate");
const typedi_1 = __importDefault(require("typedi"));
const verify_token_1 = require("@middleware/verify-token");
const list_book_request_1 = require("@models/book/list-book.request");
const update_book_request_1 = require("@models/book/update-book.request");
const apiError_1 = require("../ultis/apiError");
const http_status_codes_1 = require("http-status-codes");
const verify_user_1 = require("@middleware/verify-user");
const multer_1 = require("@common/multer");
const update_book_category_request_1 = require("@models/book/update-book-category.request");
const router = (0, express_1.Router)();
const url = {
    get: "/",
    add: "/",
    category: "/category",
    image: "/image",
    detail: "/:id",
    delete: "/:id",
    update: "/",
    delete_multiple: "/multiple",
};
//get list book
router.get(url.get, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield (0, transformAndValidate_1.transformAndValidate)(list_book_request_1.ListBookRequest, req.query);
    const bookService = typedi_1.default.get(book_service_1.BookService);
    const { data, total } = yield bookService.getList(request);
    return res.json(new response_builder_1.ResponseBuilder(data)
        .withMeta({ total })
        .withSuccess()
        .build());
}));
router.put(url.category, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield (0, transformAndValidate_1.transformAndValidate)(update_book_category_request_1.UpdateBookCategoryRequest, req.body);
    const bookService = typedi_1.default.get(book_service_1.BookService);
    yield bookService.updateCategory(request);
    return res.json(new response_builder_1.ResponseBuilder().withSuccess().build());
}));
router.post(url.add, verify_token_1.verifyToken, verify_user_1.verifyUser, multer_1.upload.fields([
    {
        name: "avartar",
        maxCount: 1,
    },
    {
        name: "images",
        maxCount: 5,
    },
]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield (0, transformAndValidate_1.transformAndValidate)(create_book_request_1.CreateBookRequest, req.body);
    const bookService = typedi_1.default.get(book_service_1.BookService);
    if (req.files["images"]) {
        request.images_data = req.files["images"];
    }
    if (req.files["avartar"]) {
        request.avatar_data = req.files["avartar"];
    }
    yield bookService.create(request);
    return res.json(new response_builder_1.ResponseBuilder()
        .withSuccess()
        .withMessage("create product success.")
        .build());
}));
//update book
router.put(url.update, verify_token_1.verifyToken, verify_user_1.verifyUser, multer_1.upload.fields([
    {
        name: "avartar",
        maxCount: 1,
    },
    {
        name: "images",
        maxCount: 5,
    },
]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const request = yield (0, transformAndValidate_1.transformAndValidate)(update_book_request_1.UpdateBookRequest, req.body);
    if (req.files["images"]) {
        request.images_data = req.files["images"];
    }
    if (req.files["avartar"]) {
        request.avatar_data = req.files["avartar"];
    }
    const bookService = typedi_1.default.get(book_service_1.BookService);
    yield bookService.update(request);
    return res.json(new response_builder_1.ResponseBuilder().withSuccess().withMessage("").build());
}));
//get detail book
router.get(url.detail, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.id) {
        throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.BAD_REQUEST, "id param empty");
    }
    const bookService = typedi_1.default.get(book_service_1.BookService);
    const book = yield bookService.detail(req.params.id);
    return res.json(new response_builder_1.ResponseBuilder(book).withSuccess().build());
}));
//delete multiple
router.delete(url.delete_multiple, verify_token_1.verifyToken, verify_user_1.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookService = typedi_1.default.get(book_service_1.BookService);
    const result = yield bookService.delete_multiple(req);
    return res.json(new response_builder_1.ResponseBuilder({ book_deleted: result }).withSuccess().build());
}));
//delete book
router.delete(url.delete, verify_token_1.verifyToken, verify_user_1.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.id) {
        throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.BAD_REQUEST, "id param empty");
    }
    const bookService = typedi_1.default.get(book_service_1.BookService);
    yield bookService.delete(req.params.id);
    return res.json(new response_builder_1.ResponseBuilder()
        .withSuccess()
        .withMessage("delete book success ")
        .build());
}));
// Export default
exports.default = router;
