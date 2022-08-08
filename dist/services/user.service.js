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
exports.UserService = void 0;
const role_enum_1 = require("@enums/role.enum");
const user_repository_1 = require("@repos/user.repository");
const http_status_codes_1 = require("http-status-codes");
const apiError_1 = require("../ultis/apiError");
const typedi_1 = require("typedi");
const baseAWS_1 = require("@common/baseAWS");
const app_1 = require("@config/app");
let UserService = class UserService {
    constructor() { }
    getList(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const [users, total] = yield user_repository_1.UserRepository.getList(request);
            users.forEach((user) => {
                if (user.image) {
                    user.image = (0, baseAWS_1.GetObjectURl)(user.image);
                }
            });
            return { users, total };
        });
    }
    update(request, userInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userInfo && userInfo.role === role_enum_1.Role.USER) {
                request.id = userInfo.id;
            }
            const user = yield user_repository_1.UserRepository.findOneByOrFail({ id: request.id });
            if (request.image) {
                const newImageName = Math.random() + request.image.originalname;
                yield Promise.all([
                    (0, baseAWS_1.deleteObject)(app_1.config.s3Bucket, app_1.config.s3BucketForder + user.image),
                    (0, baseAWS_1.uploadFile)(request.image.buffer, app_1.config.s3Bucket, request.image.mimetype, app_1.config.s3BucketForder + newImageName),
                ]);
                request.image = newImageName;
            }
            return user_repository_1.UserRepository.update({ id: request.id }, Object.assign({}, request));
        });
    }
    detail(id, user = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user && user.role === role_enum_1.Role.USER) {
                id = user && (user === null || user === void 0 ? void 0 : user.id) ? user === null || user === void 0 ? void 0 : user.id : id;
            }
            const res = yield user_repository_1.UserRepository.findOneByOrFail({ id });
            if (res.image) {
                res.image = (0, baseAWS_1.GetObjectURl)(res.image);
            }
            return res;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield user_repository_1.UserRepository.findOneByOrFail({ id });
            if (res.role === role_enum_1.Role.ADMIN) {
                throw (0, apiError_1.ApiError)(http_status_codes_1.StatusCodes.BAD_REQUEST, `you cannot delete admin`);
            }
            if (res.image) {
                yield (0, baseAWS_1.deleteObject)(app_1.config.s3Bucket, app_1.config.s3BucketForder + res.image);
            }
            return user_repository_1.UserRepository.delete({ id });
        });
    }
};
UserService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], UserService);
exports.UserService = UserService;
