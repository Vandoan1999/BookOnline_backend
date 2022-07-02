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
exports.BookEntity = void 0;
const typeorm_1 = require("typeorm");
const comment_entity_1 = require("./comment.entity");
const category_entity_1 = require("./category.entity");
const image_entity_1 = require("./image.entity");
const order_detail_entity_1 = require("./order-detail.entity");
const rating_entity_1 = require("./rating.entity");
const suppliers_entity_1 = require("./suppliers.entity");
let BookEntity = class BookEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], BookEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], BookEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: "int", default: 0 }),
    __metadata("design:type", Number)
], BookEntity.prototype, "discounted", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: "double precision", default: 0 }),
    __metadata("design:type", Number)
], BookEntity.prototype, "price_import", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], BookEntity.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: "double precision", default: 0 }),
    __metadata("design:type", Number)
], BookEntity.prototype, "price_export", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: "int", default: 0 }),
    __metadata("design:type", Number)
], BookEntity.prototype, "sold", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: "int", default: 0 }),
    __metadata("design:type", Number)
], BookEntity.prototype, "views", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: "date" }),
    __metadata("design:type", Date)
], BookEntity.prototype, "published_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: "int", default: 0 }),
    __metadata("design:type", Number)
], BookEntity.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], BookEntity.prototype, "publisher", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], BookEntity.prototype, "author", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: "text" }),
    __metadata("design:type", String)
], BookEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], BookEntity.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], BookEntity.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => suppliers_entity_1.SupplierEnity, (sp) => sp.phone, {
        onDelete: "SET NULL",
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", suppliers_entity_1.SupplierEnity)
], BookEntity.prototype, "supplier", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => comment_entity_1.CommentEntity, (comment) => comment.book, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], BookEntity.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_detail_entity_1.OrderDetail, (order) => order.book, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Array)
], BookEntity.prototype, "order_detail", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => rating_entity_1.RatingEntity, (rating) => rating.book_id, {
        onDelete: "CASCADE",
        nullable: true,
    }),
    __metadata("design:type", Array)
], BookEntity.prototype, "ratings", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => image_entity_1.ImageEntity, (rating) => rating.book_id, {
        onDelete: "CASCADE",
        nullable: true,
    }),
    __metadata("design:type", Array)
], BookEntity.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => category_entity_1.CategoryEntity, (category) => category.books, {
        onDelete: "CASCADE",
        nullable: true,
    }),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], BookEntity.prototype, "categories", void 0);
BookEntity = __decorate([
    (0, typeorm_1.Entity)("books")
], BookEntity);
exports.BookEntity = BookEntity;
