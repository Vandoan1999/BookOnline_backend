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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillExportDetail = void 0;
const typeorm_1 = require("typeorm");
const bill_export_entity_1 = require("./bill-export.entity");
const book_entity_1 = require("./book.entity");
let BillExportDetail = class BillExportDetail {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: "uuid" }),
    __metadata("design:type", String)
], BillExportDetail.prototype, "bill_export_id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: "uuid" }),
    __metadata("design:type", String)
], BillExportDetail.prototype, "book_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], BillExportDetail.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => book_entity_1.BookEntity, (book) => book.bill_export_detail, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "book_id", referencedColumnName: "id" }),
    __metadata("design:type", book_entity_1.BookEntity)
], BillExportDetail.prototype, "book", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => bill_export_entity_1.BillExport, (bill) => bill.bill_export_detail, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "bill_export_id", referencedColumnName: "id" }),
    __metadata("design:type", bill_export_entity_1.BillExport)
], BillExportDetail.prototype, "bill_export", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], BillExportDetail.prototype, "created_at", void 0);
BillExportDetail = __decorate([
    (0, typeorm_1.Entity)("bill_export_detail")
], BillExportDetail);
exports.BillExportDetail = BillExportDetail;
