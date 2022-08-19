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
exports.BillImportService = void 0;
const typedi_1 = require("typedi");
const book_entity_1 = require("@entity/book.entity");
const db_1 = require("@config/db");
const supliers_entity_1 = require("@entity/supliers.entity");
const apiError_1 = require("../ultis/apiError");
const http_status_codes_1 = require("http-status-codes");
const bill_import_detail_repository_1 = require("@repos/bill-import-detail.repository");
const bill_import_repository_1 = require("@repos/bill-import.repository");
const typeorm_1 = require("typeorm");
const supplier_repository_1 = require("@repos/supplier.repository");
const baseAWS_1 = require("@common/baseAWS");
const app_1 = require("@config/app");
const PDFDocument = require("pdfkit-table");
const fs = require("fs");
require("dotenv").config();
let BillImportService = class BillImportService {
    constructor() { }
    create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryRunner = db_1.AppDataSource.createQueryRunner();
            yield queryRunner.connect();
            const supplier = yield queryRunner.manager.findOneByOrFail(supliers_entity_1.SupplierEnity, {
                id: request.supplier_id,
            });
            try {
                yield queryRunner.startTransaction();
                const bill_import_instance = bill_import_repository_1.BillImportRepository.create();
                bill_import_instance.supplier = supplier;
                const bill_import = yield queryRunner.manager.save(bill_import_instance);
                for (const book of request.books) {
                    const bookInstance = yield queryRunner.manager.findOneByOrFail(book_entity_1.BookEntity, {
                        id: book.id,
                    });
                    const bill_import_detail = bill_import_detail_repository_1.BillImportDetailRepository.create();
                    bill_import_detail.book = bookInstance;
                    bill_import_detail.quantity = book.quantity;
                    bill_import_detail.bill_import = bill_import;
                    yield queryRunner.manager.save(bill_import_detail);
                    bookInstance.quantity += book.quantity;
                    yield queryRunner.manager.save(bookInstance);
                }
                yield queryRunner.commitTransaction();
                return;
            }
            catch (error) {
                yield queryRunner.rollbackTransaction();
                throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.BAD_REQUEST, "", error);
            }
            finally {
                yield queryRunner.release();
            }
        });
    }
    list(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const [billImport, total] = yield bill_import_repository_1.BillImportRepository.getList(request);
            if (request.isReport) {
                this.getReport(billImport);
                return {
                    billImport: null,
                    total: null,
                    link: "https://shopbook.s3.ap-southeast-1.amazonaws.com/images/TestDocument.pdf",
                };
            }
            return {
                billImport,
                total,
                link: "",
            };
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id) {
                const bill = yield bill_import_repository_1.BillImportRepository.findOneByOrFail({ id });
                return bill_import_repository_1.BillImportRepository.delete({ id: bill.id });
            }
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const date = new Date();
            date.setDate(date.getDate() - 1);
            const res = yield Promise.all([
                bill_import_detail_repository_1.BillImportDetailRepository.count(),
                bill_import_detail_repository_1.BillImportDetailRepository.countBy({ created_at: (0, typeorm_1.MoreThanOrEqual)(date) }),
            ]);
            return {
                totalBill: res[0],
                totalBillInCurrentDate: res[1],
            };
        });
    }
    update(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const billImport = yield bill_import_repository_1.BillImportRepository.findOneOrFail({
                where: { id: request.id },
            });
            if (request.supplier_id) {
                const supplier = yield supplier_repository_1.SupplierRepository.findOneOrFail({
                    where: { id: request.supplier_id },
                });
                billImport.supplier = supplier;
            }
        });
    }
    getReport(billImport) {
        const data = [];
        for (const bi of billImport) {
            for (const bid of bi.bill_import_details) {
                data.push({
                    id: bi.id.substring(1, 5),
                    username: bi.supplier.company,
                    bookname: bid.book.name,
                    quantity: bid.quantity,
                    price: bid.quantity * bid.book.price_import,
                });
            }
        }
        if (data.length > 0) {
            data.push({
                id: "Tổng",
                quantity: data.reduce((pre, cur) => pre + cur.quantity, 0),
                price: data.reduce((pre, cur) => pre + cur.price, 0),
            });
        }
        let doc = new PDFDocument({ margin: 30, size: "A4" });
        doc.pipe(fs.createWriteStream("file-report/TestDocument.pdf"));
        (function () {
            return __awaiter(this, void 0, void 0, function* () {
                // table
                const table = {
                    title: {
                        label: "BÁO CÁO HÓA ĐƠN NHẬP",
                        fontSize: 30,
                        fontFamily: "fonts/AlegreyaSansSC-Black.otf",
                        valign: "center",
                    },
                    headers: [
                        {
                            label: "id HD",
                            property: "id",
                            width: 60,
                            fontFamily: "fonts/AlegreyaSans-Light.otf",
                            renderer: null,
                        },
                        {
                            label: "Tên NCC",
                            property: "username",
                            width: 100,
                            fontFamily: "fonts/AlegreyaSans-Light.otf",
                            renderer: null,
                        },
                        {
                            label: "Tên Sách",
                            property: "bookname",
                            width: 150,
                            fontFamily: "fonts/AlegreyaSans-Light.otf",
                            renderer: null,
                        },
                        {
                            label: "Số Lượng",
                            property: "quantity",
                            width: 150,
                            fontFamily: "fonts/AlegreyaSans-Light.otf",
                            renderer: null,
                        },
                        {
                            label: "Giá",
                            property: "price",
                            width: 100,
                            fontFamily: "fonts/AlegreyaSans-Light.otf",
                            renderer: null,
                        },
                    ],
                    // complex data
                    datas: data,
                };
                // the magic
                doc.table(table, {
                    prepareHeader: () => doc.font("fonts/AlegreyaSans-Light.otf").fontSize(12),
                    prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
                        doc.font("fonts/AlegreyaSans-Light.otf").fontSize(10);
                    },
                });
                // done!
                doc.end();
            });
        })();
        fs.readFile("file-report/TestDocument.pdf", (err, data) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                console.error(err);
                return;
            }
            yield (0, baseAWS_1.uploadFile)(data, app_1.config.s3Bucket, "application/pdf", "images/TestDocument.pdf");
        }));
    }
};
BillImportService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], BillImportService);
exports.BillImportService = BillImportService;
