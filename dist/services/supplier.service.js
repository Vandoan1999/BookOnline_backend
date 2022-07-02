"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.SupplierService = void 0;
const supplier_repository_1 = require("@repos/supplier.repository");
const http_status_codes_1 = require("http-status-codes");
const apiError_1 = require("../ultis/apiError");
const typedi_1 = require("typedi");
let SupplierService = class SupplierService {
    getList(request) {
        return supplier_repository_1.SupplierRepository.getList(request);
    }
    create(request) {
        const supplier = supplier_repository_1.SupplierRepository.create(request);
        return supplier_repository_1.SupplierRepository.save(supplier);
    }
    update(request) {
        const supplier = supplier_repository_1.SupplierRepository.findOneBy({
            id: request.id,
        });
        if (!supplier) {
            throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.NOT_FOUND, `suppier with id: ${request.id} not found !`);
        }
        return supplier_repository_1.SupplierRepository.update({ id: request.id }, request);
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const supplier = yield supplier_repository_1.SupplierRepository.findOne({
                where: { id },
            });
            if (!supplier)
                throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.NOT_FOUND, `suppier with id: ${id} not found !`);
            return supplier_repository_1.SupplierRepository.delete({ id });
        });
    }
    detail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const supplier = yield supplier_repository_1.SupplierRepository.findOneBy({
                id,
            });
            if (!supplier)
                throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.NOT_FOUND, `suppier with id: ${id} not found !`);
            return supplier;
        });
    }
};
SupplierService = __decorate([
    (0, typedi_1.Service)()
], SupplierService);
exports.SupplierService = SupplierService;
