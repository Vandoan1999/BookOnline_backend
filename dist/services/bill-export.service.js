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
const typeorm_1 = require("typeorm");
const bill_export_repository_1 = require("@repos/bill-export.repository");
const bill_export_detail_repository_1 = require("@repos/bill-export-detail.repository");
const user_repository_1 = require("@repos/user.repository");
const book_repository_1 = require("@repos/book.repository");
const image_service_1 = require("./image.service");
const bill_export_status_enum_1 = require("@models/bill_export/bill-export-status.enum");
const constant_1 = require("../ultis/constant");
const export_column_1 = require("../base/export-column");
const report_excel_layout_1 = require("../base/report-excel.layout");
const baseAWS_1 = require("@common/baseAWS");
const app_1 = require("@config/app");
require("dotenv").config();
let BillExportService = class BillExportService {
    constructor(imageService) {
        this.imageService = imageService;
    }
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
            const bill_export_instance = bill_export_repository_1.BillExportRepository.create();
            bill_export_instance.user = user;
            const bill_export = yield bill_export_repository_1.BillExportRepository.save(bill_export_instance);
            for (const book of books) {
                const bookRequest = request.books.find((item) => item.id === book.id);
                const bill_export_detail = bill_export_detail_repository_1.BillExportDetailRepository.create();
                bill_export_detail.book_id = book.id;
                bill_export_detail.quantity = bookRequest.quantity;
                bill_export_detail.bill_export_id = bill_export.id;
                book.quantity -= bookRequest.quantity;
                book.sold += 1;
                yield book_repository_1.BookRepository.save(book);
                yield bill_export_detail_repository_1.BillExportDetailRepository.insert(bill_export_detail);
            }
        });
    }
    list(request, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const [billExport, total] = yield bill_export_repository_1.BillExportRepository.getList(request, user);
            if (request.export) {
                let data = billExport.reduce((prev, cur) => {
                    const userInfo = [
                        cur.id.substring(0, 5),
                        cur.user.username,
                        cur.user.address,
                        cur.user.phone,
                    ].join("-");
                    if (!prev[userInfo]) {
                        prev[userInfo] = [];
                    }
                    let status = "";
                    switch (cur.status) {
                        case bill_export_status_enum_1.BillExportStatus.Pending:
                            status = "Đang đặt hàng";
                            break;
                        case bill_export_status_enum_1.BillExportStatus.Confirmed:
                            status = "Đã nhận";
                            break;
                        case bill_export_status_enum_1.BillExportStatus.Reject:
                            status = "Sản phảm bị trả lại";
                            break;
                    }
                    let totalPrice = 0;
                    cur.bill_export_detail.forEach((item, index) => {
                        totalPrice += item.book.price_export * item.quantity;
                        const data = {
                            index: index + 1 + "",
                            status: status,
                            bookname: item.book.name,
                            price: item.book.price_export + "",
                            discounted: item.book.discounted + "%",
                            quantity: item.quantity + "",
                            totalPrice: item.book.price_export * item.quantity + "",
                        };
                        prev[userInfo].push(data);
                        if (index == cur.bill_export_detail.length - 1) {
                            const total = {
                                index: "",
                                status: "",
                                bookname: "",
                                price: "",
                                discounted: "",
                                quantity: "Tổng tiền",
                                totalPrice: totalPrice + "",
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
                    reportTitle: "BÁO CÁO HÓA ĐƠN XUẤT THEO THÁNG",
                    reportTime: reportTime,
                    reportDateSignature: constant_1.REPORT_TIME,
                    stockerSignature: constant_1.STOCKER_SIGNATURE,
                    creater: constant_1.CREATER,
                    tableColumn: export_column_1.REPORT_EXPORT_COLUMN,
                    tableData: data,
                    footer: true,
                    header: true,
                    columnLevel: 1,
                };
                const buffer = yield (0, report_excel_layout_1.generateTable)(model, "billExport");
                yield (0, baseAWS_1.uploadFile)(buffer, app_1.config.s3Bucket, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", app_1.config.s3BucketForder + "billExport.xlsx");
                const link = (0, baseAWS_1.GetObjectURl)("billExport.xlsx");
                return { billExport: null, total: 0, link: link };
            }
            for (let bill of billExport) {
                if (bill.user.avartar) {
                    bill.user.avartar = JSON.parse(bill.user.avartar);
                }
                for (const bxd of bill.bill_export_detail) {
                    if (bxd.book.images) {
                        bxd.book.images = JSON.parse(bxd.book.images);
                    }
                    if (bxd.book.avartar) {
                        bxd.book.avartar = JSON.parse(bxd.book.avartar);
                    }
                }
            }
            return {
                billExport,
                total,
            };
        });
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
    update(request, userinfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const billExport = yield bill_export_repository_1.BillExportRepository.findOneOrFail({
                where: { id: request.id },
                relations: ["bill_export_detail"],
            });
            if (request.status &&
                Object.values(bill_export_status_enum_1.BillExportStatus).includes(request.status)) {
                if (billExport.bill_export_detail.length > 0) {
                    if (billExport.status === bill_export_status_enum_1.BillExportStatus.Pending) {
                        const books = yield book_repository_1.BookRepository.find({
                            where: {
                                id: (0, typeorm_1.In)([...billExport.bill_export_detail.map((i) => i.book_id)]),
                            },
                        });
                        const booksToBeUpdated = [];
                        for (const { book_id, quantity } of billExport.bill_export_detail) {
                            const book = books.find((i) => i.id === book_id);
                            if (book) {
                                book.quantity -= quantity;
                                book.sold += quantity;
                                booksToBeUpdated.push(book);
                            }
                        }
                        yield book_repository_1.BookRepository.save(booksToBeUpdated);
                    }
                }
                billExport.status = request.status;
            }
            return bill_export_repository_1.BillExportRepository.save(billExport);
        });
    }
};
BillExportService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [image_service_1.ImageService])
], BillExportService);
exports.BillExportService = BillExportService;
