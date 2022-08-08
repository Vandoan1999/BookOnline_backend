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
exports.RatingEntity = void 0;
const typeorm_1 = require("typeorm");
const book_entity_1 = require("./book.entity");
const user_entity_1 = require("./user.entity");
let RatingEntity = class RatingEntity {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: "uuid" }),
    __metadata("design:type", String)
], RatingEntity.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: "uuid" }),
    __metadata("design:type", String)
], RatingEntity.prototype, "book_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: "text" }),
    __metadata("design:type", String)
], RatingEntity.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: "float" }),
    __metadata("design:type", Number)
], RatingEntity.prototype, "rating_number", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], RatingEntity.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], RatingEntity.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, (user) => user.ratings, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "user_id", referencedColumnName: "id" }),
    __metadata("design:type", user_entity_1.UserEntity)
], RatingEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => book_entity_1.BookEntity, (book) => book.ratings, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "book_id", referencedColumnName: "id" }),
    __metadata("design:type", book_entity_1.BookEntity)
], RatingEntity.prototype, "book", void 0);
RatingEntity = __decorate([
    (0, typeorm_1.Entity)("rating")
], RatingEntity);
exports.RatingEntity = RatingEntity;
