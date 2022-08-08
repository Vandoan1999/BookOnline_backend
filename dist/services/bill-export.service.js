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
exports.BillExportService = void 0;
const typedi_1 = require("typedi");
const apiError_1 = require("../ultis/apiError");
const http_status_codes_1 = require("http-status-codes");
const typeorm_1 = require("typeorm");
const bill_export_repository_1 = require("@repos/bill-export.repository");
const bill_export_detail_repository_1 = require("@repos/bill-export-detail.repository");
const user_repository_1 = require("@repos/user.repository");
const book_repository_1 = require("@repos/book.repository");
const role_enum_1 = require("@enums/role.enum");
require("dotenv").config();
let BillExportService = class BillExportService {
    constructor() { }
    create(request, userInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            request.user_id = userInfo.id;
            const user = yield user_repository_1.UserRepository.findOneByOrFail({
                id: request.user_id,
            });
            const booksPromise = [];
            for (const bookRequest of request.books) {
                booksPromise.push(book_repository_1.BookRepository.findOneByOrFail({
                    id: bookRequest.id,
                }));
            }
            const books = yield Promise.all(booksPromise);
            if (!user.address || !user.phone) {
                if (userInfo.role === role_enum_1.Role.USER)
                    throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.BAD_REQUEST, `address and phone must of user ${user.username} is empty, you must update address and phone to buying book `);
            }
            const bill_export_instance = bill_export_repository_1.BillExportRepository.create();
            bill_export_instance.user = user;
            const bill_export = yield bill_export_repository_1.BillExportRepository.save(bill_export_instance);
            for (const book of books) {
                const bookRequest = request.books.find((item) => item.id === book.id);
                if (book.quantity < bookRequest.quantity) {
                    throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.BAD_REQUEST, `Quanlity of book ${book.id} with quality ${book.quantity} not enough: book Inventory = ${book.quantity} | book request = ${bookRequest.quantity}`);
                }
                const bill_export_detail = bill_export_detail_repository_1.BillExportDetailRepository.create();
                bill_export_detail.book_id = book.id;
                bill_export_detail.quantity = bookRequest.quantity;
                bill_export_detail.bill_export_id = bill_export.id;
                book.quantity -= bookRequest.quantity;
                book.sold -= bookRequest.quantity;
                yield bill_export_detail_repository_1.BillExportDetailRepository.insert(bill_export_detail);
                yield book_repository_1.BookRepository.save(book);
            }
        });
    }
    list(request, user) {
        return bill_export_repository_1.BillExportRepository.getList(request, user);
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id) {
                return bill_export_repository_1.BillExportRepository.delete({ id });
            }
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const date = new Date();
            date.setDate(date.getDate() - 1);
            const res = yield Promise.all([
                bill_export_detail_repository_1.BillExportDetailRepository.count(),
                bill_export_detail_repository_1.BillExportDetailRepository.countBy({ created_at: (0, typeorm_1.MoreThanOrEqual)(date) }),
            ]);
            return {
                totalBill: res[0],
                totalBillInCurrentDate: res[1],
            };
        });
    }
};
BillExportService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], BillExportService);
exports.BillExportService = BillExportService;
