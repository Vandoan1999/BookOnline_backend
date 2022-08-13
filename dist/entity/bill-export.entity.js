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
exports.BillExport = void 0;
const bill_export_status_enum_1 = require("@models/bill_export/bill-export-status.enum");
const typeorm_1 = require("typeorm");
const bill_export_detail_entity_1 = require("./bill-export-detail.entity");
const user_entity_1 = require("./user.entity");
let BillExport = class BillExport {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], BillExport.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, (user) => user.bill_export, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "user_id", referencedColumnName: "id" }),
    __metadata("design:type", user_entity_1.UserEntity)
], BillExport.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], BillExport.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: bill_export_status_enum_1.BillExportStatus,
        default: bill_export_status_enum_1.BillExportStatus.Pending,
    }),
    __metadata("design:type", Number)
], BillExport.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => bill_export_detail_entity_1.BillExportDetail, (bid) => bid.bill_export),
    __metadata("design:type", Array)
], BillExport.prototype, "bill_export_detail", void 0);
BillExport = __decorate([
    (0, typeorm_1.Entity)("bill_export")
], BillExport);
exports.BillExport = BillExport;
