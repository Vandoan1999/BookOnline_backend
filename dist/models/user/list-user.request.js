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
exports.ListUserRequest = void 0;
const Pagination_1 = require("@models/Pagination");
const sort_1 = require("@models/sort");
const class_validator_1 = require("class-validator");
const orderBy_enum_1 = require("./orderBy.enum");
class ListUserRequest extends Pagination_1.Pagination {
}
__decorate([
    (0, class_validator_1.Allow)(),
    __metadata("design:type", String)
], ListUserRequest.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(sort_1.Sort),
    __metadata("design:type", String)
], ListUserRequest.prototype, "order", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(orderBy_enum_1.OrderByEnum),
    __metadata("design:type", String)
], ListUserRequest.prototype, "orderBy", void 0);
exports.ListUserRequest = ListUserRequest;
