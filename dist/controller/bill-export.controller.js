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
const transformAndValidate_1 = require("../ultis/transformAndValidate");
const typedi_1 = __importDefault(require("typedi"));
const response_builder_1 = require("../ultis/response-builder");
const create_bill_export_request_1 = require("@models/bill_export/create-bill-export.request");
const bill_export_service_1 = require("@services/bill-export.service");
const list_bill_export_request_1 = require("@models/bill_export/list-bill-export.request");
const verify_user_1 = require("@middleware/verify-user");
const update_bill_export_request_1 = require("@models/bill_export/update-bill-export.request");
const router = (0, express_1.Router)();
const url = {
    add: "/",
    update: "/",
    get: "/",
    delete: "/:id",
    init: "/init",
};
router.get(url.get, verify_token_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield (0, transformAndValidate_1.transformAndValidate)(list_bill_export_request_1.ListBillExportRequest, req.query);
    const billExportService = typedi_1.default.get(bill_export_service_1.BillExportService);
    const { billExport, total, link } = yield billExportService.list(request, req["user"]);
    return res.json(new response_builder_1.ResponseBuilder(billExport)
        .withMeta({ total, link })
        .withSuccess()
        .build());
}));
router.delete(url.delete, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const billExportService = typedi_1.default.get(bill_export_service_1.BillExportService);
    yield billExportService.delete(req.params.id);
    return res.json(new response_builder_1.ResponseBuilder().withSuccess().build());
}));
router.get(url.init, verify_token_1.verifyToken, verify_user_1.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const billExportService = typedi_1.default.get(bill_export_service_1.BillExportService);
    const result = yield billExportService.init();
    return res.json(new response_builder_1.ResponseBuilder(result).withSuccess().build());
}));
router.post(url.add, verify_token_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield (0, transformAndValidate_1.transformAndValidate)(create_bill_export_request_1.CreateBillExportRequest, req.body);
    const billExportService = typedi_1.default.get(bill_export_service_1.BillExportService);
    const result = yield billExportService.create(request, req["user"]);
    return res.json(new response_builder_1.ResponseBuilder(result).withSuccess().build());
}));
router.put(url.update, verify_token_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield (0, transformAndValidate_1.transformAndValidate)(update_bill_export_request_1.UpdateBillExportRequest, req.body);
    const billExportService = typedi_1.default.get(bill_export_service_1.BillExportService);
    const result = yield billExportService.update(request, req["user"]);
    return res.json(new response_builder_1.ResponseBuilder(result).withSuccess().build());
}));
// Export default
exports.default = router;
