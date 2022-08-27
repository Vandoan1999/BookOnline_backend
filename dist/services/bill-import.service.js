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
const image_service_1 = require("./image.service");
const constant_1 = require("../ultis/constant");
const export_column_1 = require("../base/export-column");
const report_excel_layout_1 = require("../base/report-excel.layout");
const baseAWS_1 = require("@common/baseAWS");
const app_1 = require("@config/app");
require("dotenv").config();
let BillImportService = class BillImportService {
    constructor(imageService) {
        this.imageService = imageService;
    }
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
            if (request.export) {
                let data = billImport.reduce((prev, cur) => {
                    const userInfo = [
                        cur.id.substring(0, 5),
                        cur.supplier.company,
                        cur.supplier.address,
                        cur.supplier.phone,
                    ].join("-");
                    if (!prev[userInfo]) {
                        prev[userInfo] = [];
                    }
                    let totalPrice = 0;
                    cur.bill_import_details.forEach((item, index) => {
                        totalPrice += item.book.price_import * item.quantity;
                        const data = {
                            index: index + 1 + "",
                            bookname: item.book.name,
                            price: item.book.price_import.toString(),
                            quantity: item.quantity.toString(),
                            totalPrice: item.book.price_import * item.quantity,
                        };
                        prev[userInfo].push(data);
                        if (index == cur.bill_import_details.length - 1) {
                            const total = {
                                index: "",
                                bookname: "",
                                price: "",
                                quantity: "Tổng tiền",
                                totalPrice: totalPrice,
                            };
                            prev[userInfo].push(total);
                        }
                    });
                    return prev;
                }, {});
                data = Object.keys(data).map((key) => {
                    return {
                        userInfo: key,
                        data: data[key],
                    };
                });
                let reportTime = "Từ ngày: ...  đến ngày: ...";
                let pastData = new Date();
                pastData.setMonth(pastData.getMonth() - 1);
                pastData = pastData.toLocaleDateString();
                reportTime = reportTime.replace("...", pastData);
                reportTime = reportTime.replace("...", new Date().toLocaleDateString());
                const model = {
                    parentCompany: constant_1.PARENT_COMPANY,
                    childCompany: constant_1.CHILD_COMPANY,
                    AddressChildCompany: constant_1.CHILD_COMPANY_ADDRESS,
                    reportTitle: "BÁO CÁO HÓA ĐƠN NHẬP THEO THÁNG",
                    reportTime: reportTime,
                    reportDateSignature: constant_1.REPORT_TIME,
                    stockerSignature: constant_1.STOCKER_SIGNATURE,
                    creater: constant_1.CREATER,
                    tableColumn: export_column_1.REPORT_IMPORT_COLUMN,
                    tableData: data,
                    footer: true,
                    header: true,
                    columnLevel: 1,
                };
                const buffer = yield (0, report_excel_layout_1.generateTable)(model, "billImport");
                yield (0, baseAWS_1.uploadFile)(buffer, app_1.config.s3Bucket, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", app_1.config.s3BucketForder + "billImport.xlsx");
                const link = (0, baseAWS_1.GetObjectURl)("billImport.xlsx");
                return { billImport: null, total: 0, link: link };
            }
            for (let bill of billImport) {
                for (const bid of bill.bill_import_details) {
                    if (bid.book.avartar) {
                        bid.book.avartar = JSON.parse(bid.book.avartar);
                    }
                    if (bid.book.images) {
                        bid.book.images = JSON.parse(bid.book.images);
                    }
                }
            }
            return {
                billImport,
                total,
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
};
BillImportService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [image_service_1.ImageService])
], BillImportService);
exports.BillImportService = BillImportService;
