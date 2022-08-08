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
const verify_token_1 = require("@middleware/verify-token");
const typedi_1 = __importDefault(require("typedi"));
const response_builder_1 = require("../ultis/response-builder");
const bill_import_detail_service_1 = require("@services/bill-import-detail.service");
const verify_user_1 = require("@middleware/verify-user");
const transformAndValidate_1 = require("../ultis/transformAndValidate");
const update_bill_import_detail_request_1 = require("@models/bill_import_detail/update-bill-import-detail.request");
const add_bill_import_detail_request_1 = require("@models/bill_import_detail/add-bill-import-detail.request");
const router = (0, express_1.Router)();
const url = {
    delete: "/:book_id/:bill_import_id",
    update: "/",
    add: "/",
};
router.delete(url.delete, verify_token_1.verifyToken, verify_user_1.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const billImportDetailService = typedi_1.default.get(bill_import_detail_service_1.BillImportDetailService);
    yield billImportDetailService.delete((_a = req.params) === null || _a === void 0 ? void 0 : _a.book_id, (_b = req.params) === null || _b === void 0 ? void 0 : _b.bill_import_id);
    return res.json(new response_builder_1.ResponseBuilder()
        .withSuccess()
        .withMessage("delete bill import detail success !")
        .build());
}));
router.put(url.update, verify_token_1.verifyToken, verify_user_1.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield (0, transformAndValidate_1.transformAndValidate)(update_bill_import_detail_request_1.UpdateBillImportDetailRequest, req.body);
    const billImportDetailService = typedi_1.default.get(bill_import_detail_service_1.BillImportDetailService);
    yield billImportDetailService.update(request);
    return res.json(new response_builder_1.ResponseBuilder()
        .withSuccess()
        .withMessage("update bill import detail success !")
        .build());
}));
router.post(url.add, verify_token_1.verifyToken, verify_user_1.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield (0, transformAndValidate_1.transformAndValidate)(add_bill_import_detail_request_1.CreateBillImportDetailRequest, req.body);
    const billImportDetailService = typedi_1.default.get(bill_import_detail_service_1.BillImportDetailService);
    yield billImportDetailService.create(request);
    return res.json(new response_builder_1.ResponseBuilder()
        .withSuccess()
        .withMessage("update bill import detail success !")
        .build());
}));
exports.default = router;
