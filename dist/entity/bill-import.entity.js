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
exports.BillImport = void 0;
const typeorm_1 = require("typeorm");
const bill_import_detail_entity_1 = require("./bill-import-detail.entity");
const supliers_entity_1 = require("./supliers.entity");
let BillImport = class BillImport {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], BillImport.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => supliers_entity_1.SupplierEnity, (supplier) => supplier.bill_import, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "supplier_id", referencedColumnName: "id" }),
    __metadata("design:type", supliers_entity_1.SupplierEnity)
], BillImport.prototype, "supplier", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], BillImport.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => bill_import_detail_entity_1.BillImportDetail, (bid) => bid.bill_import),
    __metadata("design:type", Array)
], BillImport.prototype, "bill_import_details", void 0);
BillImport = __decorate([
    (0, typeorm_1.Entity)("bill_import")
], BillImport);
exports.BillImport = BillImport;
