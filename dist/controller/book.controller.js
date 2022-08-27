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
const router = (0, express_1.Router)();
const url = {
    get: "/",
    add: "/",
    detail: "/:id",
    delete: "/:ids",
    update: "/",
};
//get list book
router.get(url.get, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield (0, transformAndValidate_1.transformAndValidate)(list_book_request_1.ListBookRequest, req.query);
    const bookService = typedi_1.default.get(book_service_1.BookService);
    const { books, total } = yield bookService.getList(request);
    return res.json(new response_builder_1.ResponseBuilder(books)
        .withMeta({
        total,
    })
        .withSuccess()
        .build());
}));
router.post(url.add, verify_token_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield (0, transformAndValidate_1.transformAndValidate)(create_book_request_1.CreateBookRequest, req.body);
    const bookService = typedi_1.default.get(book_service_1.BookService);
    const result = yield bookService.create(request);
    return res.json(new response_builder_1.ResponseBuilder(result)
        .withSuccess()
        .withMessage("create book success.")
        .build());
}));
//update book
router.put(url.update, verify_token_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield (0, transformAndValidate_1.transformAndValidate)(update_book_request_1.UpdateBookRequest, req.body);
    const bookService = typedi_1.default.get(book_service_1.BookService);
    const result = yield bookService.update(request);
    return res.json(new response_builder_1.ResponseBuilder(result)
        .withSuccess()
        .withMessage("update book success")
        .build());
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
//delete book
router.delete(url.delete, verify_token_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.ids) {
        throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.BAD_REQUEST, "ids param empty");
    }
    const bookService = typedi_1.default.get(book_service_1.BookService);
    yield bookService.delete(req.params.ids);
    return res.json(new response_builder_1.ResponseBuilder()
        .withSuccess()
        .withMessage("delete book success ")
        .build());
}));
// Export default
exports.default = router;
