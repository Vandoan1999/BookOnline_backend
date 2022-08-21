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
const verify_user_1 = require("@middleware/verify-user");
const transformAndValidate_1 = require("../ultis/transformAndValidate");
const create_bill_import_request_1 = require("@models/bill_import/create-bill-import.request");
const typedi_1 = __importDefault(require("typedi"));
const bill_import_service_1 = require("@services/bill-import.service");
const response_builder_1 = require("../ultis/response-builder");
const list_bill_import_request_1 = require("@models/bill_import/list-bill-import.request");
const update_bill_import_request_1 = require("@models/bill_import/update-bill-import.request");
const router = (0, express_1.Router)();
const url = {
    add: "/",
    update: "/",
    get: "/",
    detail: "/",
    delete: "/:id",
    init: "/init",
};
router.get(url.get, verify_token_1.verifyToken, verify_user_1.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield (0, transformAndValidate_1.transformAndValidate)(list_bill_import_request_1.ListBillImportRequest, req.query);
    const billImportService = typedi_1.default.get(bill_import_service_1.BillImportService);
    const { billImport, total } = yield billImportService.list(request);
    return res.json(new response_builder_1.ResponseBuilder(billImport)
        .withMeta({ total })
        .withSuccess()
        .build());
}));
router.delete(url.delete, verify_token_1.verifyToken, verify_user_1.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const billImportService = typedi_1.default.get(bill_import_service_1.BillImportService);
    yield billImportService.delete(req.params.id);
    return res.json(new response_builder_1.ResponseBuilder()
        .withSuccess()
        .withMessage("delete bill import success!")
        .build());
}));
router.get(url.init, verify_token_1.verifyToken, verify_user_1.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const billImportService = typedi_1.default.get(bill_import_service_1.BillImportService);
    const result = yield billImportService.init();
    return res.json(new response_builder_1.ResponseBuilder(result).withSuccess().build());
}));
router.post(url.add, verify_token_1.verifyToken, verify_user_1.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield (0, transformAndValidate_1.transformAndValidate)(create_bill_import_request_1.CreateBillImportRequest, req.body);
    const billImportService = typedi_1.default.get(bill_import_service_1.BillImportService);
    yield billImportService.create(request);
    return res.json(new response_builder_1.ResponseBuilder()
        .withSuccess()
        .withMessage("create bill import success!")
        .build());
}));
router.put(url.update, verify_token_1.verifyToken, verify_user_1.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield (0, transformAndValidate_1.transformAndValidate)(update_bill_import_request_1.UpdateBillImportRequest, req.body);
    const billImportService = typedi_1.default.get(bill_import_service_1.BillImportService);
    yield billImportService.update(request);
    return res.json(new response_builder_1.ResponseBuilder()
        .withSuccess()
        .withMessage("update bill import success!")
        .build());
}));
// Export default
exports.default = router;
