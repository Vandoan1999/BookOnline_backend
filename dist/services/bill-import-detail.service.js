"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
exports.BillImportDetailService = void 0;
const typedi_1 = require("typedi");
const bill_import_detail_repository_1 = require("@repos/bill-import-detail.repository");
const apiError_1 = require("../ultis/apiError");
const http_status_codes_1 = require("http-status-codes");
const book_repository_1 = require("@repos/book.repository");
const bill_import_repository_1 = require("@repos/bill-import.repository");
const bill_export_detail_repository_1 = require("@repos/bill-export-detail.repository");
require("dotenv").config();
let BillImportDetailService = class BillImportDetailService {
    constructor() { }
    create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const [billimport, book] = yield Promise.all([
                bill_import_repository_1.BillImportRepository.findOneByOrFail({ id: request.bill_import_id }),
                book_repository_1.BookRepository.findOneByOrFail({ id: request.book_id }),
            ]);
            const billImportDetailToBeSaved = bill_import_detail_repository_1.BillImportDetailRepository.create();
            billImportDetailToBeSaved.book = book;
            billImportDetailToBeSaved.bill_import = billimport;
            billImportDetailToBeSaved.quantity = request.quantity;
            yield bill_import_detail_repository_1.BillImportDetailRepository.insert(billImportDetailToBeSaved);
            book.quantity += request.quantity;
            yield book_repository_1.BookRepository.save(book);
        });
    }
    delete(book_id, bill_export_id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (book_id && bill_export_id) {
                const billIimportDetail = yield bill_export_detail_repository_1.BillExportDetailRepository.findOneByOrFail({
                    bill_export_id,
                    book_id,
                });
                yield bill_export_detail_repository_1.BillExportDetailRepository.delete({
                    bill_export_id: billIimportDetail.bill_export_id,
                    book_id: billIimportDetail.book_id,
                });
                return;
            }
            throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.BAD_REQUEST);
        });
    }
    update(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const billIimportDetail = yield bill_import_detail_repository_1.BillImportDetailRepository.findOneByOrFail({
                bill_import_id: request.bill_import_id,
                book_id: request.book_id,
            });
            const bookInstance = yield book_repository_1.BookRepository.findOneOrFail({
                where: { id: request.book_id },
            });
            if (request.quantity > bookInstance.quantity) {
                throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.BAD_REQUEST, `quantity not valid Book: ${bookInstance.quantity} < ${request.quantity}`);
            }
            bookInstance.quantity =
                bookInstance.quantity - billIimportDetail.quantity + request.quantity;
            billIimportDetail.quantity = bookInstance.quantity;
            yield Promise.all([
                book_repository_1.BookRepository.save(bookInstance),
                bill_import_detail_repository_1.BillImportDetailRepository.save(billIimportDetail),
            ]);
        });
    }
};
BillImportDetailService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], BillImportDetailService);
exports.BillImportDetailService = BillImportDetailService;
