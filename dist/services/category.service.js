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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const role_enum_1 = require("@enums/role.enum");
const category_repository_1 = require("@repos/category.repository");
const http_status_codes_1 = require("http-status-codes");
const apiError_1 = require("../ultis/apiError");
const typedi_1 = require("typedi");
require("dotenv").config();
let CategoryService = class CategoryService {
    constructor() { }
    getList() {
        return category_repository_1.CategoryRepository.findAndCount({
            order: { name: "ASC" },
        });
    }
    create(request, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user.role === role_enum_1.Role.USER) {
                throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.FORBIDDEN);
            }
            const category = category_repository_1.CategoryRepository.create(request);
            return category_repository_1.CategoryRepository.save(category);
        });
    }
    detail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield category_repository_1.CategoryRepository.findOne({
                where: { id },
                relations: {
                    books: true,
                },
            });
            if (!category) {
                throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            return category;
        });
    }
    update(request, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user.role === role_enum_1.Role.USER) {
                throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.FORBIDDEN);
            }
            const category = yield category_repository_1.CategoryRepository.findOne({
                where: { id: request.id },
            });
            if (!category) {
                throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            category.name = request.name;
            category.image = request.image;
            return category_repository_1.CategoryRepository.update({ id: request.id }, category);
        });
    }
    delete(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user.role === role_enum_1.Role.USER) {
                throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.FORBIDDEN);
            }
            const category = yield category_repository_1.CategoryRepository.findOne({
                where: { id },
            });
            if (!category) {
                throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            return category_repository_1.CategoryRepository.delete({ id });
        });
    }
};
CategoryService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], CategoryService);
exports.CategoryService = CategoryService;
