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
exports.BillImportDetail = void 0;
const typeorm_1 = require("typeorm");
const bill_import_entity_1 = require("./bill-import.entity");
const book_entity_1 = require("./book.entity");
let BillImportDetail = class BillImportDetail {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: "uuid" }),
    __metadata("design:type", String)
], BillImportDetail.prototype, "bill_import_id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: "uuid" }),
    __metadata("design:type", String)
], BillImportDetail.prototype, "book_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], BillImportDetail.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => book_entity_1.BookEntity, (book) => book.bill_import_detail, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "book_id", referencedColumnName: "id" }),
    __metadata("design:type", book_entity_1.BookEntity)
], BillImportDetail.prototype, "book", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => bill_import_entity_1.BillImport, (bill) => bill.bill_import_details, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "bill_import_id", referencedColumnName: "id" }),
    __metadata("design:type", bill_import_entity_1.BillImport)
], BillImportDetail.prototype, "bill_import", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], BillImportDetail.prototype, "created_at", void 0);
BillImportDetail = __decorate([
    (0, typeorm_1.Entity)("bill_import_detail")
], BillImportDetail);
exports.BillImportDetail = BillImportDetail;
