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
exports.OrderDetail = void 0;
const typeorm_1 = require("typeorm");
const book_entity_1 = require("./book.entity");
const Order_entity_1 = require("./Order.entity");
let OrderDetail = class OrderDetail {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], OrderDetail.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], OrderDetail.prototype, "order_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: "int" }),
    __metadata("design:type", Number)
], OrderDetail.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Order_entity_1.OrdersEntity, (order) => order.orders_detail),
    (0, typeorm_1.JoinColumn)({ name: "order_id" }),
    __metadata("design:type", Order_entity_1.OrdersEntity)
], OrderDetail.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => book_entity_1.BookEntity, (book) => book.order_detail),
    (0, typeorm_1.JoinColumn)({ name: "book_id" }),
    __metadata("design:type", book_entity_1.BookEntity)
], OrderDetail.prototype, "book", void 0);
OrderDetail = __decorate([
    (0, typeorm_1.Entity)("order_detail")
], OrderDetail);
exports.OrderDetail = OrderDetail;
