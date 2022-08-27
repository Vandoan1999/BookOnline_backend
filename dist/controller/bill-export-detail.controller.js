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
const router = (0, express_1.Router)();
const url = {
    delete: "/:book_id/:bill_export_id",
};
router.delete(url.delete, verify_token_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const billExportDetailService = typedi_1.default.get(bill_import_detail_service_1.BillImportDetailService);
    yield billExportDetailService.delete((_a = req.params) === null || _a === void 0 ? void 0 : _a.book_id, (_b = req.params) === null || _b === void 0 ? void 0 : _b.bill_export_id);
    return res.json(new response_builder_1.ResponseBuilder()
        .withSuccess()
        .withMessage("delete bill export detail success !")
        .build());
}));
exports.default = router;
