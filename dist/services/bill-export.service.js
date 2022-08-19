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
const image_service_1 = require("./image.service");
const bill_export_status_enum_1 = require("@models/bill_export/bill-export-status.enum");
const baseAWS_1 = require("@common/baseAWS");
const app_1 = require("@config/app");
const PDFDocument = require("pdfkit-table");
const fs = require("fs");
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
                if (book.quantity < bookRequest.quantity) {
                    throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.BAD_REQUEST, `Quanlity of book ${book.id} with quality ${book.quantity} not enough: book Inventory = ${book.quantity} | book request = ${bookRequest.quantity}`);
                }
                const bill_export_detail = bill_export_detail_repository_1.BillExportDetailRepository.create();
                bill_export_detail.book_id = book.id;
                bill_export_detail.quantity = bookRequest.quantity;
                bill_export_detail.bill_export_id = bill_export.id;
                // book.quantity -= bookRequest.quantity;
                // book.sold += bookRequest.quantity;
                // await BookRepository.save(book);
                return bill_export_detail_repository_1.BillExportDetailRepository.insert(bill_export_detail);
            }
        });
    }
    list(request, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const [billExport, total] = yield bill_export_repository_1.BillExportRepository.getList(request, user);
            if (request.isReport) {
                this.getReport(billExport);
                return {
                    billExport: null,
                    total: null,
                    link: "https://shopbook.s3.ap-southeast-1.amazonaws.com/images/TestDocument.pdf",
                };
            }
            for (let bill of billExport) {
                const user = yield this.imageService.getImageByObject([bill.user]);
                bill.user = user[0];
            }
            return {
                billExport,
                total,
                link: "",
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
    getReport(billExport) {
        const data = [];
        for (const bx of billExport) {
            for (const bxd of bx.bill_export_detail) {
                data.push({
                    id: bx.id.substring(1, 5),
                    username: bx.user.username,
                    bookname: bxd.book.name,
                    quantity: bxd.quantity,
                    price: bxd.quantity * bxd.book.price_export,
                });
            }
        }
        let doc = new PDFDocument({ margin: 30, size: "A4" });
        if (data.length > 0) {
            data.push({
                id: "Tổng",
                quantity: data.reduce((pre, cur) => pre + cur.quantity, 0),
                price: data.reduce((pre, cur) => pre + cur.price, 0),
            });
        }
        doc.pipe(fs.createWriteStream("file-report/TestDocument.pdf"));
        (function () {
            return __awaiter(this, void 0, void 0, function* () {
                // table
                const table = {
                    title: {
                        label: "BÁO CÁO HÓA ĐƠN XUẤT",
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
                            label: "Tên KH",
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
BillExportService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [image_service_1.ImageService])
], BillExportService);
exports.BillExportService = BillExportService;
