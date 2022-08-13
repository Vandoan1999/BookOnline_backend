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
exports.CreateBookRequest = void 0;
const class_validator_1 = require("class-validator");
class CreateBookRequest {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBookRequest.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.Allow)(),
    __metadata("design:type", Number)
], CreateBookRequest.prototype, "discounted", void 0);
__decorate([
    (0, class_validator_1.Allow)(),
    __metadata("design:type", Number)
], CreateBookRequest.prototype, "price_import", void 0);
__decorate([
    (0, class_validator_1.Allow)(),
    __metadata("design:type", Number)
], CreateBookRequest.prototype, "price_export", void 0);
__decorate([
    (0, class_validator_1.Allow)(),
    __metadata("design:type", Number)
], CreateBookRequest.prototype, "views", void 0);
__decorate([
    (0, class_validator_1.Allow)(),
    __metadata("design:type", Date)
], CreateBookRequest.prototype, "published_date", void 0);
__decorate([
    (0, class_validator_1.Allow)(),
    __metadata("design:type", String)
], CreateBookRequest.prototype, "publisher", void 0);
__decorate([
    (0, class_validator_1.Allow)(),
    __metadata("design:type", String)
], CreateBookRequest.prototype, "author", void 0);
__decorate([
    (0, class_validator_1.Allow)(),
    __metadata("design:type", String)
], CreateBookRequest.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateBookRequest.prototype, "categories_id", void 0);
exports.CreateBookRequest = CreateBookRequest;
