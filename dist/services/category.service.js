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
const sort_1 = require("@models/sort");
const baseAWS_1 = require("@common/baseAWS");
const app_1 = require("@config/app");
require("dotenv").config();
let CategoryService = class CategoryService {
    constructor() { }
    getList() {
        return __awaiter(this, void 0, void 0, function* () {
            const [category, total] = yield category_repository_1.CategoryRepository.findAndCount({
                order: { name: sort_1.Sort.ASC },
            });
            category.forEach((item) => {
                item.image = (0, baseAWS_1.GetObjectURl)(item.image);
            });
            return {
                category,
                total,
            };
        });
    }
    create(request, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user.role === role_enum_1.Role.USER) {
                throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.FORBIDDEN);
            }
            const category = category_repository_1.CategoryRepository.create(request);
            let newNameImg = "";
            if (request.image_data) {
                newNameImg = Math.random() + request.image_data.originalname;
                category.image = newNameImg;
            }
            yield category_repository_1.CategoryRepository.save(category);
            if (newNameImg) {
                yield (0, baseAWS_1.uploadFile)(request.image_data.buffer, app_1.config.s3Bucket, request.image_data.mimetype, app_1.config.s3BucketForder + newNameImg);
            }
        });
    }
    detail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield category_repository_1.CategoryRepository.findOneOrFail({
                where: { id },
                relations: {
                    books: true,
                },
            });
            if (category.image) {
                category.image = (0, baseAWS_1.GetObjectURl)(category.image);
            }
            if (category.books.length > 0) {
                category.books.forEach((item) => {
                    if (item.avatar) {
                        item.avatar = (0, baseAWS_1.GetObjectURl)(item.avatar);
                    }
                });
            }
            return category;
        });
    }
    update(request, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user.role === role_enum_1.Role.USER) {
                throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.FORBIDDEN);
            }
            const category = yield category_repository_1.CategoryRepository.findOneOrFail({
                where: { id: request.id },
            });
            category.name = request.name;
            let newNameImg = "";
            let oldNameImg = "";
            if (request.image_data) {
                newNameImg = Math.random() + request.image_data.originalname;
                oldNameImg = category.image;
                category.image = newNameImg;
            }
            yield category_repository_1.CategoryRepository.save(category);
            if (newNameImg) {
                yield Promise.all([
                    oldNameImg
                        ? (0, baseAWS_1.deleteObject)(app_1.config.s3Bucket, app_1.config.s3BucketForder + oldNameImg)
                        : "",
                    (0, baseAWS_1.uploadFile)(request.image_data.buffer, app_1.config.s3Bucket, request.image_data.mimetype, app_1.config.s3BucketForder + newNameImg),
                ]);
            }
        });
    }
    delete(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user.role === role_enum_1.Role.USER) {
                throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.FORBIDDEN);
            }
            const category = yield category_repository_1.CategoryRepository.findOneOrFail({
                where: { id },
            });
            yield category_repository_1.CategoryRepository.delete({ id: category.id });
            if (category.image)
                yield (0, baseAWS_1.deleteObject)(app_1.config.s3Bucket, app_1.config.s3BucketForder + category.image);
        });
    }
};
CategoryService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], CategoryService);
exports.CategoryService = CategoryService;
