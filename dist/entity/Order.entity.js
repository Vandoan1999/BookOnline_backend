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
exports.OrdersEntity = void 0;
const shipping_status_enum_1 = require("@enums/shipping-status.enum");
const typeorm_1 = require("typeorm");
const order_detail_entity_1 = require("./order-detail.entity");
const shipper_entity_1 = require("./shipper.entity");
const user_entity_1 = require("./user.entity");
let OrdersEntity = class OrdersEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], OrdersEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], OrdersEntity.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: shipping_status_enum_1.ShippingStatus.OPENT }),
    __metadata("design:type", String)
], OrdersEntity.prototype, "shipping_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: "date" }),
    __metadata("design:type", Date)
], OrdersEntity.prototype, "order_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: "date" }),
    __metadata("design:type", Date)
], OrdersEntity.prototype, "shipped_date", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.UserEntity),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.UserEntity)
], OrdersEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => shipper_entity_1.ShipperEntity),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", shipper_entity_1.ShipperEntity)
], OrdersEntity.prototype, "shipper", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_detail_entity_1.OrderDetail, (order_detail) => order_detail.order),
    __metadata("design:type", Array)
], OrdersEntity.prototype, "orders_detail", void 0);
OrdersEntity = __decorate([
    (0, typeorm_1.Entity)("orders")
], OrdersEntity);
exports.OrdersEntity = OrdersEntity;
