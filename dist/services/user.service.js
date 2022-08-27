"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
const typedi_1 = require("typedi");
const image_repository_1 = require("@repos/image.repository");
let UserService = class UserService {
    getList(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const [users, total] = yield user_repository_1.UserRepository.getList(request);
            users.forEach((user) => {
                if (user.avartar) {
                    user.avartar = JSON.parse(user.avartar);
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
                const image = yield image_repository_1.ImageRepository.findOneByOrFail({
                    id: request.image.id,
                });
                user.avartar = JSON.stringify(image);
            }
            for (const key in request) {
                if (user.hasOwnProperty(key)) {
                    if (key === "images") {
                        continue;
                    }
                    if (key === "avartar") {
                        continue;
                    }
                    user[key] = request[key];
                }
            }
            const result = yield user_repository_1.UserRepository.save(user);
            if (result.avartar) {
                result.avartar = JSON.parse(result.avartar);
            }
            return result;
        });
    }
    detail(id, user = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user && user.role === role_enum_1.Role.USER) {
                id = user && (user === null || user === void 0 ? void 0 : user.id) ? user === null || user === void 0 ? void 0 : user.id : id;
            }
            const userResult = yield user_repository_1.UserRepository.findOneByOrFail({ id });
            if (userResult.avartar) {
                userResult.avartar = JSON.parse(userResult.avartar);
            }
            return userResult;
        });
    }
};
UserService = __decorate([
    (0, typedi_1.Service)()
], UserService);
exports.UserService = UserService;
