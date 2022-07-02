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
const verifyToken_1 = require("@middleware/verifyToken");
const list_supplier_request_1 = require("@models/supplier/list-supplier.request");
const supplier_service_1 = require("@services/supplier.service");
const create_supplier_request_1 = require("@models/supplier/create-supplier.request");
const update_supplier_request_1 = require("@models/supplier/update-supplier.request");
const apiError_1 = require("../ultis/apiError");
const http_status_codes_1 = require("http-status-codes");
const router = (0, express_1.Router)();
const url = {
    get: "/",
    add: "/",
    detail: "/:id",
    delete: "/:id",
    update: "/",
};
router.get(url.get, verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield (0, transformAndValidate_1.transformAndValidate)(list_supplier_request_1.ListSupplierRequest, req.query);
    const supplierService = typedi_1.default.get(supplier_service_1.SupplierService);
    const [supplier, total] = yield supplierService.getList(request);
    return res.json(new response_builder_1.ResponseBuilder(supplier).withMeta({ total }).withSuccess().build());
}));
router.post(url.add, verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield (0, transformAndValidate_1.transformAndValidate)(create_supplier_request_1.CreateSupplierRequest, req.body);
    const supplierService = typedi_1.default.get(supplier_service_1.SupplierService);
    yield supplierService.create(request);
    return res.json(new response_builder_1.ResponseBuilder().withSuccess().build());
}));
router.put(url.update, verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield (0, transformAndValidate_1.transformAndValidate)(update_supplier_request_1.UpdateSupplierRequest, req.body);
    const supplierService = typedi_1.default.get(supplier_service_1.SupplierService);
    yield supplierService.update(request);
    return res.json(new response_builder_1.ResponseBuilder().withSuccess().build());
}));
``;
router.delete(url.delete, verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.id)
        throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.BAD_REQUEST);
    const supplierService = typedi_1.default.get(supplier_service_1.SupplierService);
    const data = yield supplierService.delete(req.params.id);
    return res.json(new response_builder_1.ResponseBuilder(data).withSuccess().build());
}));
router.get(url.detail, verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.id)
        throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.BAD_REQUEST);
    const supplierService = typedi_1.default.get(supplier_service_1.SupplierService);
    const data = yield supplierService.detail(req.params.id);
    return res.json(new response_builder_1.ResponseBuilder(data).withSuccess().build());
}));
exports.default = router;
